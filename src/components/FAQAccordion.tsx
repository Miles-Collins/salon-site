"use client";

import { useState } from "react";

type FAQ = {
  id: string;
  question: string;
  answer: string;
  category?: string;
};

type FAQAccordionProps = {
  faqs: FAQ[];
};

export default function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  if (faqs.length === 0) return null;

  return (
    <div className="space-y-3">
      {faqs.map((faq) => (
        <div key={faq.id} className="border border-gray-200 rounded overflow-hidden">
          <button
            onClick={() => toggleFAQ(faq.id)}
            className="w-full px-6 py-4 text-left flex items-center justify-between bg-white hover:bg-gray-50 transition"
            aria-expanded={openId === faq.id}
            aria-controls={`faq-answer-${faq.id}`}
          >
            <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
            <svg
              className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${
                openId === faq.id ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openId === faq.id && (
            <div
              id={`faq-answer-${faq.id}`}
              className="px-6 py-4 bg-gray-50 border-t border-gray-200"
            >
              <p className="text-gray-700 whitespace-pre-line">{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
