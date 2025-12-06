"use client";

import React, { useState } from "react";
import { useToast } from "@/components/Toast";

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
}

export default function TransformationPairBuilder({
  allItems,
  transformations,
  onSave,
  loading,
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
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">How to use</h3>
        <p className="text-sm text-blue-800">
          Drag photos from the gallery on the left to create before/after transformation pairs. Each card shows a side-by-side comparison that visitors will see on your site.
        </p>
      </div>

      {/* Main Layout: Gallery on Left, Pairs on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Available Gallery */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sticky top-20 max-h-[calc(100vh-8rem)] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Available Photos</h3>
            <div className="space-y-2">
              {availableItems.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">Upload photos to gallery first</p>
              ) : (
                availableItems.map(item => (
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
          {pairs.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16V4m0 0L3 8m4-4l4 4" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No transformation pairs yet</h3>
              <p className="text-gray-600 mb-4">Create your first before/after pair</p>
              <button
                onClick={handleAddPair}
                className="px-6 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all font-medium"
              >
                Create First Pair
              </button>
            </div>
          ) : (
            pairs.map((pair, pairIndex) => (
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
                          <button
                            onClick={() => handleClearSlot(pairIndex, "before")}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded transition-colors"
                          >
                            Clear
                          </button>
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
                          <button
                            onClick={() => handleClearSlot(pairIndex, "after")}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded transition-colors"
                          >
                            Clear
                          </button>
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
                    <button
                      onClick={() => handleSavePair(pair, pairIndex)}
                      disabled={!pair.before || !pair.after || loading}
                      className="flex-1 px-4 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
                    >
                      {loading ? "Saving..." : "Save Pair"}
                    </button>
                    {pairs.length > 1 && (
                      <button
                        onClick={() => handleRemovePair(pairIndex)}
                        className="px-4 py-2.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}

          {pairs.length > 0 && (
            <button
              onClick={handleAddPair}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-400 hover:bg-pink-50 transition-all text-gray-700 hover:text-pink-700 font-medium"
            >
              + Add Another Pair
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
