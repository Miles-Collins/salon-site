"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import DashboardClient from "./DashboardClient";
import ContentManager from "./ContentManager";
import TestimonialsManager from "./TestimonialsManager";
import FAQManager from "./FAQManager";
import ServiceDetailsManager from "./ServiceDetailsManager";
import ChatSettingsManager from "./ChatSettingsManager";
import GalleryManager from "./GalleryManager";

type TabId = "welcome" | "analytics" | "site-content" | "services" | "testimonials" | "faqs" | "chat" | "gallery";

interface Tab {
  id: TabId;
  label: string;
  icon: string;
}

const tabs: Tab[] = [
  { id: "welcome", label: "Overview", icon: "👋" },
  { id: "analytics", label: "Analytics", icon: "📊" },
  { id: "site-content", label: "Site Content", icon: "✏️" },
  { id: "services", label: "Services", icon: "✂️" },
  { id: "testimonials", label: "Testimonials", icon: "💬" },
  { id: "faqs", label: "FAQs", icon: "❓" },
  { id: "chat", label: "Chat Widget", icon: "💭" },
  { id: "gallery", label: "Gallery", icon: "🖼️" },
];

export default function DashboardTabs() {
  const [activeTab, setActiveTab] = useState<TabId>("welcome");
  const { user } = useUser();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigation */}
      <aside className="hidden lg:flex fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-gradient-to-b from-slate-800 to-slate-900 text-white flex-col shadow-2xl z-40 overflow-y-auto">
        {/* User Profile Section */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center mb-2 shadow-lg">
              {user?.imageUrl ? (
                <img 
                  src={user.imageUrl} 
                  alt={user.fullName || "User"} 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <svg className="w-10 h-10 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              )}
            </div>
            <h2 className="text-base font-semibold text-center truncate max-w-full px-2">
              {user?.fullName || user?.firstName || "Dashboard User"}
            </h2>
            <p className="text-xs text-slate-400 text-center mt-1 truncate max-w-full px-2">
              {user?.primaryEmailAddress?.emailAddress || ""}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${
                activeTab === tab.id
                  ? "bg-slate-700 text-white shadow-md"
                  : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
              }`}
            >
              <span className="text-xl" role="img" aria-label={tab.label}>
                {tab.icon}
              </span>
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700">
          <p className="text-xs text-slate-500 text-center">
            © 2025 Color Rebel
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 mt-16 p-3 sm:p-4 md:p-6 lg:p-8 lg:ml-64">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Tab */}
          {activeTab === "welcome" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-8 text-white shadow-lg">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  Welcome back, {user?.firstName || "there"}! 👋
                </h1>
                <p className="text-purple-100 text-lg">
                  Manage your salon&apos;s online presence from one central dashboard.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {tabs.slice(1).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all text-left group"
                  >
                    <div className="text-4xl mb-3">{tab.icon}</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                      {tab.label}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {getTabDescription(tab.id)}
                    </p>
                  </button>
                ))}
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <span>🌐</span>
                    <span className="text-sm font-medium">View Live Site</span>
                  </a>
                  <button
                    onClick={() => setActiveTab("analytics")}
                    className="flex items-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <span>📊</span>
                    <span className="text-sm font-medium">View Analytics</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("gallery")}
                    className="flex items-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <span>📸</span>
                    <span className="text-sm font-medium">Upload Photos</span>
                  </button>
                  <a
                    href="/transformations"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <span>⚡</span>
                    <span className="text-sm font-medium">View Transformations</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Analytics & Reports</h1>
                <p className="text-gray-600 mt-1">View your business metrics and GlossGenius data</p>
              </div>
              <DashboardClient />
            </div>
          )}

          {/* Site Content Tab */}
          {activeTab === "site-content" && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Site Content</h1>
                <p className="text-gray-600 mt-1">Edit homepage hero, announcement banner, and policies</p>
              </div>
              <ContentManager />
            </div>
          )}

          {/* Services Tab */}
          {activeTab === "services" && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Service Details</h1>
                <p className="text-gray-600 mt-1">Create and edit detailed service pages with pricing and FAQs</p>
              </div>
              <ServiceDetailsManager />
            </div>
          )}

          {/* Testimonials Tab */}
          {activeTab === "testimonials" && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Testimonials</h1>
                <p className="text-gray-600 mt-1">Manage client reviews displayed on your site</p>
              </div>
              <TestimonialsManager />
            </div>
          )}

          {/* FAQs Tab */}
          {activeTab === "faqs" && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">FAQs</h1>
                <p className="text-gray-600 mt-1">Manage frequently asked questions</p>
              </div>
              <FAQManager />
            </div>
          )}

          {/* Chat Tab */}
          {activeTab === "chat" && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Chat Widget</h1>
                <p className="text-gray-600 mt-1">Customize the live chat widget on your website</p>
              </div>
              <ChatSettingsManager />
            </div>
          )}

          {/* Gallery Tab */}
          {activeTab === "gallery" && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Gallery</h1>
                <p className="text-gray-600 mt-1">Upload and manage photos for your gallery page</p>
              </div>
              <GalleryManager />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getTabDescription(tabId: TabId): string {
  const descriptions: Record<TabId, string> = {
    welcome: "",
    analytics: "View metrics and reports",
    "site-content": "Edit homepage and announcements",
    services: "Manage service pages",
    testimonials: "Client reviews and feedback",
    faqs: "Common questions",
    chat: "Customize chat widget",
    gallery: "Photo management",
  };
  return descriptions[tabId];
}
