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
  bucket?: string;
};

type DeleteConfirmation = {
  isOpen: boolean;
  itemName: string | null;
  itemCaption: string | null;
  bucket?: string;
};

export default function GalleryManager() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dragOverDropZone, setDragOverDropZone] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmation>({
    isOpen: false,
    itemName: null,
    itemCaption: null,
    bucket: undefined,
  });
  const toast = useToast();

  const openDeleteConfirm = (name: string, caption: string | null, bucket?: string) => {
    setDeleteConfirm({
      isOpen: true,
      itemName: name,
      itemCaption: caption,
      bucket: bucket,
    });
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirm({
      isOpen: false,
      itemName: null,
      itemCaption: null,
      bucket: undefined,
    });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.itemName) return;
    const name = deleteConfirm.itemName;
    const bucket = deleteConfirm.bucket || "gallery";
    closeDeleteConfirm();
    
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/owner/gallery/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bucket }),
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
      // Filter to only gallery bucket items (not transformations or services)
      const galleryItems = (json.items || []).filter((item: Item) => !item.bucket || item.bucket === "gallery");
      setItems(galleryItems);
    } catch (e: any) {
      console.error("Gallery load error:", e);
      setError(e?.message || "Failed to load gallery");
      toast.error("Failed to load gallery");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const onUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
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
      toast.success("Image uploaded successfully");
      setDragOverDropZone(false);
    } catch (e: any) {
      setError(e?.message || "Upload failed");
      toast.error("Upload failed");
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
          bucket: it.bucket ?? "gallery",
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      await refresh();
      setEditingId(null);
      toast.success("Changes saved");
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
    <div className="space-y-6">
      {/* Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOverDropZone(true);
        }}
        onDragLeave={() => setDragOverDropZone(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOverDropZone(false);
          onUpload(e.dataTransfer.files);
        }}
        className={`relative border-2 border-dashed rounded-2xl p-12 transition-all ${
          dragOverDropZone
            ? "border-purple-500 bg-purple-50"
            : "border-gray-300 bg-gray-50 hover:border-purple-400 hover:bg-purple-50/50"
        }`}
      >
        <div className="flex flex-col items-center justify-center gap-3">
          <div className={`p-3 rounded-xl ${dragOverDropZone ? 'bg-purple-200' : 'bg-white border border-gray-200'}`}>
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {dragOverDropZone ? "Drop your image" : "Drop image or click to upload"}
            </h3>
            <p className="text-sm text-gray-600">Drag and drop your photo here, or use the button below</p>
          </div>
          <label className="mt-3 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium cursor-pointer hover:from-purple-700 hover:to-indigo-700 transition-all">
            Choose Image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onUpload(e.target.files)}
              disabled={loading}
            />
          </label>
        </div>
      </div>

      {/* Status Messages */}
      {(loading || error) && (
        <div className={`rounded-lg p-4 ${loading ? 'bg-blue-50 border border-blue-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex items-center gap-3">
            {loading && (
              <>
                <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-sm font-medium text-blue-700">Processing...</span>
              </>
            )}
            {error && !loading && (
              <>
                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
                <span className="text-sm font-medium text-red-700">{error}</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      {items.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No images yet</h3>
          <p className="text-gray-600">Start by uploading your first gallery image</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((it) => (
            <div 
              key={it.name} 
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
            >
              {/* Image Container */}
              <div className="relative w-full h-48 bg-gray-100 overflow-hidden group">
                <img
                  src={it.url}
                  alt={it.caption || it.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => setEditingId(editingId === it.name ? null : it.name)}
                    className="p-2 bg-white/90 hover:bg-white rounded-lg shadow-lg transition-all"
                    title={editingId === it.name ? "Close" : "Edit"}
                  >
                    {editingId === it.name ? (
                      <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => openDeleteConfirm(it.name, it.caption || null, it.bucket)}
                    className="p-2 bg-red-500/90 hover:bg-red-600 rounded-lg shadow-lg transition-all"
                    title="Delete"
                  >
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Info Section */}
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Filename</p>
                  <p className="text-sm font-mono text-gray-700 truncate">{it.name}</p>
                </div>

                {editingId === it.name ? (
                  <div className="space-y-3 pt-2 border-t border-gray-100">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Caption</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow text-sm"
                        value={it.caption || ""}
                        onChange={(e) => updateItem(it.name, { caption: e.target.value })}
                        placeholder="Add a caption"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow text-sm"
                        value={(it.tags || []).join(", ")}
                        onChange={(e) => updateItem(it.name, { tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })}
                        placeholder="color, balayage, extensions"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Display Order</label>
                      <input
                        type="number"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow text-sm"
                        value={typeof it.display_order === "number" ? it.display_order : ""}
                        onChange={(e) => updateItem(it.name, { display_order: e.target.value === "" ? null : parseInt(e.target.value, 10) })}
                        placeholder="Lower numbers appear first"
                      />
                    </div>
                    <div className="flex items-center gap-2 py-2">
                      <input
                        id={`before-after-${it.name}`}
                        type="checkbox"
                        checked={it.is_before_after || false}
                        onChange={(e) => updateItem(it.name, { is_before_after: e.target.checked })}
                        className="w-4 h-4 text-purple-600 rounded border-gray-300"
                      />
                      <label htmlFor={`before-after-${it.name}`} className="text-sm text-gray-700 cursor-pointer">
                        Mark as Before/After Transformation
                      </label>
                    </div>
                    <div className="flex gap-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => setEditingId(null)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => onSave(it)}
                        disabled={loading}
                        className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 font-medium text-sm"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {it.caption && (
                      <p className="text-sm text-gray-700 line-clamp-2">{it.caption}</p>
                    )}
                    {it.tags && it.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {it.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                        {it.tags.length > 2 && (
                          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            +{it.tags.length - 2} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Image?</h3>
                {deleteConfirm.itemCaption && (
                  <p className="text-sm text-gray-600 mt-0.5">
                    {deleteConfirm.itemCaption}
                  </p>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-600">
              This action cannot be undone. The image will be permanently removed from your gallery.
            </p>
            <div className="flex gap-3 justify-end pt-2">
              <button
                onClick={closeDeleteConfirm}
                className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 font-medium"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
