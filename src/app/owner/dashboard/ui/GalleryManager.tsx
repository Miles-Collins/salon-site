"use client";
import React, { useEffect, useState } from "react";
import { useToast } from "@/components/Toast";
import Image from "next/image";

type Item = { 
  name: string; 
  url: string; 
  caption?: string | null; 
  tags?: string[]; 
  display_order?: number | null;
  is_before_after?: boolean;
  before_image?: string | null;
};

type DeleteConfirmation = {
  isOpen: boolean;
  itemName: string | null;
  itemCaption: string | null;
};

export default function GalleryManager() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmation>({
    isOpen: false,
    itemName: null,
    itemCaption: null,
  });
  const toast = useToast();

  const openDeleteConfirm = (name: string, caption: string | null) => {
    setDeleteConfirm({
      isOpen: true,
      itemName: name,
      itemCaption: caption,
    });
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirm({
      isOpen: false,
      itemName: null,
      itemCaption: null,
    });
  };

  const handleDragStart = (e: React.DragEvent, name: string) => {
    setDraggedItem(name);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedItem) {
      const item = items.find((x) => x.name === draggedItem);
      if (item) {
        openDeleteConfirm(draggedItem, item.caption || null);
      }
      setDraggedItem(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.itemName) return;
    const name = deleteConfirm.itemName;
    closeDeleteConfirm();
    
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

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/owner/gallery/list");
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }
      const json = await res.json();
      console.log("Gallery items loaded:", json.items?.length);
      setItems(json.items || []);
      if (json.items?.length === 0) {
        setError(null);
      }
    } catch (e: any) {
      console.error("Gallery load error:", e);
      setError(e?.message || "Failed to load gallery");
      toast.error("Failed to load gallery: " + (e?.message || "Unknown error"));
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

  const onDelete = async (name: string, caption: string | null) => {
    openDeleteConfirm(name, caption);
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <label htmlFor="gallery-upload" className="text-sm">Upload image</label>
          <input id="gallery-upload" title="Upload image" type="file" accept="image/*" onChange={onUpload} />
        </div>
        {loading && <span className="text-sm text-gray-500">Working…</span>}
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>

      {items.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900 mb-3">
            No images found in Supabase storage. Migrate hardcoded gallery images?
          </p>
          <button
            onClick={async () => {
              setLoading(true);
              try {
                const res = await fetch("/api/owner/migrate-gallery", {
                  method: "POST",
                });
                if (res.ok) {
                  await refresh();
                  toast.success("Gallery images migrated!");
                } else {
                  const data = await res.json();
                  throw new Error(data.error || "Migration failed");
                }
              } catch (e: any) {
                setError(e.message);
                toast.error("Migration failed: " + e.message);
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 text-sm font-medium"
          >
            {loading ? "Migrating..." : "Migrate Gallery Images"}
          </button>
        </div>
      )}
      
      {items.length === 0 ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-500 text-sm mb-2">No images in gallery yet</p>
          <p className="text-gray-400 text-xs">Upload your first image using the file picker above</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((it) => (
          <div 
            key={it.name} 
            className="border rounded p-3 space-y-2"
            draggable
            onDragStart={(e) => handleDragStart(e, it.name)}
          >
            <div className="relative group">
              <div className="relative w-full h-40 bg-gray-100 rounded overflow-hidden">
                <img
                  src={it.url}
                  alt={it.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error("Image load error:", it.url, e);
                  }}
                />
              </div>
              <button
                className="absolute top-2 right-2 bg-black/60 hover:bg-red-600 text-white text-xs px-2 py-1 rounded transition-colors"
                onClick={() => onDelete(it.name, it.caption || null)}
                title="Delete image or drag to trash zone"
              >
                Delete
              </button>
              <div 
                className="absolute inset-0 rounded border-2 border-dashed border-red-400 bg-red-500/10 flex items-center justify-center opacity-0 group-hover:opacity-0 pointer-events-none"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <span className="text-white text-sm font-semibold bg-black/70 px-3 py-2 rounded">
                  Drop to delete
                </span>
              </div>
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
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Image?</h3>
              {deleteConfirm.itemCaption && (
                <p className="text-sm text-gray-600 mt-1">
                  <strong>{deleteConfirm.itemCaption}</strong>
                </p>
              )}
              <p className="text-sm text-gray-600 mt-2">
                File: <code className="bg-gray-100 px-2 py-1 rounded text-xs">{deleteConfirm.itemName}</code>
              </p>
            </div>
            <p className="text-sm text-gray-700">
              This action cannot be undone. Are you sure you want to delete this image?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={closeDeleteConfirm}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete Image"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
