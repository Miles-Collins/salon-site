"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useToast } from "@/components/Toast";

// Minimal manager for before/after transformations
// Uses gallery list API and filters items marked is_before_after=true

type Item = {
  name: string;
  url: string;
  caption?: string | null;
  display_order?: number | null;
  before_image?: string | null;
};

export default function TransformationsManager() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [beforeImage, setBeforeImage] = useState("");
  const [displayOrder, setDisplayOrder] = useState<string>("");
  const toast = useToast();

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/owner/gallery/list");
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      const json = await res.json();
      const filtered = (json.items || [])
        .filter((i: any) => i.is_before_after)
        .map((i: any) => ({
          name: i.name,
          url: i.url,
          caption: i.caption || null,
          display_order: i.display_order ?? null,
          before_image: i.before_image || null,
        })) as Item[];
      setItems(filtered);
    } catch (e: any) {
      setError(e?.message || "Failed to load");
      toast.error("Failed to load transformations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const onUpload = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("is_before_after", "true");
      if (caption.trim()) form.append("caption", caption.trim());
      if (beforeImage.trim()) form.append("before_image", beforeImage.trim());
      if (displayOrder.trim()) form.append("display_order", displayOrder.trim());

      const res = await fetch("/api/owner/gallery/upload", { method: "POST", body: form });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Upload failed");
      }
      setCaption("");
      setBeforeImage("");
      setDisplayOrder("");
      await refresh();
      toast.success("Transformation uploaded");
    } catch (e: any) {
      setError(e?.message || "Upload failed");
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (name: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/owner/gallery/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Delete failed");
      }
      await refresh();
      toast.success("Deleted");
    } catch (e: any) {
      setError(e?.message || "Delete failed");
      toast.error("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const onSave = async (item: Item) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/owner/gallery/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: item.name,
          caption: item.caption ?? null,
          display_order: typeof item.display_order === "number" ? item.display_order : null,
          is_before_after: true,
          before_image: item.before_image ?? null,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Save failed");
      }
      await refresh();
      toast.success("Saved");
    } catch (e: any) {
      setError(e?.message || "Save failed");
      toast.error("Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Upload Transformation</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm text-gray-700">
            Caption (optional)
            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="border rounded px-3 py-2 text-sm"
              placeholder="Color correction, vivid copper, etc."
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-gray-700">
            Before image filename (optional)
            <input
              value={beforeImage}
              onChange={(e) => setBeforeImage(e.target.value)}
              className="border rounded px-3 py-2 text-sm"
              placeholder="Existing gallery filename"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-gray-700">
            Display order (optional)
            <input
              value={displayOrder}
              onChange={(e) => setDisplayOrder(e.target.value)}
              className="border rounded px-3 py-2 text-sm"
              placeholder="1, 2, 3..."
              inputMode="numeric"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-gray-700">
            After image file
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onUpload(file).finally(() => (e.target.value = ""));
              }}
              className="border rounded px-3 py-2 text-sm"
            />
          </label>
        </div>
        {loading && <p className="text-sm text-gray-500">Working...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.name} className="bg-white rounded-lg shadow p-3 space-y-3">
            <div className="relative aspect-[4/5] w-full rounded-md overflow-hidden bg-gray-100">
              <Image
                src={item.url}
                alt={item.caption || item.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="space-y-2">
              <div>
                <label className="text-xs text-gray-500">Caption</label>
                <input
                  value={item.caption || ""}
                  onChange={(e) =>
                    setItems((prev) => prev.map((x) => (x.name === item.name ? { ...x, caption: e.target.value } : x)))
                  }
                  className="mt-1 w-full border rounded px-2 py-1 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex flex-col text-xs text-gray-500">
                  Display order
                  <input
                    value={item.display_order ?? ""}
                    onChange={(e) =>
                      setItems((prev) => prev.map((x) => (x.name === item.name ? { ...x, display_order: Number(e.target.value) || null } : x)))
                    }
                    className="mt-1 border rounded px-2 py-1 text-sm"
                    inputMode="numeric"
                  />
                </label>
                <label className="flex flex-col text-xs text-gray-500">
                  Before image filename
                  <input
                    value={item.before_image || ""}
                    onChange={(e) =>
                      setItems((prev) => prev.map((x) => (x.name === item.name ? { ...x, before_image: e.target.value } : x)))
                    }
                    className="mt-1 border rounded px-2 py-1 text-sm"
                  />
                </label>
              </div>
            </div>
            <div className="flex gap-2 justify-between text-sm">
              <button
                onClick={() => onSave(item)}
                className="px-3 py-2 bg-slate-800 text-white rounded hover:bg-slate-700 transition"
              >
                Save
              </button>
              <button
                onClick={() => onDelete(item.name)}
                className="px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && !loading && !error && (
        <p className="text-sm text-gray-500">No transformations yet. Upload an after image to add one.</p>
      )}
    </div>
  );
}
