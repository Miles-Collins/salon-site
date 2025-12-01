'use client';

import { useState } from 'react';

const GLOSS_GENIUS_URL = 'https://porschacradic.glossgenius.com/services';

export default function BookServiceButton({ className }: { className?: string }) {
  const [showModal, setShowModal] = useState(false);

  const handleBookClick = () => {
    setShowModal(true);
    // Auto-redirect after showing modal
    setTimeout(() => {
      window.open(GLOSS_GENIUS_URL, '_blank');
      setShowModal(false);
    }, 1500);
  };

  return (
    <>
      <button
        onClick={handleBookClick}
        className={className}
      >
        Book This Service
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full text-center shadow-2xl">
            <div className="mb-4">
              <svg
                className="w-16 h-16 mx-auto text-gold"
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
            </div>
            <h3 className="text-2xl font-bold mb-2 text-black">Redirecting to GlossGenius</h3>
            <p className="text-gray-600">
              You&apos;ll be taken to our booking system to complete your appointment.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
