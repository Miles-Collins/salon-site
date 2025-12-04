"use client";
import React, { useEffect, useState } from "react";
import { useToast } from "@/components/Toast";

type Item = { 
  name: string; 
  url: string; 
  caption?: string | null; 
  tags?: string[]; 
  display_order?: number | null;
  is_before_after?: boolean;
  before_image?: string | null;
};

export default function GalleryManager() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/owner/gallery/list");
      const json = await res.json();
      setItems(json.items || []);
      toast.info("Gallery loaded");
    } catch (e: any) {
      setError(e?.message || "Failed to load gallery");
      toast.error("Failed to load gallery");
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
      toast.success("Image uploaded");
    } catch (e: any) {
      setError(e?.message || "Upload failed");
      toast.error("Upload failed");
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
      toast.success("Image deleted");
    } catch (e: any) {
      setError(e?.message || "Delete failed");
      toast.error("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const onSave = async (it: Item) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/owner/gallery/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: it.name,
          caption: it.caption ?? null,
          tags: it.tags ?? [],
          display_order: typeof it.display_order === "number" ? it.display_order : null,
          is_before_after: it.is_before_after ?? false,
          before_image: it.before_image ?? null,
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      await refresh();
      toast.success("Saved");
    } catch (e: any) {
      setError(e?.message || "Save failed");
      toast.error("Save failed");
    } finally {
      setLoading(false);
    }
  };

  const updateItem = (name: string, patch: Partial<Item>) => {
    setItems((prev) => prev.map((x) => (x.name === name ? { ...x, ...patch } : x)));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label htmlFor="gallery-upload" className="text-sm">Upload image</label>
        <input id="gallery-upload" title="Upload image" type="file" accept="image/*" onChange={onUpload} />
        {loading && <span className="text-sm text-gray-500">Working…</span>}
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((it) => (
          <div key={it.name} className="border rounded p-3 space-y-2">
            <div className="relative">
              <img src={it.url} alt={it.name} className="w-full h-40 object-cover rounded" />
              <button
                className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded"
                onClick={() => onDelete(it.name)}
                title="Delete image"
              >
                Delete
              </button>
            </div>
            <div className="space-y-2">
              <div>
                <label className="block text-xs text-gray-600">Caption</label>
                <input
                  type="text"
                  className="w-full border rounded px-2 py-1"
                  value={it.caption || ""}
                  onChange={(e) => updateItem(it.name, { caption: e.target.value })}
                  placeholder="e.g. Vivid color transformation"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600">Tags (comma-separated)</label>
                <input
                  type="text"
                  className="w-full border rounded px-2 py-1"
                  value={(it.tags || []).join(", ")}
                  onChange={(e) => updateItem(it.name, { tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })}
                  placeholder="color, balayage, extensions"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600">Order (lower shows first)</label>
                <input
                  type="number"
                  className="w-full border rounded px-2 py-1"
                  value={typeof it.display_order === "number" ? it.display_order : ""}
                  onChange={(e) => updateItem(it.name, { display_order: e.target.value === "" ? null : parseInt(e.target.value, 10) })}
                  placeholder="e.g. 1"
                />
              </div>
              <div className="flex items-center gap-2 py-2">
                <input
                  id={`before-after-${it.name}`}
                  type="checkbox"
                  checked={it.is_before_after || false}
                  onChange={(e) => updateItem(it.name, { is_before_after: e.target.checked })}
                />
                <label htmlFor={`before-after-${it.name}`} className="text-xs text-gray-700 cursor-pointer">
                  Before/After Transformation
                </label>
              </div>
              {it.is_before_after && (
                <div>
                  <label htmlFor={`before-image-${it.name}`} className="block text-xs text-gray-600 mb-2">Before Image (select from gallery)</label>
                  <select
                    id={`before-image-${it.name}`}
                    className="w-full border rounded px-2 py-1 text-sm"
                    value={it.before_image || ""}
                    onChange={(e) => updateItem(it.name, { before_image: e.target.value || null })}
                    title="Select before image"
                  >
                    <option value="">-- Select a before image --</option>
                    {items
                      .filter((img) => img.name !== it.name)
                      .map((img) => (
                        <option key={img.name} value={img.name}>
                          {img.name}
                        </option>
                      ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    This image will be shown with the slider on the left side
                  </p>
                </div>
              )}
              <div className="flex justify-end gap-2">
                <button className="px-3 py-1 border rounded" onClick={() => onSave(it)} title="Save changes">Save</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
