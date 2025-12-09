"use client";

import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/components/Toast";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";

type Testimonial = {
  id: string;
  client_name: string;
  service: string | null;
  quote: string;
  rating: number | null;
  display_order: number;
  is_featured: boolean;
  created_at: string;
};

export default function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const toast = useToast();
  
  // Form state
  const [formData, setFormData] = useState({
    client_name: "",
    service: "",
    quote: "",
    rating: 5,
    display_order: 0,
    is_featured: false,
  });

  const loadTestimonials = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/owner/testimonials/list");
      const { testimonials: data } = await res.json();
      setTestimonials(data || []);
      toast.info("Testimonials loaded");
    } catch (err) {
      console.error("Failed to load testimonials:", err);
      toast.error("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadTestimonials();
  }, [loadTestimonials]);

  const handleAdd = async () => {
    try {
      const res = await fetch("/api/owner/testimonials/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormData({
          client_name: "",
          service: "",
          quote: "",
          rating: 5,
          display_order: 0,
          is_featured: false,
        });
        setShowAddForm(false);
        await loadTestimonials();
        toast.success("Testimonial added");
      }
    } catch (err) {
      console.error("Failed to add testimonial:", err);
      toast.error("Failed to add testimonial");
    }
  };

  const handleUpdate = async (id: string, updates: Partial<Testimonial>) => {
    try {
      const res = await fetch("/api/owner/testimonials/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });
      if (res.ok) {
        setEditingId(null);
        await loadTestimonials();
        toast.success("Testimonial updated");
      }
    } catch (err) {
      console.error("Failed to update testimonial:", err);
      toast.error("Failed to update testimonial");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    try {
      const res = await fetch(`/api/owner/testimonials/delete?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await loadTestimonials();
        toast.success("Testimonial deleted");
      }
    } catch (err) {
      console.error("Failed to delete testimonial:", err);
      toast.error("Failed to delete testimonial");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-10 w-40" />
        </div>
        {Array.from({ length: 3 }).map((_, idx) => (
          <Skeleton key={idx} className="h-32" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Testimonials</h3>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          variant={showAddForm ? "secondary" : "primary"}
          size="md"
        >
          {showAddForm ? "Cancel" : "+ Add Testimonial"}
        </Button>
      </div>

      {showAddForm && (
        <div className="p-4 border rounded bg-gray-50 space-y-3">
          <input
            type="text"
            placeholder="Client name"
            value={formData.client_name}
            onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="text"
            placeholder="Service (optional)"
            value={formData.service}
            onChange={(e) => setFormData({ ...formData, service: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
          <textarea
            placeholder="Quote"
            value={formData.quote}
            onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
            className="w-full px-3 py-2 border rounded h-24"
          />
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs mb-1">Rating (1-5)</label>
              <input
                type="number"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Display Order</label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                />
                <span className="text-sm">Featured</span>
              </label>
            </div>
          </div>
          <button
            onClick={handleAdd}
            disabled={!formData.client_name || !formData.quote}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Testimonial
          </button>
        </div>
      )}

      <div className="space-y-3">
        {testimonials.map((t) => (
          <div key={t.id} className="p-4 border rounded bg-white">
            {editingId === t.id ? (
              <div className="space-y-2">
                <input
                  type="text"
                  defaultValue={t.client_name}
                  onBlur={(e) => handleUpdate(t.id, { client_name: e.target.value })}
                  className="w-full px-2 py-1 border rounded text-sm"
                />
                <input
                  type="text"
                  defaultValue={t.service || ""}
                  onBlur={(e) => handleUpdate(t.id, { service: e.target.value })}
                  placeholder="Service (optional)"
                  className="w-full px-2 py-1 border rounded text-sm"
                />
                <textarea
                  defaultValue={t.quote}
                  onBlur={(e) => handleUpdate(t.id, { quote: e.target.value })}
                  className="w-full px-2 py-1 border rounded text-sm h-20"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    max="5"
                    defaultValue={t.rating || 5}
                    onBlur={(e) => handleUpdate(t.id, { rating: parseInt(e.target.value) })}
                    className="w-20 px-2 py-1 border rounded text-sm"
                    placeholder="Rating"
                  />
                  <input
                    type="number"
                    defaultValue={t.display_order}
                    onBlur={(e) => handleUpdate(t.id, { display_order: parseInt(e.target.value) })}
                    className="w-24 px-2 py-1 border rounded text-sm"
                    placeholder="Order"
                  />
                  <label className="flex items-center gap-1 text-sm">
                    <input
                      type="checkbox"
                      checked={t.is_featured}
                      onChange={(e) => handleUpdate(t.id, { is_featured: e.target.checked })}
                    />
                    Featured
                  </label>
                </div>
                <button
                  onClick={() => setEditingId(null)}
                  className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                >
                  Done
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-semibold">{t.client_name}</div>
                    {t.service && <div className="text-sm text-gray-600">{t.service}</div>}
                    {t.rating && (
                      <div className="text-yellow-500 text-sm">
                        {"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {t.is_featured && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                        Featured
                      </span>
                    )}
                    <button
                      onClick={() => setEditingId(t.id)}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-700 italic">&ldquo;{t.quote}&rdquo;</div>
                <div className="text-xs text-gray-400 mt-1">Order: {t.display_order}</div>
              </div>
            )}
          </div>
        ))}
        {testimonials.length === 0 && !showAddForm && (
          <EmptyState
            title="No testimonials yet"
            description="Add your first testimonial to showcase client feedback."
            actionLabel="Add First Testimonial"
            onAction={() => setShowAddForm(true)}
            icon={
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            }
          />
        )}
      </div>
    </div>
  );
}
