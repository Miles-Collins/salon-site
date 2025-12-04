"use client";

import { useState } from "react";
import Link from "next/link";

export default function BookPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setCompleted(true);
    setTimeout(() => {
      setIsLoading(false);
      setCompleted(false);
      window.open("https://porschacradic.glossgenius.com/services", "_blank");
    }, 400);
  };

  return (
    <section className="py-32 md:py-40">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-serif font-semibold mb-8">Book Your Appointment</h1>
        <p className="text-xl text-gray-700 mb-12 leading-relaxed">
          Ready to transform your look? Click below to view services and book your appointment through our secure booking system.
        </p>
        
        <button
          onClick={handleClick}
          disabled={isLoading}
          className={`inline-flex items-center justify-center gap-2 px-10 py-4 text-lg font-semibold rounded-lg transition duration-300 ${
            completed
              ? "bg-green-500 text-white shadow-lg"
              : isLoading
              ? "btn-accent btn-loading opacity-75 cursor-wait"
              : "btn-accent hover:shadow-lg hover:-translate-y-1"
          }`}
        >
          {completed ? (
            <>
              <span className="success-icon">✓</span> Redirecting...
            </>
          ) : isLoading ? (
            <>
              <span className="form-spinner"></span> Loading...
            </>
          ) : (
            "Book Now on GlossGenius"
          )}
        </button>
        
        <p className="text-base text-gray-600 mt-8">
          You&apos;ll be redirected to our secure booking page
        </p>

        {/* Feature highlights */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-lg border border-gray-200 hover:border-[#C9A961] hover:shadow-lg transition duration-300">
            <div className="text-3xl mb-3">⏰</div>
            <h3 className="font-semibold text-gray-900 mb-2">Easy Scheduling</h3>
            <p className="text-sm text-gray-600">Book instantly with real-time availability</p>
          </div>
          <div className="p-6 bg-white rounded-lg border border-gray-200 hover:border-[#C9A961] hover:shadow-lg transition duration-300">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="font-semibold text-gray-900 mb-2">Secure & Safe</h3>
            <p className="text-sm text-gray-600">Protected by industry-standard security</p>
          </div>
          <div className="p-6 bg-white rounded-lg border border-gray-200 hover:border-[#C9A961] hover:shadow-lg transition duration-300">
            <div className="text-3xl mb-3">📲</div>
            <h3 className="font-semibold text-gray-900 mb-2">Instant Reminders</h3>
            <p className="text-sm text-gray-600">Get notifications before your appointment</p>
          </div>
        </div>
      </div>
    </section>
  );
}
