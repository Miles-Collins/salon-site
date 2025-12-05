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

export default function ContentManager() {
  const [content, setContent] = useState<Content>({});
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const toast = useToast();

  const defaultSliders: TransformationSlide[] = [
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

  const load = async () => {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/owner/content/get");
      const json = await res.json();
      const loaded = json.content || {};
      setContent({
        ...loaded,
        transformation_sliders:
          loaded.transformation_sliders?.length ? loaded.transformation_sliders : defaultSliders,
      });
      toast.info("Content loaded");
    } catch (e: any) {
      setMsg(e?.message || "Failed to load content");
      toast.error("Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

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
        : [...defaultSliders];
      sliders[idx] = { ...sliders[idx], ...patch } as TransformationSlide;
      return { ...prev, transformation_sliders: sliders };
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        {loading && <span className="text-sm text-gray-500">Working…</span>}
        {msg && <span className="text-sm">{msg}</span>}
        <button className="px-3 py-1 border rounded" onClick={load}>Reload</button>
      </div>

      <section className="border rounded p-4 space-y-2">
        <h3 className="font-semibold">Homepage Hero</h3>
        <label htmlFor="hero-title" className="block text-xs text-gray-600">Title</label>
        <input id="hero-title" title="Hero title" className="w-full border rounded px-2 py-1" value={content.hero?.title || ""} onChange={(e) => updateKey("hero", { title: e.target.value })} placeholder="e.g. Color Rebel by Porscha" />
        <label htmlFor="hero-subtitle" className="block text-xs text-gray-600">Subtitle</label>
        <input id="hero-subtitle" title="Hero subtitle" className="w-full border rounded px-2 py-1" value={content.hero?.subtitle || ""} onChange={(e) => updateKey("hero", { subtitle: e.target.value })} placeholder="e.g. Vivid color, extensions, and more" />
        <div className="flex justify-end"><button className="px-3 py-1 border rounded" onClick={() => save("hero")}>Save Hero</button></div>
      </section>

      <section className="border rounded p-4 space-y-2">
        <h3 className="font-semibold">Announcement Banner</h3>
        <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={!!content.announcement?.enabled} onChange={(e) => updateKey("announcement", { enabled: e.target.checked })} /> Enabled</label>
        <label htmlFor="announcement-text" className="block text-xs text-gray-600">Text</label>
        <input id="announcement-text" title="Announcement text" className="w-full border rounded px-2 py-1" value={content.announcement?.text || ""} onChange={(e) => updateKey("announcement", { text: e.target.value })} placeholder="e.g. Holiday booking fills fast—reserve now!" />
        <div className="flex justify-end"><button className="px-3 py-1 border rounded" onClick={() => save("announcement")}>Save Announcement</button></div>
      </section>

      <section className="border rounded p-4 space-y-2">
        <h3 className="font-semibold">Policies</h3>
        <label htmlFor="policies-md" className="block text-xs text-gray-600">Markdown</label>
        <textarea id="policies-md" title="Policies markdown" className="w-full border rounded px-2 py-1 h-40" value={content.policies?.markdown || ""} onChange={(e) => updateKey("policies", { markdown: e.target.value })} placeholder="Write your policies in Markdown" />
        <div className="flex justify-end"><button className="px-3 py-1 border rounded" onClick={() => save("policies")}>Save Policies</button></div>
      </section>

      <section className="border rounded p-4 space-y-3">
        <h3 className="font-semibold">Homepage Before/After Sliders (2)</h3>
        <p className="text-xs text-gray-600">Update the two sliders shown on the homepage transformation section.</p>
        {Array.from({ length: 2 }).map((_, idx) => {
          const slide = content.transformation_sliders?.[idx] || defaultSliders[idx];
          return (
            <div key={idx} className="border rounded p-3 space-y-2 bg-gray-50">
              <h4 className="text-sm font-semibold">Slider {idx + 1}</h4>
              <label className="block text-xs text-gray-600">Before Image URL</label>
              <input
                className="w-full border rounded px-2 py-1"
                value={slide.beforeImage}
                onChange={(e) => updateSlider(idx, { beforeImage: e.target.value })}
                placeholder="/gallery/before.jpg"
              />
              <label className="block text-xs text-gray-600">After Image URL</label>
              <input
                className="w-full border rounded px-2 py-1"
                value={slide.afterImage}
                onChange={(e) => updateSlider(idx, { afterImage: e.target.value })}
                placeholder="/gallery/after.jpg"
              />
              <label className="block text-xs text-gray-600">Before Alt Text</label>
              <input
                className="w-full border rounded px-2 py-1"
                value={slide.beforeAlt || ""}
                onChange={(e) => updateSlider(idx, { beforeAlt: e.target.value })}
                placeholder="Describe the before photo"
              />
              <label className="block text-xs text-gray-600">After Alt Text</label>
              <input
                className="w-full border rounded px-2 py-1"
                value={slide.afterAlt || ""}
                onChange={(e) => updateSlider(idx, { afterAlt: e.target.value })}
                placeholder="Describe the after photo"
              />
            </div>
          );
        })}
        <div className="flex justify-end"><button className="px-3 py-1 border rounded" onClick={() => save("transformation_sliders")}>Save Sliders</button></div>
      </section>
    </div>
  );
}
