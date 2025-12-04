"use client";

import { useState } from "react";
import Section from "@/components/Section";
import { useToast } from "@/components/Toast";

export default function ContactPage() {
  const { success, error } = useToast();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setSubmitted(true);
      success("Message sent! We'll get back to you soon.");
      setFormState({ name: "", email: "", phone: "", message: "" });
      
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      error("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Section>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="h2 mb-6 sm:mb-8 text-3xl sm:text-4xl">Get in Touch</h1>
        <p className="text-base sm:text-lg text-gray-600 mb-8 sm:mb-12 leading-relaxed">Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        
        <div className="grid gap-8 sm:gap-12 md:grid-cols-3">
          {/* Contact Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-[#C9A961] focus:ring-2 focus:ring-[#C9A961]/20 transition disabled:bg-gray-50 disabled:opacity-60 min-h-12 text-base"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-[#C9A961] focus:ring-2 focus:ring-[#C9A961]/20 transition disabled:bg-gray-50 disabled:opacity-60 min-h-12 text-base"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Phone (optional)</label>
                <input
                  type="tel"
                  name="phone"
                  value={formState.phone}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-[#C9A961] focus:ring-2 focus:ring-[#C9A961]/20 transition disabled:bg-gray-50 disabled:opacity-60 min-h-12 text-base"
                  placeholder="(913) 680-7987"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Message</label>
                <textarea
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  rows={5}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-[#C9A961] focus:ring-2 focus:ring-[#C9A961]/20 transition disabled:bg-gray-50 disabled:opacity-60 resize-none text-base"
                  placeholder="Tell us what you need..."
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || submitted}
                className={`w-full py-4 px-6 rounded-lg font-semibold uppercase tracking-wider transition duration-300 flex items-center justify-center gap-2 min-h-12 text-base sm:text-lg ${
                  submitted
                    ? "bg-green-500 text-white"
                    : isLoading
                    ? "bg-[#C9A961]/60 text-black cursor-wait opacity-75"
                    : "bg-[#C9A961] text-black hover:bg-[#B8985A] hover:shadow-lg hover:shadow-[#C9A961]/30 hover:translate-y-[-2px]"
                }`}
              >
                {submitted ? (
                  <>
                    <span className="success-icon">✓</span> Message Sent!
                  </>
                ) : isLoading ? (
                  <>
                    <span className="form-spinner"></span> Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-[#C9A961] hover:shadow-lg transition duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">📧 Email</h3>
              <a
                href="mailto:PorschaCradic@gmail.com"
                className="text-[#C9A961] hover:underline break-all"
              >
                PorschaCradic@gmail.com
              </a>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-[#C9A961] hover:shadow-lg transition duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">📞 Phone</h3>
              <a
                href="tel:9136807987"
                className="text-[#C9A961] hover:underline"
              >
                (913) 680-7987
              </a>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-[#C9A961] hover:shadow-lg transition duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">📍 Location</h3>
              <p className="text-gray-700 mb-4">301 S 5TH ST., LEAVENWORTH, KS 66048</p>
              <a
                className="inline-block px-4 py-2 bg-[#C9A961]/10 text-[#C9A961] rounded hover:bg-[#C9A961]/20 transition font-semibold text-sm"
                href="https://www.google.com/maps/search/?api=1&query=301+S+5TH+ST+LEAVENWORTH+KS+66048"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in Maps →
              </a>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
