'use client';

import { useState } from 'react';

const GLOSS_GENIUS_URL = 'https://porschacradic.glossgenius.com/services';

export default function BookServiceButton({ className }: { className?: string }) {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleBookClick = () => {
    setIsLoading(true);
    setShowModal(true);
    // Simulate loading then redirect
    setTimeout(() => {
      setCompleted(true);
      setIsLoading(false);
      setTimeout(() => {
        window.open(GLOSS_GENIUS_URL, '_blank');
        setShowModal(false);
        setCompleted(false);
      }, 500);
    }, 1200);
  };

  return (
    <>
      <button
        onClick={handleBookClick}
        disabled={isLoading || completed}
        className={className}
      >
        Book This Service
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 page-enter">
          <div className="bg-white rounded-lg p-8 max-w-md w-full text-center shadow-2xl hover:shadow-3xl transition duration-300">
            <div className="mb-4">
              {completed ? (
                <div className="success-icon text-4xl text-green-500 inline-block">✓</div>
              ) : isLoading ? (
                <div className="inline-block">
                  <svg
                    className="w-16 h-16 mx-auto text-[#C9A961] form-spinner"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="9" strokeWidth="2" opacity="0.3" />
                    <path
                      strokeLinecap="round"
                      strokeWidth={2}
                      d="M12 2a10 10 0 0 1 0 20"
                      opacity="0.7"
                    />
                  </svg>
                </div>
              ) : (
                <svg
                  className="w-16 h-16 mx-auto text-[#C9A961]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
            </div>
            <h3 className="text-2xl font-bold mb-2 text-black">
              {completed ? 'Redirecting...' : 'Opening Booking System'}
            </h3>
            <p className="text-gray-600">
              {completed
                ? 'Taking you to GlossGenius...'
                : "You'll be taken to our secure booking system to complete your appointment."}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

