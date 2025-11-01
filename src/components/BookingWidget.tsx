"use client";
import { InlineWidget } from "react-calendly";
import { useMemo } from "react";

// TODO: replace with Porscha's actual Calendly link
const CALENDLY_URL = "https://calendly.com/porscha-hair";

export default function BookingWidget() {
  const pageSettings = useMemo(() => ({
    backgroundColor: "ffffff",
    hideEventTypeDetails: false,
    hideLandingPageDetails: false,
    primaryColor: "E879F9",
    textColor: "1F2937",
  }), []);

  return (
    <div className="w-full">
      <InlineWidget
        url={CALENDLY_URL}
        styles={{ height: "750px", width: "100%" }}
        pageSettings={pageSettings as any}
      />
    </div>
  );
}
