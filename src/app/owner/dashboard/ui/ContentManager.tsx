"use client";
import React, { useEffect, useState } from "react";
import { useToast } from "@/components/Toast";

type TransformationSlide = {
  beforeImage: string;
  afterImage: string;
  beforeAlt?: string;
  afterAlt?: string;
};

type Content = {
  hero?: { title?: string; subtitle?: string };
  announcement?: { enabled?: boolean; text?: string };
  policies?: { markdown?: string };
  transformation_sliders?: TransformationSlide[];
};

const DEFAULT_SLIDERS: TransformationSlide[] = [
  {
    beforeImage: "/photo_1_before",
    afterImage: "/photo_1_after",
    beforeAlt: "Before hair transformation",
    afterAlt: "After hair transformation",
  },
  {
    beforeImage: "/gallery/2025-10-09.webp",
    afterImage: "/gallery/2025-10-12.webp",
    beforeAlt: "Before hair color transformation",
    afterAlt: "After vivid hair color",
  },
];

export default function ContentManager() {
  const [content, setContent] = useState<Content>({});
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const toast = useToast();

  const load = React.useCallback(async () => {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/owner/content/get");
      const json = await res.json();
      const loaded = json.content || {};
      setContent({
        ...loaded,
        transformation_sliders:
          loaded.transformation_sliders?.length ? loaded.transformation_sliders : DEFAULT_SLIDERS,
      });
      toast.info("Content loaded");
    } catch (e: any) {
      setMsg(e?.message || "Failed to load content");
      toast.error("Failed to load content");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const save = async (key: keyof Content) => {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/owner/content/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: content[key] || {} })
      });
      if (!res.ok) throw new Error("Save failed");
      setMsg("Saved");
      toast.success("Saved");
    } catch (e: any) {
      setMsg(e?.message || "Save failed");
      toast.error(e?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  const updateKey = (key: keyof Content, patch: any) => {
    setContent((prev) => ({ ...prev, [key]: { ...(prev[key] || {}), ...patch } }));
  };

  const updateSlider = (idx: number, patch: Partial<TransformationSlide>) => {
    setContent((prev) => {
      const sliders = prev.transformation_sliders?.length
        ? [...prev.transformation_sliders]
        : [...DEFAULT_SLIDERS];
      sliders[idx] = { ...sliders[idx], ...patch } as TransformationSlide;
      return { ...prev, transformation_sliders: sliders };
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          {loading && (
            <div className="flex items-center gap-2 text-purple-600">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-sm font-medium">Saving...</span>
            </div>
          )}
          {msg && !loading && (
            <div className="flex items-center gap-2 text-green-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span className="text-sm font-medium">{msg}</span>
            </div>
          )}
        </div>
        <button 
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reload All
        </button>
      </div>

      {/* Homepage Hero Section */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏠</span>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Homepage Hero</h3>
              <p className="text-sm text-gray-600">Main title and subtitle on your homepage</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="hero-title" className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input 
              id="hero-title" 
              title="Hero title" 
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow" 
              value={content.hero?.title || ""} 
              onChange={(e) => updateKey("hero", { title: e.target.value })} 
              placeholder="e.g. Color Rebel by Porscha" 
            />
          </div>
          <div>
            <label htmlFor="hero-subtitle" className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
            <input 
              id="hero-subtitle" 
              title="Hero subtitle" 
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow" 
              value={content.hero?.subtitle || ""} 
              onChange={(e) => updateKey("hero", { subtitle: e.target.value })} 
              placeholder="e.g. Vivid color, extensions, and more" 
            />
          </div>
          <div className="flex justify-end pt-2">
            <button 
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed font-medium" 
              onClick={() => save("hero")}
              disabled={loading}
            >
              Save Hero
            </button>
          </div>
        </div>
      </section>

      {/* Announcement Banner Section */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📢</span>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Announcement Banner</h3>
              <p className="text-sm text-gray-600">Display important messages to visitors</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <label className="inline-flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input 
                type="checkbox" 
                checked={!!content.announcement?.enabled} 
                onChange={(e) => updateKey("announcement", { enabled: e.target.checked })} 
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </div>
            <span className="text-sm font-medium text-gray-700">Enable announcement banner</span>
          </label>
          <div>
            <label htmlFor="announcement-text" className="block text-sm font-medium text-gray-700 mb-2">Announcement Text</label>
            <input 
              id="announcement-text" 
              title="Announcement text" 
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow disabled:bg-gray-50" 
              value={content.announcement?.text || ""} 
              onChange={(e) => updateKey("announcement", { text: e.target.value })} 
              placeholder="e.g. Holiday booking fills fast—reserve now!" 
              disabled={!content.announcement?.enabled}
            />
          </div>
          <div className="flex justify-end pt-2">
            <button 
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed font-medium" 
              onClick={() => save("announcement")}
              disabled={loading}
            >
              Save Announcement
            </button>
          </div>
        </div>
      </section>

      {/* Policies Section */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📋</span>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Policies</h3>
              <p className="text-sm text-gray-600">Terms, cancellation policy, and other legal information</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="policies-md" className="block text-sm font-medium text-gray-700 mb-2">
              Markdown Content
              <span className="ml-2 text-xs text-gray-500 font-normal">(Supports Markdown formatting)</span>
            </label>
            <textarea 
              id="policies-md" 
              title="Policies markdown" 
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow font-mono text-sm" 
              value={content.policies?.markdown || ""} 
              onChange={(e) => updateKey("policies", { markdown: e.target.value })} 
              placeholder="Write your policies in Markdown&#10;&#10;Example:&#10;## Cancellation Policy&#10;- 24 hour notice required&#10;- No shows will be charged 50%"
              rows={12}
            />
          </div>
          <div className="flex justify-end pt-2">
            <button 
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed font-medium" 
              onClick={() => save("policies")}
              disabled={loading}
            >
              Save Policies
            </button>
          </div>
        </div>
      </section>

      {/* Before/After Sliders Section */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-pink-50 to-rose-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Homepage Before/After Sliders</h3>
              <p className="text-sm text-gray-600">Featured transformation sliders on the homepage (2 total)</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {Array.from({ length: 2 }).map((_, idx) => {
            const slide = content.transformation_sliders?.[idx] || DEFAULT_SLIDERS[idx];
            return (
              <div key={idx} className="border border-gray-200 rounded-lg p-5 space-y-4 bg-gradient-to-br from-gray-50 to-white">
                <h4 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold">
                    {idx + 1}
                  </span>
                  Slider {idx + 1}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Before Image URL</label>
                    <input
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow"
                      value={slide.beforeImage}
                      onChange={(e) => updateSlider(idx, { beforeImage: e.target.value })}
                      placeholder="/gallery/before.jpg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">After Image URL</label>
                    <input
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow"
                      value={slide.afterImage}
                      onChange={(e) => updateSlider(idx, { afterImage: e.target.value })}
                      placeholder="/gallery/after.jpg"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Before Alt Text</label>
                    <input
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow"
                      value={slide.beforeAlt || ""}
                      onChange={(e) => updateSlider(idx, { beforeAlt: e.target.value })}
                      placeholder="Describe the before photo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">After Alt Text</label>
                    <input
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow"
                      value={slide.afterAlt || ""}
                      onChange={(e) => updateSlider(idx, { afterAlt: e.target.value })}
                      placeholder="Describe the after photo"
                    />
                  </div>
                </div>
              </div>
            );
          })}
          <div className="flex justify-end pt-2">
            <button 
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed font-medium" 
              onClick={() => save("transformation_sliders")}
              disabled={loading}
            >
              Save Sliders
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
