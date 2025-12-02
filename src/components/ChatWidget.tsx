"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

type ChatSettings = {
  greeting_message: string;
  reply_time_text: string;
  avatar_url: string | null;
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [settings, setSettings] = useState<ChatSettings>({
    greeting_message: "👋 Hi! I'm Porscha. Have questions about services, pricing, or availability? Send me a message!",
    reply_time_text: "Typically replies within hours",
    avatar_url: null,
  });
  
  const pathname = usePathname();
  
  // Hide on owner pages and sign-in
  const shouldHide = pathname.startsWith("/owner") || pathname.startsWith("/sign-in");

  // Fetch chat settings
  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch("/api/owner/chat-settings/get");
        if (response.ok) {
          const data = await response.json();
          if (data.settings) {
            setSettings(data.settings);
          }
        }
      } catch (error) {
        console.error("Failed to fetch chat settings:", error);
      }
    }
    fetchSettings();
  }, []);

  if (shouldHide) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const response = await fetch("/api/contact-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (response.ok) {
        setStatus("success");
        setName("");
        setEmail("");
        setMessage("");
        setTimeout(() => {
          setStatus("idle");
          setIsOpen(false);
        }, 3000);
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <>
      {/* Chat Bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-50 bg-brand text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 group"
        aria-label="Open chat"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            {/* Pulse indicator */}
            <span className="absolute top-0 right-0 w-3 h-3 bg-brand-accent rounded-full animate-ping"></span>
            <span className="absolute top-0 right-0 w-3 h-3 bg-brand-accent rounded-full"></span>
          </>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 z-50 w-80 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-brand text-white p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-accent rounded-full flex items-center justify-center font-bold text-black overflow-hidden">
              {settings.avatar_url ? (
                <Image
                  src={settings.avatar_url}
                  alt="Porscha"
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="relative inline-block text-sm tracking-tighter leading-none translate-x-1.5">
                  <span className="relative -mr-0.5">P</span>
                  <span className="relative -ml-0.5">C</span>
                </span>
              )}
            </div>
            <div className="flex-1">
              <div className="font-semibold">Color Rebel by Porscha</div>
              <div className="text-xs text-white/80">{settings.reply_time_text}</div>
            </div>
          </div>

          {/* Chat Body */}
          <div className="p-4 bg-gray-50 max-h-96 overflow-y-auto">
            {status === "idle" && (
              <div className="space-y-3">
                <div className="bg-white rounded-2xl rounded-tl-none p-3 shadow-sm max-w-[85%]">
                  <p className="text-sm text-gray-800">
                    {settings.greeting_message}
                  </p>
                </div>
              </div>
            )}

            {status === "success" && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="font-semibold text-gray-900">Message sent!</p>
                <p className="text-sm text-gray-600 mt-1">{"I'll get back to you soon."}</p>
              </div>
            )}

            {status === "error" && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
                Sorry, there was an error sending your message. Please try emailing{" "}
                <a href="mailto:PorschaCradic@gmail.com" className="underline">
                  PorschaCradic@gmail.com
                </a>{" "}
                directly.
              </div>
            )}
          </div>

          {/* Message Form */}
          {status !== "success" && (
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white space-y-3">
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
              />
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
              />
              <textarea
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
              />
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full bg-brand text-white py-2 px-4 rounded-lg font-semibold hover:bg-brand/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "sending" ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      )}
    </>
  );
}
