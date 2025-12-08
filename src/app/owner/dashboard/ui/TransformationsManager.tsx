"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useToast } from "@/components/Toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import TransformationPairBuilder from "./TransformationPairBuilder";

type Item = {
  name: string;
  url: string;
  caption?: string | null;
  display_order?: number | null;
  before_image?: string | null;
  is_before_after?: boolean;
};

export default function TransformationsManager() {
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [transformations, setTransformations] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dragOverDropZone, setDragOverDropZone] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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
      // Filter to only transformation-gallery items (is_before_after = true)
      const allTransformationItems = (json.items || [])
        .filter((i: any) => i.is_before_after === true)
        .map((i: any) => ({
          name: i.name,
          url: i.url,
          caption: i.caption || null,
          display_order: i.display_order ?? null,
          before_image: i.before_image || null,
          is_before_after: i.is_before_after,
        })) as Item[];
      
      // All transformation items are available for the left sidebar
      setAllItems(allTransformationItems);
      // Pairs are items that have both before_image and after (current item)
      const pairs = allTransformationItems.filter(i => i.before_image);
      setTransformations(pairs);
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

  const onUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const form = new FormData();
    form.append("file", file);
    form.append("is_before_after", "true");
    
    setError(null);
    
    try {
      const res = await fetch("/api/owner/gallery/upload", {
        method: "POST",
        body: form,
      });
      if (!res.ok) throw new Error("Upload failed");
      
      // Wait a moment for the database to update, then refresh
      await new Promise(resolve => setTimeout(resolve, 500));
      await refresh();
      toast.success("Transformation uploaded");
      setDragOverDropZone(false);
    } catch (e: any) {
      setError(e?.message || "Upload failed");
      toast.error("Upload failed");
    }
  };

  const onSave = async (pair: any) => {
    if (!pair.after) {
      toast.error("After image is required");
      return;
    }

    try {
      const res = await fetch("/api/owner/gallery/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: pair.after.name,
          caption: pair.caption ?? null,
          display_order: pair.display_order ?? null,
          is_before_after: true,
          before_image: pair.before?.name ?? null,
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      
      // Wait a moment for the database to update, then refresh
      await new Promise(resolve => setTimeout(resolve, 500));
      await refresh();
      toast.success("Transformation pair saved");
    } catch (e: any) {
      setError(e?.message || "Save failed");
      toast.error("Save failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Transformations Manager</h2>
          <p className="text-sm text-gray-600">Pair before/after photos and control ordering</p>
        </div>
        <div className="relative w-full md:w-80">
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search caption or filename"
            className="pl-10"
          />
        </div>
      </div>

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
            ? "border-pink-500 bg-pink-50"
            : "border-gray-300 bg-gray-50 hover:border-pink-400 hover:bg-pink-50/50"
        }`}
      >
        <div className="flex flex-col items-center justify-center gap-3">
          <div className={`p-3 rounded-xl ${dragOverDropZone ? 'bg-pink-200' : 'bg-white border border-gray-200'}`}>
            <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {dragOverDropZone ? "Drop your after image" : "Upload after transformation"}
            </h3>
            <p className="text-sm text-gray-600">Drag and drop the after/result photo here, or click to browse</p>
          </div>
          <label className="mt-3 px-6 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg font-medium cursor-pointer hover:from-pink-700 hover:to-rose-700 transition-all">
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

      {loading && allItems.length === 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Skeleton key={idx} className="h-44" />
          ))}
        </div>
      )}

      {!loading && allItems.length === 0 && (
        <EmptyState
          title="No transformation photos yet"
          description="Upload after images to start pairing before/after transformations."
          actionLabel="Upload after image"
          onAction={() => {
            const input = document.querySelector<HTMLInputElement>('input[type="file"]');
            input?.click();
          }}
        />
      )}

      {/* Transformation Pair Builder */}
      <TransformationPairBuilder
        allItems={allItems}
        transformations={transformations}
        onSave={onSave}
        loading={loading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
    </div>
  );
}
