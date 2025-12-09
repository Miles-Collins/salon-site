"use client";

import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/components/Toast";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";

type FAQ = {
  id: string;
  question: string;
  answer: string;
  display_order: number;
  is_published: boolean;
  category: string | null;
  created_at: string;
  updated_at: string;
};

export default function FAQManager() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const toast = useToast();
  
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    display_order: 0,
    is_published: true,
    category: "",
  });

  const loadFAQs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/owner/faqs/list");
      const { faqs: data } = await res.json();
      setFaqs(data || []);
      toast.info("FAQs loaded");
    } catch (err) {
      console.error("Failed to load FAQs:", err);
      toast.error("Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadFAQs();
  }, [loadFAQs]);

  const handleAdd = async () => {
    try {
      const res = await fetch("/api/owner/faqs/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormData({
          question: "",
          answer: "",
          display_order: 0,
          is_published: true,
          category: "",
        });
        setShowAddForm(false);
        await loadFAQs();
        toast.success("FAQ added");
      }
    } catch (err) {
      console.error("Failed to add FAQ:", err);
      toast.error("Failed to add FAQ");
    }
  };

  const handleUpdate = async (id: string, updates: Partial<FAQ>) => {
    try {
      const res = await fetch("/api/owner/faqs/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });
      if (res.ok) {
        setEditingId(null);
        await loadFAQs();
        toast.success("FAQ updated");
      }
    } catch (err) {
      console.error("Failed to update FAQ:", err);
      toast.error("Failed to update FAQ");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this FAQ?")) return;
    try {
      const res = await fetch(`/api/owner/faqs/delete?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await loadFAQs();
        toast.success("FAQ deleted");
      }
    } catch (err) {
      console.error("Failed to delete FAQ:", err);
      toast.error("Failed to delete FAQ");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        {Array.from({ length: 4 }).map((_, idx) => (
          <Skeleton key={idx} className="h-28" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">FAQs</h3>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          variant={showAddForm ? "secondary" : "primary"}
          size="md"
        >
          {showAddForm ? "Cancel" : "+ Add FAQ"}
        </Button>
      </div>

      {showAddForm && (
        <div className="p-4 border rounded bg-gray-50 space-y-3">
          <input
            type="text"
            placeholder="Question"
            value={formData.question}
            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
          <textarea
            placeholder="Answer"
            value={formData.answer}
            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
            className="w-full px-3 py-2 border rounded h-24"
          />
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs mb-1">Category (optional)</label>
              <input
                type="text"
                placeholder="e.g., Booking"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                />
                <span className="text-sm">Published</span>
              </label>
            </div>
          </div>
          <button
            onClick={handleAdd}
            disabled={!formData.question || !formData.answer}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add FAQ
          </button>
        </div>
      )}

      <div className="space-y-3">
        {faqs.map((faq) => (
          <div key={faq.id} className="p-4 border rounded bg-white">
            {editingId === faq.id ? (
              <div className="space-y-2">
                <input
                  type="text"
                  defaultValue={faq.question}
                  onBlur={(e) => handleUpdate(faq.id, { question: e.target.value })}
                  className="w-full px-2 py-1 border rounded text-sm font-semibold"
                />
                <textarea
                  defaultValue={faq.answer}
                  onBlur={(e) => handleUpdate(faq.id, { answer: e.target.value })}
                  className="w-full px-2 py-1 border rounded text-sm h-20"
                />
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    defaultValue={faq.category || ""}
                    onBlur={(e) => handleUpdate(faq.id, { category: e.target.value })}
                    placeholder="Category"
                    className="w-32 px-2 py-1 border rounded text-sm"
                  />
                  <input
                    type="number"
                    defaultValue={faq.display_order}
                    onBlur={(e) => handleUpdate(faq.id, { display_order: parseInt(e.target.value) })}
                    className="w-20 px-2 py-1 border rounded text-sm"
                    placeholder="Order"
                  />
                  <label className="flex items-center gap-1 text-sm">
                    <input
                      type="checkbox"
                      checked={faq.is_published}
                      onChange={(e) => handleUpdate(faq.id, { is_published: e.target.checked })}
                    />
                    Published
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
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 mb-1">{faq.question}</div>
                    <div className="text-sm text-gray-700">{faq.answer}</div>
                    <div className="flex gap-2 mt-2">
                      {faq.category && (
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                          {faq.category}
                        </span>
                      )}
                      <span className="text-xs text-gray-400">Order: {faq.display_order}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    {!faq.is_published && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                        Draft
                      </span>
                    )}
                    <button
                      onClick={() => setEditingId(faq.id)}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(faq.id)}
                      className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        {faqs.length === 0 && !showAddForm && (
          <EmptyState
            title="No FAQs yet"
            description="Add your first FAQ to help clients with common questions."
            actionLabel="Add First FAQ"
            onAction={() => setShowAddForm(true)}
            icon={
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        )}
      </div>
    </div>
  );
}
