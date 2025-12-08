"use client";

import React, { useState } from "react";
import { useToast } from "@/components/Toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";

type Item = {
  name: string;
  url: string;
  caption?: string | null;
  display_order?: number | null;
  before_image?: string | null;
};

type TransformationPair = {
  before: Item | null;
  after: Item | null;
  caption: string;
  display_order: number;
};

interface TransformationPairBuilderProps {
  allItems: Item[];
  transformations: Item[];
  onSave: (pair: TransformationPair) => Promise<void>;
  loading: boolean;
  searchTerm: string;
  onSearchChange: (val: string) => void;
}

export default function TransformationPairBuilder({
  allItems,
  transformations,
  onSave,
  loading,
  searchTerm,
  onSearchChange,
}: TransformationPairBuilderProps) {
  const [pairs, setPairs] = useState<TransformationPair[]>(
    transformations.map(t => ({
      before: allItems.find(i => i.name === t.before_image) || null,
      after: t,
      caption: t.caption || "",
      display_order: t.display_order || 0,
    }))
  );
  const [draggedItem, setDraggedItem] = useState<Item | null>(null);
  const [dragSource, setDragSource] = useState<"before" | "after" | null>(null);
  const toast = useToast();

  const availableItems = allItems.filter(
    item => !transformations.some(t => t.name === item.name)
  );

  const filteredAvailable = availableItems.filter((item) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      (item.caption || "").toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q)
    );
  });

  const filteredPairs = pairs.filter((pair) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    const captionMatch = pair.caption.toLowerCase().includes(q);
    const beforeMatch = pair.before?.name.toLowerCase().includes(q) || pair.before?.caption?.toLowerCase().includes(q);
    const afterMatch = pair.after?.name.toLowerCase().includes(q) || pair.after?.caption?.toLowerCase().includes(q);
    return captionMatch || beforeMatch || afterMatch;
  });

  const handleDragStart = (item: Item, source: "before" | "after") => {
    setDraggedItem(item);
    setDragSource(source);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragSource(null);
  };

  const handleDropOnSlot = (pairIndex: number, slot: "before" | "after", item: Item) => {
    setPairs(prev => {
      const newPairs = [...prev];
      newPairs[pairIndex] = {
        ...newPairs[pairIndex],
        [slot]: item,
      };
      return newPairs;
    });
  };

  const handleClearSlot = (pairIndex: number, slot: "before" | "after") => {
    setPairs(prev => {
      const newPairs = [...prev];
      newPairs[pairIndex] = {
        ...newPairs[pairIndex],
        [slot]: null,
      };
      return newPairs;
    });
  };

  const handleSavePair = async (pair: TransformationPair, pairIndex: number) => {
    if (!pair.after) {
      toast.error("After image is required");
      return;
    }

    try {
      await onSave({
        ...pair,
        before: pair.before,
        after: pair.after,
      });
      toast.success("Transformation pair saved");
    } catch (e: any) {
      toast.error(e?.message || "Failed to save");
    }
  };

  const handleAddPair = () => {
    setPairs(prev => [...prev, {
      before: null,
      after: null,
      caption: "",
      display_order: prev.length,
    }]);
  };

  const handleRemovePair = (pairIndex: number) => {
    setPairs(prev => prev.filter((_, idx) => idx !== pairIndex));
  };

  return (
    <div className="space-y-8">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="font-semibold text-blue-900 mb-1">How to use</h3>
          <p className="text-sm text-blue-800">
            Drag photos to build before/after pairs. Save to publish a slider on the site.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-blue-900">
          <span className="px-2 py-1 rounded-full bg-white border border-blue-200 font-semibold">Drag & Drop</span>
          <span className="px-2 py-1 rounded-full bg-white border border-blue-200 font-semibold">Search</span>
          <span className="px-2 py-1 rounded-full bg-white border border-blue-200 font-semibold">Preview</span>
        </div>
      </div>

      {/* Main Layout: Gallery on Left, Pairs on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Available Gallery */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sticky top-20 max-h-[calc(100vh-8rem)] overflow-y-auto">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className="text-lg font-bold text-gray-900">Available Photos</h3>
              <Input
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search"
                className="w-32 text-xs px-3 py-1.5"
              />
            </div>
            <div className="space-y-2">
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <Skeleton key={idx} className="h-24" />
                ))
              ) : filteredAvailable.length === 0 ? (
                <EmptyState
                  title="No matches"
                  description="Upload more before/after photos or adjust your search."
                  className="bg-gray-50"
                />
              ) : (
                filteredAvailable.map(item => (
                  <div
                    key={item.name}
                    draggable
                    onDragStart={() => handleDragStart(item, "before")}
                    onDragEnd={handleDragEnd}
                    className="group cursor-move"
                  >
                    <div className="relative h-24 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 hover:border-purple-400 transition-all hover:shadow-md">
                      <img
                        src={item.url}
                        alt={item.caption || item.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 text-white text-xs font-semibold bg-black/70 px-2 py-1 rounded transition-opacity">
                          Drag to use
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 truncate">{item.caption || item.name}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Transformation Pairs */}
        <div className="lg:col-span-9 space-y-4">
          {loading && pairs.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <Skeleton key={idx} className="h-80" />
              ))}
            </div>
          ) : filteredPairs.length === 0 ? (
            <EmptyState
              title="No transformation pairs yet"
              description="Create your first before/after pair to publish a slider on the site."
              actionLabel="Create first pair"
              onAction={handleAddPair}
            />
          ) : (
            filteredPairs.map((pair, pairIndex) => (
              <div
                key={pairIndex}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4 hover:shadow-md transition-shadow"
              >
                {/* Before/After Slider Card */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Before Slot */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.add("ring-2", "ring-purple-500", "bg-purple-50");
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.classList.remove("ring-2", "ring-purple-500", "bg-purple-50");
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove("ring-2", "ring-purple-500", "bg-purple-50");
                      if (draggedItem) {
                        handleDropOnSlot(pairIndex, "before", draggedItem);
                      }
                    }}
                    className="relative h-64 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 overflow-hidden group transition-all cursor-pointer hover:border-purple-400"
                  >
                    {pair.before ? (
                      <>
                        <img
                          src={pair.before.url}
                          alt="Before"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <Button
                            onClick={() => handleClearSlot(pairIndex, "before")}
                            size="sm"
                            variant="danger"
                          >
                            Clear
                          </Button>
                        </div>
                        <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-xs font-semibold text-gray-900">
                          Before
                        </div>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          <p className="text-sm font-medium text-gray-600">Drag before photo</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* After Slot */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.add("ring-2", "ring-rose-500", "bg-rose-50");
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.classList.remove("ring-2", "ring-rose-500", "bg-rose-50");
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove("ring-2", "ring-rose-500", "bg-rose-50");
                      if (draggedItem) {
                        handleDropOnSlot(pairIndex, "after", draggedItem);
                      }
                    }}
                    className="relative h-64 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 overflow-hidden group transition-all cursor-pointer hover:border-rose-400"
                  >
                    {pair.after ? (
                      <>
                        <img
                          src={pair.after.url}
                          alt="After"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <Button
                            onClick={() => handleClearSlot(pairIndex, "after")}
                            size="sm"
                            variant="danger"
                          >
                            Clear
                          </Button>
                        </div>
                        <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-semibold text-gray-900">
                          After
                        </div>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          <p className="text-sm font-medium text-gray-600">Drag after photo</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {pair.before && pair.after && (
                  <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="relative w-full aspect-[3/2]">
                      <div className="absolute inset-0 grid grid-cols-2">
                        <img src={pair.before.url} alt="Before" className="w-full h-full object-cover" />
                        <img src={pair.after.url} alt="After" className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 flex items-center justify-between px-4 text-white text-sm font-semibold">
                        <span>Before</span>
                        <span>After</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Card Details */}
                <div className="space-y-3 pt-2 border-t border-gray-100">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Transformation Title</label>
                    <input
                      type="text"
                      value={pair.caption}
                      onChange={(e) =>
                        setPairs(prev => {
                          const newPairs = [...prev];
                          newPairs[pairIndex] = {
                            ...newPairs[pairIndex],
                            caption: e.target.value,
                          };
                          return newPairs;
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-shadow text-sm"
                      placeholder="e.g., Vivid copper balayage"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Display Order</label>
                    <input
                      type="number"
                      value={pair.display_order}
                      onChange={(e) =>
                        setPairs(prev => {
                          const newPairs = [...prev];
                          newPairs[pairIndex] = {
                            ...newPairs[pairIndex],
                            display_order: parseInt(e.target.value, 10) || 0,
                          };
                          return newPairs;
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-shadow text-sm"
                      placeholder="0"
                    />
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2 text-xs">
                    <div className={`w-2 h-2 rounded-full ${pair.before && pair.after ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span className="text-gray-600">
                      {pair.before && pair.after
                        ? "Ready to save"
                        : `${pair.before ? "After" : pair.after ? "Before" : "Before & After"} needed`}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => handleSavePair(pair, pairIndex)}
                      disabled={!pair.before || !pair.after || loading}
                      loading={loading}
                      className="flex-1"
                    >
                      Save Pair
                    </Button>
                    {pairs.length > 1 && (
                      <Button
                        onClick={() => handleRemovePair(pairIndex)}
                        variant="danger"
                        size="md"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}

          {pairs.length > 0 && (
            <Button
              onClick={handleAddPair}
              variant="ghost"
              className="w-full border-2 border-dashed border-gray-300 hover:border-pink-400 hover:bg-pink-50 text-gray-700 hover:text-pink-700"
            >
              + Add Another Pair
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
