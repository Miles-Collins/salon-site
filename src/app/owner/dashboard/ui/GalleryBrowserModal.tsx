"use client";

import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

type GalleryItem = {
  name: string;
  url: string;
  caption?: string | null;
  bucket?: string;
  is_before_after?: boolean;
};

type GalleryBrowserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: GalleryItem) => void;
  title?: string;
  focusSearch?: boolean;
};

export default function GalleryBrowserModal({
  isOpen,
  onClose,
  onSelect,
  title = "Select Image",
  focusSearch = false,
}: GalleryBrowserModalProps) {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBucket, setFilterBucket] = useState<"all" | "gallery" | "services" | "transformations">("all");
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadGallery();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && focusSearch) {
      requestAnimationFrame(() => searchInputRef.current?.focus());
    }
  }, [isOpen, focusSearch]);

  const loadGallery = async () => {
    console.log("loadGallery called");
    setLoading(true);
    try {
      console.log("Fetching /api/owner/gallery/list");
      const res = await fetch("/api/owner/gallery/list");
      console.log("Response status:", res.status);
      const json = await res.json();
      console.log("Gallery items received:", json.items?.length || 0);
      setItems(json.items || []);
    } catch (err) {
      console.error("Failed to load gallery:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const q = searchTerm.trim().toLowerCase();
    const effectiveBucket = (() => {
      const raw = item.bucket?.toLowerCase();
      if (raw) return raw;
      if (item.is_before_after) return "gallery-transformations";
      return "gallery";
    })();
    const matchesSearch =
      !q || (item.caption || "").toLowerCase().includes(q) || item.name.toLowerCase().includes(q);
    const matchesBucket =
      filterBucket === "all" ||
      (filterBucket === "gallery" && effectiveBucket === "gallery") ||
      (filterBucket === "services" && effectiveBucket === "gallery-services") ||
      (filterBucket === "transformations" && (effectiveBucket === "gallery-transformations" || effectiveBucket.includes("transform")));
    return matchesSearch && matchesBucket;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close gallery browser"
          >
            <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 border-b border-gray-100 space-y-3">
          <input
            ref={searchInputRef}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by filename or caption..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow"
          />
          <div className="flex gap-2">
            <Button size="sm" variant={filterBucket === "all" ? "primary" : "ghost"} onClick={() => setFilterBucket("all")}>
              All Images
            </Button>
            <Button size="sm" variant={filterBucket === "gallery" ? "primary" : "ghost"} onClick={() => setFilterBucket("gallery")}>
              Gallery
            </Button>
            <Button size="sm" variant={filterBucket === "transformations" ? "primary" : "ghost"} onClick={() => setFilterBucket("transformations")}>
              Transformations
            </Button>
            <Button size="sm" variant={filterBucket === "services" ? "primary" : "ghost"} onClick={() => setFilterBucket("services")}>
              Services
            </Button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Array.from({ length: 12 }).map((_, idx) => (
                <Skeleton key={idx} className="h-40" />
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <EmptyState
              title="No images found"
              description="Try adjusting your search or upload new images to the gallery."
              icon={
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                  className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200 hover:border-purple-500 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  <img
                    src={item.url}
                    alt={item.caption || item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white text-xs font-medium truncate">{item.caption || item.name}</p>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded-lg text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    Select
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {filteredItems.length} image{filteredItems.length !== 1 ? "s" : ""}
          </p>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
