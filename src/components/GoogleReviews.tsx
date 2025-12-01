"use client";

import { useEffect, useState } from "react";

type GoogleReviewsProps = {
  placeId?: string; // Google Place ID - can be made configurable via env
};

export default function GoogleReviews({ placeId }: GoogleReviewsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get Google Place ID from env or props
  const googlePlaceId = placeId || process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID;

  if (!mounted || !googlePlaceId) {
    return null;
  }

  // Google Maps search URL for the business
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=Color+Rebel+by+Porscha+Leavenworth+KS&query_place_id=${googlePlaceId}`;

  return (
    <div className="inline-flex flex-col items-center gap-3 p-6 bg-white rounded border border-gray-200 shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-2">
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        <span className="font-semibold text-gray-900">Google Reviews</span>
      </div>
      
      <a
        href={googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 bg-brand-accent text-white rounded hover:bg-brand-accent/90 transition text-sm font-medium"
      >
        Read & Write Reviews
      </a>
      
      <p className="text-xs text-gray-500 text-center">
        Share your experience on Google
      </p>
    </div>
  );
}
