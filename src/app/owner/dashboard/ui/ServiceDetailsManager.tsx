"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useToast } from "@/components/Toast";

type ProcessStep = {
  step: number;
  title: string;
  desc: string;
};

type PricingTier = {
  name: string;
  price: number;
  description?: string;
};

type ServiceFAQ = {
  q: string;
  a: string;
};

type ServiceDetail = {
  id: string;
  slug: string;
  service_name: string;
  category: string;
  base_price: number | null;
  hero_image: string | null;
  description: string | null;
  process_steps: ProcessStep[];
  pricing_tiers: PricingTier[];
  duration_min: number | null;
  aftercare_tips: string | null;
  faqs: ServiceFAQ[];
  is_published: boolean;
};

export default function ServiceDetailsManager() {
  const formRef = useRef<HTMLDivElement>(null);
  const [services, setServices] = useState<ServiceDetail[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ServiceDetail>>({
    slug: "",
    service_name: "",
    category: "",
    base_price: null,
    hero_image: null,
    description: "",
    process_steps: [],
    pricing_tiers: [],
    duration_min: null,
    aftercare_tips: "",
    faqs: [],
    is_published: true,
  });
  const toast = useToast();

  const fetchServices = useCallback(async () => {
    const res = await fetch("/api/owner/service-details");
    if (res.ok) {
      const data = await res.json();
      setServices(data);
      toast.info("Services loaded");
    }
  }, [toast]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  function handleEdit(service: ServiceDetail) {
    setEditingId(service.id);
    setFormData(service);
    // Scroll to form
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  function handleCancel() {
    setEditingId(null);
    setFormData({
      slug: "",
      service_name: "",
      category: "",
      base_price: null,
      hero_image: null,
      description: "",
      process_steps: [],
      pricing_tiers: [],
      duration_min: null,
      aftercare_tips: "",
      faqs: [],
      is_published: true,
    });
  }

  async function handleSave() {
    if (editingId) {
      // Update existing
      const res = await fetch(`/api/owner/service-details/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        await fetchServices();
        handleCancel();
        toast.success("Service updated");
      }
    } else {
      // Create new
      const res = await fetch("/api/owner/service-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        await fetchServices();
        handleCancel();
        toast.success("Service created");
      }
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this service detail page?")) return;
    const res = await fetch(`/api/owner/service-details/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      await fetchServices();
      toast.success("Service deleted");
    }
  }

  function addProcessStep() {
    const steps = formData.process_steps || [];
    setFormData({
      ...formData,
      process_steps: [...steps, { step: steps.length + 1, title: "", desc: "" }],
    });
  }

  function updateProcessStep(index: number, field: keyof ProcessStep, value: string | number) {
    const steps = [...(formData.process_steps || [])];
    steps[index] = { ...steps[index], [field]: value };
    setFormData({ ...formData, process_steps: steps });
  }

  function removeProcessStep(index: number) {
    const steps = [...(formData.process_steps || [])];
    steps.splice(index, 1);
    // Renumber steps
    steps.forEach((s, i) => (s.step = i + 1));
    setFormData({ ...formData, process_steps: steps });
  }

  function addPricingTier() {
    const tiers = formData.pricing_tiers || [];
    setFormData({
      ...formData,
      pricing_tiers: [...tiers, { name: "", price: 0, description: "" }],
    });
  }

  function updatePricingTier(index: number, field: keyof PricingTier, value: string | number) {
    const tiers = [...(formData.pricing_tiers || [])];
    tiers[index] = { ...tiers[index], [field]: field === "price" ? Number(value) : value };
    setFormData({ ...formData, pricing_tiers: tiers });
  }

  function removePricingTier(index: number) {
    const tiers = [...(formData.pricing_tiers || [])];
    tiers.splice(index, 1);
    setFormData({ ...formData, pricing_tiers: tiers });
  }

  function addFAQ() {
    const faqs = formData.faqs || [];
    setFormData({
      ...formData,
      faqs: [...faqs, { q: "", a: "" }],
    });
  }

  function updateFAQ(index: number, field: "q" | "a", value: string) {
    const faqs = [...(formData.faqs || [])];
    faqs[index] = { ...faqs[index], [field]: value };
    setFormData({ ...formData, faqs });
  }

  function removeFAQ(index: number) {
    const faqs = [...(formData.faqs || [])];
    faqs.splice(index, 1);
    setFormData({ ...formData, faqs });
  }

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Service Detail Pages</h2>

      {/* Form */}
      <div ref={formRef} className="mb-6 p-4 border rounded scroll-mt-20">
        <h3 className="font-semibold mb-3">
          {editingId ? "Edit Service Detail" : "Create New Service Detail"}
        </h3>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Slug (URL)</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={formData.slug || ""}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="balayage"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Service Name</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={formData.service_name || ""}
              onChange={(e) => setFormData({ ...formData, service_name: e.target.value })}
              placeholder="Balayage & Style"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={formData.category || ""}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Foils & Balayage"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Base Price ($)</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              value={formData.base_price || ""}
              onChange={(e) =>
                setFormData({ ...formData, base_price: e.target.value ? Number(e.target.value) : null })
              }
              placeholder="175"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              value={formData.duration_min || ""}
              onChange={(e) =>
                setFormData({ ...formData, duration_min: e.target.value ? Number(e.target.value) : null })
              }
              placeholder="150"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Hero Image (filename)</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={formData.hero_image || ""}
              onChange={(e) => setFormData({ ...formData, hero_image: e.target.value })}
              placeholder="balayage-hero.jpg"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            rows={3}
            value={formData.description || ""}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detailed service description..."
          />
        </div>

        {/* Process Steps */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">Process Steps</label>
            <button
              onClick={addProcessStep}
              className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              + Add Step
            </button>
          </div>
          {(formData.process_steps || []).map((step, idx) => (
            <div key={idx} className="border p-3 mb-2 rounded bg-gray-50">
              <div className="flex gap-2 mb-2">
                <input
                  type="number"
                  className="w-16 border rounded px-2 py-1"
                  value={step.step}
                  onChange={(e) => updateProcessStep(idx, "step", Number(e.target.value))}
                  placeholder="#"
                />
                <input
                  type="text"
                  className="flex-1 border rounded px-2 py-1"
                  value={step.title}
                  onChange={(e) => updateProcessStep(idx, "title", e.target.value)}
                  placeholder="Step title"
                />
                <button
                  onClick={() => removeProcessStep(idx)}
                  className="text-red-600 hover:text-red-800 px-2"
                >
                  ✕
                </button>
              </div>
              <textarea
                className="w-full border rounded px-2 py-1"
                rows={2}
                value={step.desc}
                onChange={(e) => updateProcessStep(idx, "desc", e.target.value)}
                placeholder="Step description"
              />
            </div>
          ))}
        </div>

        {/* Pricing Tiers */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">Pricing Tiers</label>
            <button
              onClick={addPricingTier}
              className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              + Add Tier
            </button>
          </div>
          {(formData.pricing_tiers || []).map((tier, idx) => (
            <div key={idx} className="border p-3 mb-2 rounded bg-gray-50">
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  className="flex-1 border rounded px-2 py-1"
                  value={tier.name}
                  onChange={(e) => updatePricingTier(idx, "name", e.target.value)}
                  placeholder="Short Hair"
                />
                <input
                  type="number"
                  className="w-24 border rounded px-2 py-1"
                  value={tier.price}
                  onChange={(e) => updatePricingTier(idx, "price", Number(e.target.value))}
                  placeholder="150"
                />
                <button
                  onClick={() => removePricingTier(idx)}
                  className="text-red-600 hover:text-red-800 px-2"
                >
                  ✕
                </button>
              </div>
              <input
                type="text"
                className="w-full border rounded px-2 py-1"
                value={tier.description || ""}
                onChange={(e) => updatePricingTier(idx, "description", e.target.value)}
                placeholder="Optional description"
              />
            </div>
          ))}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Aftercare Tips</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            rows={4}
            value={formData.aftercare_tips || ""}
            onChange={(e) => setFormData({ ...formData, aftercare_tips: e.target.value })}
            placeholder="Maintenance and care instructions..."
          />
        </div>

        {/* FAQs */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">Service FAQs</label>
            <button
              onClick={addFAQ}
              className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              + Add FAQ
            </button>
          </div>
          {(formData.faqs || []).map((faq, idx) => (
            <div key={idx} className="border p-3 mb-2 rounded bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <input
                  type="text"
                  className="flex-1 border rounded px-2 py-1 mr-2"
                  value={faq.q}
                  onChange={(e) => updateFAQ(idx, "q", e.target.value)}
                  placeholder="Question"
                />
                <button
                  onClick={() => removeFAQ(idx)}
                  className="text-red-600 hover:text-red-800 px-2"
                >
                  ✕
                </button>
              </div>
              <textarea
                className="w-full border rounded px-2 py-1"
                rows={2}
                value={faq.a}
                onChange={(e) => updateFAQ(idx, "a", e.target.value)}
                placeholder="Answer"
              />
            </div>
          ))}
        </div>

        <div className="mb-4 flex items-center gap-2">
          <input
            type="checkbox"
            id="is_published"
            checked={formData.is_published || false}
            onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
          />
          <label htmlFor="is_published" className="text-sm font-medium cursor-pointer">
            Published
          </label>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {editingId ? "Update" : "Create"}
          </button>
          {editingId && (
            <button
              onClick={handleCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {services.map((service) => (
          <div key={service.id} className="border p-4 rounded flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{service.service_name}</h3>
              <p className="text-sm text-gray-600">
                {service.category} • /services/{service.slug}
              </p>
              {service.base_price && (
                <p className="text-sm text-gray-600">Starting at ${service.base_price}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {service.is_published ? "✓ Published" : "✗ Draft"}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(service)}
                className="text-blue-600 hover:text-blue-800 px-3 py-1 border rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(service.id)}
                className="text-red-600 hover:text-red-800 px-3 py-1 border rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {services.length === 0 && (
          <p className="text-gray-500 text-center py-4">No service detail pages yet. Create one above.</p>
        )}
      </div>
    </div>
  );
}
