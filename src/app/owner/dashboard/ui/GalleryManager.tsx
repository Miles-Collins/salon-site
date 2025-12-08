"use client";
import React, { useEffect, useState } from "react";
import { useToast } from "@/components/Toast";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";

type Item = { 
  name: string; 
  url: string; 
  caption?: string | null; 
  tags?: string[]; 
  display_order?: number | null;
  is_before_after?: boolean;
  before_image?: string | null;
  bucket?: string;
  created_at?: string;
};

type DeleteConfirmation = {
  isOpen: boolean;
  itemName: string | null;
  itemCaption: string | null;
  itemUrl?: string | null;
  bucket?: string;
  items?: { name: string; caption: string | null; url: string; bucket?: string }[];
  mode?: "single" | "bulk";
};

type UploadFile = {
  id: string;
  file: File;
  preview: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
};

export default function GalleryManager() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [unsavedChanges, setUnsavedChanges] = useState<Set<string>>(new Set());
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set());
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{ items: Item[]; timer: NodeJS.Timeout | null } | null>(null);
  const historyRef = React.useRef<Record<string, Item[]>>({});
  const historyIndexRef = React.useRef<Record<string, number>>({});
  const autoSaveTimers = React.useRef<Record<string, NodeJS.Timeout>>({});
  const [lightboxImage, setLightboxImage] = useState<{ url: string; caption: string } | null>(null);
  const [dragOverDropZone, setDragOverDropZone] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<UploadFile[]>([]);
  const [showUploadPreview, setShowUploadPreview] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "before" | "standard">("all");
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmation>({
    isOpen: false,
    itemName: null,
    itemCaption: null,
    itemUrl: null,
    bucket: undefined,
    items: [],
    mode: "single",
  });
  const toast = useToast();

  const openDeleteConfirm = (name: string, caption: string | null, url: string, bucket?: string) => {
    setDeleteConfirm({
      isOpen: true,
      itemName: name,
      itemCaption: caption,
      itemUrl: url,
      bucket: bucket,
      items: [{ name, caption, url, bucket }],
      mode: "single",
    });
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirm({
      isOpen: false,
      itemName: null,
      itemCaption: null,
      itemUrl: null,
      bucket: undefined,
      items: [],
      mode: "single",
    });
  };

  const performDeleteNow = async (itemsToDelete: Item[]) => {
    try {
      for (const it of itemsToDelete) {
        const res = await fetch("/api/owner/gallery/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: it.name, bucket: it.bucket || "gallery" }),
        });
        if (!res.ok) throw new Error("Delete failed");
      }
      toast.success(itemsToDelete.length > 1 ? "Images deleted" : "Image deleted");
      await refresh();
    } catch (e: any) {
      setError(e?.message || "Delete failed");
      toast.error("Delete failed");
    }
  };

  const confirmDelete = () => {
    const targetItems = (deleteConfirm.items || []).length
      ? (deleteConfirm.items || []).map((it) => items.find((x) => x.name === it.name)).filter(Boolean) as Item[]
      : deleteConfirm.itemName
        ? (items.filter((x) => x.name === deleteConfirm.itemName))
        : [];

    if (targetItems.length === 0) {
      closeDeleteConfirm();
      return;
    }

    closeDeleteConfirm();

    // Optimistic remove with 5s undo window
    setItems((prev) => prev.filter((x) => !targetItems.some((t) => t.name === x.name)));
    setSelectedItems((prev) => {
      const next = new Set(prev);
      targetItems.forEach((t) => next.delete(t.name));
      return next;
    });

    const timer = setTimeout(() => {
      setPendingDelete(null);
      performDeleteNow(targetItems);
    }, 5000);

    setPendingDelete({ items: targetItems, timer });
  };

  const undoPendingDelete = () => {
    if (!pendingDelete) return;
    if (pendingDelete.timer) clearTimeout(pendingDelete.timer);
    setItems((prev) => {
      const merged = [...prev, ...pendingDelete.items];
      return merged.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
    });
    setPendingDelete(null);
    toast.success("Deletion undone");
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

  const markUnsaved = (name: string) => {
    setUnsavedChanges((prev) => new Set(prev).add(name));
  };

  const clearUnsaved = (name: string) => {
    setUnsavedChanges((prev) => {
      const next = new Set(prev);
      next.delete(name);
      return next;
    });
  };

  const pushHistory = (name: string, snapshot: Item) => {
    const history = historyRef.current[name] || [];
    const index = historyIndexRef.current[name] ?? history.length - 1;
    const trimmed = history.slice(0, index + 1);
    const next = [...trimmed, snapshot].slice(-10);
    historyRef.current[name] = next;
    historyIndexRef.current[name] = next.length - 1;
  };

  const undo = (name: string) => {
    const history = historyRef.current[name] || [];
    const idx = historyIndexRef.current[name] ?? history.length - 1;
    if (idx <= 0) return;
    const nextIdx = idx - 1;
    const snapshot = history[nextIdx];
    setItems((prev) => prev.map((x) => (x.name === name ? { ...x, ...snapshot } : x)));
    historyIndexRef.current[name] = nextIdx;
    markUnsaved(name);
  };

  const redo = (name: string) => {
    const history = historyRef.current[name] || [];
    const idx = historyIndexRef.current[name] ?? history.length - 1;
    if (idx >= history.length - 1) return;
    const nextIdx = idx + 1;
    const snapshot = history[nextIdx];
    setItems((prev) => prev.map((x) => (x.name === name ? { ...x, ...snapshot } : x)));
    historyIndexRef.current[name] = nextIdx;
    markUnsaved(name);
  };

  const queueAutoSave = (it: Item) => {
    const timer = autoSaveTimers.current[it.name];
    if (timer) clearTimeout(timer);
    autoSaveTimers.current[it.name] = setTimeout(() => {
      onSave(it, { auto: true });
    }, 1200);
  };

  const toggleSelect = (name: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const clearSelection = () => setSelectedItems(new Set());

  const handleDragStart = (name: string) => setDraggingId(name);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, targetName: string) => {
    e.preventDefault();
    if (draggingId === targetName) return;
  };

  const handleDrop = (targetName: string) => {
    if (!draggingId || draggingId === targetName) return;
    setItems((prev) => {
      const fromIndex = prev.findIndex((x) => x.name === draggingId);
      const toIndex = prev.findIndex((x) => x.name === targetName);
      if (fromIndex === -1 || toIndex === -1) return prev;
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      // Reassign display_order based on new positions
      const withOrder = updated.map((it, idx) => ({ ...it, display_order: idx + 1 }));
      withOrder.forEach((it) => {
        markUnsaved(it.name);
        queueAutoSave(it);
      });
      return withOrder;
    });
    setDraggingId(null);
  };

  const filteredItems = items
    .filter((it) => {
      const q = searchTerm.trim().toLowerCase();
      if (q) {
        const inText = (it.caption || it.name || "").toLowerCase().includes(q);
        const inTags = (it.tags || []).some((t) => t.toLowerCase().includes(q));
        if (!inText && !inTags) return false;
      }
      if (filterMode === "before" && !it.is_before_after) return false;
      if (filterMode === "standard" && it.is_before_after) return false;
      return true;
    })
    .sort((a, b) => {
      const ao = a.display_order ?? Number.MAX_SAFE_INTEGER;
      const bo = b.display_order ?? Number.MAX_SAFE_INTEGER;
      if (ao !== bo) return ao - bo;
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    });

  const openBulkDelete = () => {
    if (selectedItems.size === 0) return;
    const targets = items.filter((it) => selectedItems.has(it.name)).map((it) => ({
      name: it.name,
      caption: it.caption || null,
      url: it.url,
      bucket: it.bucket,
    }));
    setDeleteConfirm({
      isOpen: true,
      itemName: null,
      itemCaption: null,
      itemUrl: null,
      bucket: undefined,
      items: targets,
      mode: "bulk",
    });
  };

  const handleFileSelection = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newFiles: UploadFile[] = [];
    const errors: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        errors.push(`${file.name}: Not an image file`);
        continue;
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        errors.push(`${file.name}: File size exceeds 10MB`);
        continue;
      }

      // Create preview URL
      const preview = URL.createObjectURL(file);

      newFiles.push({
        id: `${Date.now()}-${i}`,
        file,
        preview,
        progress: 0,
        status: 'pending',
      });
    }

    if (errors.length > 0) {
      toast.error(errors.join(', '));
    }

    if (newFiles.length > 0) {
      setUploadQueue(prev => [...prev, ...newFiles]);
      setShowUploadPreview(true);
    }
  };

  const removeFromQueue = (id: string) => {
    setUploadQueue(prev => {
      const file = prev.find(f => f.id === id);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const clearCompletedUploads = () => {
    setUploadQueue(prev => {
      prev.forEach(f => {
        if (f.preview && (f.status === 'success' || f.status === 'error')) {
          URL.revokeObjectURL(f.preview);
        }
      });
      return prev.filter(f => f.status === 'pending' || f.status === 'uploading');
    });
  };

  const uploadSingleFile = async (uploadFile: UploadFile) => {
    const form = new FormData();
    form.append("file", uploadFile.file);

    // Update status to uploading
    setUploadQueue(prev => prev.map(f => 
      f.id === uploadFile.id ? { ...f, status: 'uploading' as const, progress: 0 } : f
    ));

    try {
      const res = await fetch("/api/owner/gallery/upload", {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Upload failed");
      }

      // Simulate progress for visual feedback
      for (let progress = 0; progress <= 100; progress += 20) {
        setUploadQueue(prev => prev.map(f => 
          f.id === uploadFile.id ? { ...f, progress } : f
        ));
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // Mark as success
      setUploadQueue(prev => prev.map(f => 
        f.id === uploadFile.id ? { ...f, status: 'success' as const, progress: 100 } : f
      ));

      toast.success(`${uploadFile.file.name} uploaded successfully`);
    } catch (e: any) {
      setUploadQueue(prev => prev.map(f => 
        f.id === uploadFile.id ? { 
          ...f, 
          status: 'error' as const, 
          error: e?.message || "Upload failed" 
        } : f
      ));
      toast.error(`${uploadFile.file.name}: ${e?.message || "Upload failed"}`);
    }
  };

  const startUpload = async () => {
    const pendingFiles = uploadQueue.filter(f => f.status === 'pending');
    if (pendingFiles.length === 0) return;

    setUploading(true);
    setError(null);

    // Upload files sequentially to avoid overwhelming the server
    for (const file of pendingFiles) {
      await uploadSingleFile(file);
    }

    setUploading(false);
    await refresh();
    
    // Auto-clear completed uploads after a short delay
    setTimeout(() => {
      clearCompletedUploads();
      if (uploadQueue.every(f => f.status === 'success' || f.status === 'error')) {
        setShowUploadPreview(false);
      }
    }, 2000);
  };

  const onUpload = async (files: FileList | null) => {
    handleFileSelection(files);
  };

  const onSave = async (it: Item, opts: { auto?: boolean } = {}) => {
    setSavingIds((prev) => new Set(prev).add(it.name));
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
      clearUnsaved(it.name);
      if (!opts.auto) {
        setEditingId(null);
        toast.success("Changes saved");
      }
    } catch (e: any) {
      setError(e?.message || "Save failed");
      if (!opts.auto) toast.error("Save failed");
    } finally {
      setSavingIds((prev) => {
        const next = new Set(prev);
        next.delete(it.name);
        return next;
      });
    }
  };

  const updateItem = (name: string, patch: Partial<Item>) => {
    setItems((prev) => {
      let previous: Item | null = null;
      let nextItem: Item | null = null;

      const updated = prev.map((x) => {
        if (x.name !== name) return x;
        previous = x;
        nextItem = { ...x, ...patch };
        return nextItem;
      });

      if (previous && nextItem) {
        pushHistory(name, previous);
        markUnsaved(name);
        queueAutoSave(nextItem);
      }

      return updated;
    });
  };

  // Skeleton loader component
  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <Skeleton className="w-full h-48" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex gap-2 mt-3">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gallery Manager</h2>
          <p className="text-sm text-gray-600 mt-1">
            Upload and manage your salon photos
            {items.length > 0 && ` • ${items.length} image${items.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Button
          onClick={refresh}
          disabled={loading}
          variant="secondary"
          size="md"
          className="shadow-sm"
          leftIcon={
            <svg 
              className={`w-4 h-4 text-gray-700 ${loading ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          }
          title="Refresh gallery"
        >
          Refresh
        </Button>
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOverDropZone(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragOverDropZone(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragOverDropZone(false);
          onUpload(e.dataTransfer.files);
        }}
        className={`relative border-2 border-dashed rounded-2xl p-10 transition-all duration-200 ${
          dragOverDropZone
            ? "border-purple-500 bg-purple-50 scale-[1.02] shadow-lg"
            : "border-gray-300 bg-gradient-to-br from-gray-50 to-white hover:border-purple-400 hover:bg-purple-50/30"
        }`}
      >
        <div className="flex flex-col items-center justify-center gap-4">
          <div className={`p-4 rounded-2xl transition-all duration-200 ${
            dragOverDropZone 
              ? 'bg-purple-200 scale-110' 
              : 'bg-white border-2 border-gray-200 shadow-sm'
          }`}>
            <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {dragOverDropZone ? "Drop your images here" : "Upload Gallery Images"}
            </h3>
            <p className="text-sm text-gray-600 max-w-sm">
              {dragOverDropZone
                ? "Release to add images to upload queue"
                : "Drag and drop images here, or click the button below to browse"
              }
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Supports: JPG, PNG, WebP • Max size: 10MB per image • Multiple files supported
            </p>
          </div>
          {!uploading && (
            <label className="mt-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold cursor-pointer hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105">
              Choose Images
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => onUpload(e.target.files)}
                disabled={loading || uploading}
              />
            </label>
          )}
        </div>
      </div>

      {/* Upload Preview Modal */}
      {showUploadPreview && uploadQueue.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-purple-50 to-indigo-50">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Upload Queue</h3>
                <p className="text-sm text-gray-600 mt-0.5">
                  {uploadQueue.length} image{uploadQueue.length !== 1 ? 's' : ''} ready to upload
                </p>
              </div>
              <button
                onClick={() => {
                  if (!uploading) {
                    uploadQueue.forEach(f => {
                      if (f.preview) URL.revokeObjectURL(f.preview);
                    });
                    setUploadQueue([]);
                    setShowUploadPreview(false);
                  }
                }}
                disabled={uploading}
                className="p-2 rounded-lg hover:bg-white/80 transition-colors disabled:opacity-50"
                title="Close preview"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Preview Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {uploadQueue.map((uploadFile) => (
                  <div
                    key={uploadFile.id}
                    className="relative bg-gray-50 rounded-xl overflow-hidden border-2 border-gray-200 group"
                  >
                    {/* Image Preview */}
                    <div className="aspect-square relative">
                      <Image
                        src={uploadFile.preview}
                        alt={uploadFile.file.name}
                        fill
                        className="object-cover"
                      />
                      
                      {/* Status Overlay */}
                      {uploadFile.status === 'uploading' && (
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                          <div className="text-center">
                            <svg className="animate-spin h-8 w-8 text-white mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="text-white text-sm font-medium">{uploadFile.progress}%</p>
                          </div>
                        </div>
                      )}
                      
                      {uploadFile.status === 'success' && (
                        <div className="absolute inset-0 bg-green-500/20 backdrop-blur-sm flex items-center justify-center">
                          <div className="bg-green-500 rounded-full p-2">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                      )}
                      
                      {uploadFile.status === 'error' && (
                        <div className="absolute inset-0 bg-red-500/20 backdrop-blur-sm flex items-center justify-center">
                          <div className="bg-red-500 rounded-full p-2">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </div>
                        </div>
                      )}

                      {/* Remove Button */}
                      {uploadFile.status === 'pending' && (
                        <button
                          onClick={() => removeFromQueue(uploadFile.id)}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                          title="Remove from queue"
                        >
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="p-3 bg-white">
                      <p className="text-xs font-medium text-gray-900 truncate" title={uploadFile.file.name}>
                        {uploadFile.file.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      {uploadFile.status === 'error' && uploadFile.error && (
                        <p className="text-xs text-red-600 mt-1 font-medium">{uploadFile.error}</p>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {uploadFile.status === 'uploading' && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                        <div
                          className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-300"
                          style={{ width: `${uploadFile.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {uploadQueue.filter(f => f.status === 'success').length > 0 && (
                  <span className="text-green-600 font-medium">
                    {uploadQueue.filter(f => f.status === 'success').length} uploaded
                  </span>
                )}
                {uploadQueue.filter(f => f.status === 'error').length > 0 && (
                  <span className="text-red-600 font-medium ml-3">
                    {uploadQueue.filter(f => f.status === 'error').length} failed
                  </span>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={clearCompletedUploads}
                  disabled={uploading || !uploadQueue.some(f => f.status === 'success' || f.status === 'error')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Clear Completed
                </button>
                <button
                  onClick={startUpload}
                  disabled={uploading || !uploadQueue.some(f => f.status === 'pending')}
                  className="px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {uploading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      Upload {uploadQueue.filter(f => f.status === 'pending').length} Image{uploadQueue.filter(f => f.status === 'pending').length !== 1 ? 's' : ''}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and bulk bar */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1">
            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by caption, filename, or tag"
              className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            {([
              { key: "all", label: "All" },
              { key: "standard", label: "Standard" },
              { key: "before", label: "Before/After" },
            ] as const).map((option) => (
              <button
                key={option.key}
                onClick={() => setFilterMode(option.key)}
                className={`px-3 py-2 text-sm font-medium rounded-xl border transition-colors ${
                  filterMode === option.key
                    ? "bg-purple-600 text-white border-purple-600 shadow"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {selectedItems.size > 0 && (
          <div className="flex items-center justify-between gap-3 p-3 bg-purple-50 border border-purple-100 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-white rounded-lg border border-purple-100 text-sm font-semibold text-purple-700">
                {selectedItems.size} selected
              </div>
              <p className="text-sm text-gray-700">Bulk actions for selected images</p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={clearSelection}>
                Clear
              </Button>
              <Button variant="danger" size="sm" onClick={openBulkDelete}>
                Delete Selected
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Status Messages */}
      {error && !loading && (
        <div className="rounded-xl p-4 bg-red-50 border border-red-200 animate-in slide-in-from-top-2">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
            </svg>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-800">Error</h4>
              <p className="text-sm text-red-700 mt-0.5">{error}</p>
            </div>
            <button 
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600 transition-colors"
              title="Dismiss error"
              aria-label="Dismiss error"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      {loading && items.length === 0 ? (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-2 w-2 bg-purple-600 rounded-full animate-bounce [animation-delay:0ms]" />
            <div className="h-2 w-2 bg-purple-600 rounded-full animate-bounce [animation-delay:150ms]" />
            <div className="h-2 w-2 bg-purple-600 rounded-full animate-bounce [animation-delay:300ms]" />
            <span className="text-sm font-medium text-gray-600 ml-2">Loading gallery...</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="No images in your gallery"
          description="Start building your gallery by uploading your first image. Showcase your best work to attract clients!"
          actionLabel="Upload images"
          onAction={() => {
            const input = document.querySelector<HTMLInputElement>('input[type="file"][multiple]');
            input?.click();
          }}
          secondaryAction={
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span>Easy drag & drop</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span>Add captions & tags</span>
              </div>
            </div>
          }
        />
      ) : filteredItems.length === 0 ? (
        <EmptyState
          title="No matches found"
          description={`No images match your ${searchTerm ? 'search query' : 'filter'}. Try adjusting your filters or search.`}
          actionLabel="Clear filters"
          onAction={() => {
            setSearchTerm("");
            setFilterMode("all");
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((it) => (
            <div 
              key={it.name} 
              draggable
              onDragStart={() => handleDragStart(it.name)}
              onDragOver={(e) => handleDragOver(e, it.name)}
              onDrop={() => handleDrop(it.name)}
              onDragEnd={() => setDraggingId(null)}
              className={`bg-white rounded-2xl shadow-sm border ${draggingId === it.name ? 'border-purple-400 ring-2 ring-purple-200' : 'border-gray-200'} overflow-hidden hover:shadow-xl hover:border-purple-200 transition-all duration-300 group cursor-grab active:cursor-grabbing`}
            >
              {/* Image Container */}
              <div className="relative w-full h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                <div className="absolute top-3 left-3 z-10">
                  <label className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-gray-200 cursor-pointer text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(it.name)}
                      onChange={() => toggleSelect(it.name)}
                      className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                    />
                    <span>Select</span>
                  </label>
                </div>
                <img
                  src={it.url}
                  alt={it.caption || it.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
                  onClick={() => setLightboxImage({ url: it.url, caption: it.caption || it.name })}
                  loading="lazy"
                />
                {/* Hover Overlay with Actions */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      onClick={() => setEditingId(editingId === it.name ? null : it.name)}
                      className="p-2.5 bg-white/95 hover:bg-white rounded-xl shadow-lg transition-all hover:scale-110 backdrop-blur-sm"
                      title={editingId === it.name ? "Close editor" : "Edit image details"}
                    >
                      {editingId === it.name ? (
                        <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={() => openDeleteConfirm(it.name, it.caption || null, it.url, it.bucket)}
                      className="p-2.5 bg-red-500/95 hover:bg-red-600 rounded-xl shadow-lg transition-all hover:scale-110 backdrop-blur-sm"
                      title="Delete image"
                    >
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                      </svg>
                    </button>
                  </div>
                  {/* Quick View Button */}
                  <div className="absolute bottom-3 right-3">
                    <button
                      onClick={() => setLightboxImage({ url: it.url, caption: it.caption || it.name })}
                      className="p-2 bg-white/95 hover:bg-white rounded-lg shadow-lg transition-all backdrop-blur-sm"
                      title="View full size"
                    >
                      <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Info Section */}
              <div className="p-4 space-y-3">
                {editingId === it.name ? (
                  <div className="space-y-4">
                    {/* Edit Mode */}
                    <div className="pb-3 border-b border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-purple-700">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                        </svg>
                        <span className="text-xs font-semibold uppercase tracking-wider">Edit Mode</span>
                        {unsavedChanges.has(it.name) && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold text-amber-800 bg-amber-100 rounded-full border border-amber-200">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            Unsaved
                          </span>
                        )}
                        {savingIds.has(it.name) && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold text-green-800 bg-green-100 rounded-full border border-green-200">
                            <svg className="w-3 h-3 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => undo(it.name)}
                          className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg hover:bg-gray-50"
                          title="Undo"
                        >
                          Undo
                        </button>
                        <button
                          onClick={() => redo(it.name)}
                          className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg hover:bg-gray-50"
                          title="Redo"
                        >
                          Redo
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">Caption</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-sm"
                        value={it.caption || ""}
                        onChange={(e) => updateItem(it.name, { caption: e.target.value })}
                        placeholder="Describe this image..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">
                        Tags
                        <span className="text-gray-500 font-normal ml-1">(comma-separated)</span>
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-sm"
                        value={(it.tags || []).join(", ")}
                        onChange={(e) => updateItem(it.name, { tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })}
                        placeholder="color, balayage, highlights"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">
                        Display Order
                        <span className="text-gray-500 font-normal ml-1">(lower appears first)</span>
                      </label>
                      <input
                        type="number"
                        className="w-full border border-gray-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-sm"
                        value={typeof it.display_order === "number" ? it.display_order : ""}
                        onChange={(e) => updateItem(it.name, { display_order: e.target.value === "" ? null : parseInt(e.target.value, 10) })}
                        placeholder="1"
                      />
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-100">
                      <input
                        id={`before-after-${it.name}`}
                        type="checkbox"
                        checked={it.is_before_after || false}
                        onChange={(e) => updateItem(it.name, { is_before_after: e.target.checked })}
                        className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                      />
                      <label htmlFor={`before-after-${it.name}`} className="text-sm text-gray-800 cursor-pointer font-medium">
                        Mark as Before/After Transformation
                      </label>
                    </div>

                    <div className="flex gap-2.5 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => setEditingId(null)}
                        className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => onSave(it)}
                        disabled={loading}
                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm shadow-md hover:shadow-lg"
                      >
                        {loading ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* View Mode */}
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1.5">Filename</p>
                      <p className="text-sm font-mono text-gray-800 truncate bg-gray-50 px-2 py-1 rounded">{it.name}</p>
                    </div>

                    {it.caption && (
                      <div>
                        <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">{it.caption}</p>
                      </div>
                    )}

                    {it.tags && it.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {it.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="inline-flex items-center px-2.5 py-1 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 text-xs rounded-full font-medium">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
                            </svg>
                            {tag}
                          </span>
                        ))}
                        {it.tags.length > 3 && (
                          <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                            +{it.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {it.display_order !== null && it.display_order !== undefined && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3z"/>
                        </svg>
                        <span>Display order: {it.display_order}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Lightbox */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm animate-in fade-in"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all backdrop-blur-md"
            title="Close"
          >
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>
          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightboxImage.url}
              alt={lightboxImage.caption}
              className="w-full h-auto max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
            {lightboxImage.caption && (
              <p className="text-white text-center mt-4 text-lg font-medium">{lightboxImage.caption}</p>
            )}
          </div>
        </div>
      )}

      {pendingDelete && (
        <div className="fixed bottom-4 right-4 z-50 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3">
          <span className="text-sm">Images scheduled for deletion. Undo?</span>
          <button
            onClick={undoPendingDelete}
            className="px-3 py-1.5 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100"
          >
            Undo
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full space-y-5 animate-in zoom-in-95 slide-in-from-bottom-4">
            {/* Header with Icon */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-xl bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">Delete Image?</h3>
                <p className="text-sm text-gray-600 mt-1">
                  This action cannot be undone
                </p>
              </div>
            </div>

            {/* Image Preview / List */}
            {deleteConfirm.mode === "single" && deleteConfirm.itemUrl && (
              <div className="rounded-xl overflow-hidden border-2 border-gray-200">
                <img
                  src={deleteConfirm.itemUrl}
                  alt={deleteConfirm.itemCaption || "Image to delete"}
                  className="w-full h-48 object-cover"
                />
              </div>
            )}

            {deleteConfirm.mode === "bulk" && (
              <div className="max-h-48 overflow-auto rounded-xl border border-gray-200 bg-gray-50 p-3 space-y-2">
                {deleteConfirm.items?.map((it) => (
                  <div key={it.name} className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium text-gray-800 truncate">{it.caption || it.name}</span>
                    <span className="text-xs text-gray-500 font-mono truncate">{it.name}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Details */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              {deleteConfirm.mode === "single" && deleteConfirm.itemCaption && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Caption</p>
                  <p className="text-sm text-gray-800 font-medium">{deleteConfirm.itemCaption}</p>
                </div>
              )}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{deleteConfirm.mode === "bulk" ? "Files" : "File"}</p>
                <p className="text-sm text-gray-800 font-mono truncate">
                  {deleteConfirm.mode === "bulk" ? `${deleteConfirm.items?.length || 0} files selected` : deleteConfirm.itemName}
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-600 px-1">
              The image will be deleted after a 5 second grace period. You can undo during that window.
            </p>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={closeDeleteConfirm}
                className="flex-1 px-5 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold disabled:opacity-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-5 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all disabled:opacity-50 font-semibold shadow-lg hover:shadow-xl"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </span>
                ) : (
                  "Delete Image"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
