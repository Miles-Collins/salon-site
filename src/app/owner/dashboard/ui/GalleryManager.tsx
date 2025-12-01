"use client";
import React, { useEffect, useState } from "react";

type Item = { name: string; url: string };

export default function GalleryManager() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/owner/gallery/list");
      const json = await res.json();
      setItems(json.items || []);
    } catch (e: any) {
      setError(e?.message || "Failed to load gallery");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/owner/gallery/upload", {
        method: "POST",
        body: form,
      });
      if (!res.ok) throw new Error("Upload failed");
      await refresh();
    } catch (e: any) {
      setError(e?.message || "Upload failed");
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  const onDelete = async (name: string) => {
    if (!confirm(`Delete ${name}?`)) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/owner/gallery/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("Delete failed");
      await refresh();
    } catch (e: any) {
      setError(e?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label htmlFor="gallery-upload" className="text-sm">Upload image</label>
        <input id="gallery-upload" title="Upload image" type="file" accept="image/*" onChange={onUpload} />
        {loading && <span className="text-sm text-gray-500">Working…</span>}
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {items.map((it) => (
          <div key={it.name} className="relative group">
            <img src={it.url} alt={it.name} className="w-full h-40 object-cover rounded" />
            <button
              className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100"
              onClick={() => onDelete(it.name)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
