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
import TransformationsManager from "./TransformationsManager";

type TabId =
  | "welcome"
  | "analytics"
  | "site-content"
  | "services"
  | "testimonials"
  | "faqs"
  | "chat"
  | "gallery"
  | "transformations";

interface Tab {
  id: TabId;
  label: string;
  icon: string;
  description: string;
  category: "overview" | "content" | "media";
}

const tabs: Tab[] = [
  { id: "welcome", label: "Overview", icon: "👋", description: "Dashboard home", category: "overview" },
  { id: "analytics", label: "Analytics", icon: "📊", description: "View metrics and reports", category: "overview" },
  { id: "site-content", label: "Site Content", icon: "✏️", description: "Edit homepage and announcements", category: "content" },
  { id: "services", label: "Services", icon: "✂️", description: "Manage service pages", category: "content" },
  { id: "testimonials", label: "Testimonials", icon: "💬", description: "Client reviews and feedback", category: "content" },
  { id: "faqs", label: "FAQs", icon: "❓", description: "Common questions", category: "content" },
  { id: "chat", label: "Chat Widget", icon: "💭", description: "Customize chat widget", category: "content" },
  { id: "gallery", label: "Gallery", icon: "🖼️", description: "Photo management", category: "media" },
  { id: "transformations", label: "Transformations", icon: "⚡", description: "Before/after management", category: "media" },
];

export default function DashboardTabs() {
  const [activeTab, setActiveTab] = useState<TabId>("welcome");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useUser();

  const activeTabData = tabs.find(t => t.id === activeTab);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      {/* Sidebar Navigation */}
      <aside className="hidden lg:flex fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 bg-white border-r border-gray-200 flex-col shadow-sm z-40 overflow-y-auto">
        {/* User Profile Section */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-br from-purple-50 to-indigo-50">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg ring-4 ring-white">
              {user?.imageUrl ? (
                <img 
                  src={user.imageUrl} 
                  alt={user.fullName || "User"} 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-bold text-gray-900 truncate">
                {user?.fullName || user?.firstName || "Dashboard User"}
              </h2>
              <p className="text-xs text-gray-600 truncate">
                {user?.primaryEmailAddress?.emailAddress || ""}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation by Category */}
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          {/* Overview Section */}
          <div>
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Overview</h3>
            <div className="space-y-1">
              {tabs.filter(t => t.category === "overview").map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm group ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className={`text-lg transition-transform group-hover:scale-110 ${activeTab === tab.id ? '' : 'grayscale'}`}>
                    {tab.icon}
                  </span>
                  <div className="flex-1 text-left">
                    <div className="font-semibold">{tab.label}</div>
                    {activeTab !== tab.id && (
                      <div className="text-xs text-gray-500 group-hover:text-gray-600">{tab.description}</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Content Management Section */}
          <div>
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Content</h3>
            <div className="space-y-1">
              {tabs.filter(t => t.category === "content").map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm group ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className={`text-lg transition-transform group-hover:scale-110 ${activeTab === tab.id ? '' : 'grayscale'}`}>
                    {tab.icon}
                  </span>
                  <div className="flex-1 text-left">
                    <div className="font-semibold">{tab.label}</div>
                    {activeTab !== tab.id && (
                      <div className="text-xs text-gray-500 group-hover:text-gray-600">{tab.description}</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Media Section */}
          <div>
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Media</h3>
            <div className="space-y-1">
              {tabs.filter(t => t.category === "media").map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm group ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className={`text-lg transition-transform group-hover:scale-110 ${activeTab === tab.id ? '' : 'grayscale'}`}>
                    {tab.icon}
                  </span>
                  <div className="flex-1 text-left">
                    <div className="font-semibold">{tab.label}</div>
                    {activeTab !== tab.id && (
                      <div className="text-xs text-gray-500 group-hover:text-gray-600">{tab.description}</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </nav>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-16 left-0 right-0 bg-white border-b border-gray-200 z-30 px-4 py-3">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex items-center gap-2 text-gray-900"
        >
          <span className="text-2xl">{activeTabData?.icon}</span>
          <span className="font-semibold">{activeTabData?.label}</span>
          <svg className={`w-5 h-5 ml-auto transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg max-h-[70vh] overflow-y-auto">
            <div className="p-2 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{tab.label}</div>
                    <div className={`text-xs ${activeTab === tab.id ? 'text-purple-100' : 'text-gray-500'}`}>
                      {tab.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-72 pt-16 lg:pt-16">
        <div className="p-4 sm:p-6 lg:p-8 mt-14 lg:mt-0">
          <div className="max-w-7xl mx-auto">{renderTabContent(activeTab, user, setActiveTab)}</div>
        </div>
      </div>
    </div>
  );
}

function renderTabContent(activeTab: TabId, user: any, setActiveTab: (tab: TabId) => void) {
  switch (activeTab) {
    case "welcome":
      return (
        <div className="space-y-8">
          {/* Hero Welcome Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 rounded-2xl shadow-xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative p-8 md:p-12">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-5xl">👋</span>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    Welcome back, {user?.firstName || "there"}!
                  </h1>
                  <p className="text-purple-100 text-lg mt-1">
                    Manage your salon&apos;s online presence
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Total Views</h3>
                <span className="text-2xl">👁️</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">--</p>
              <p className="text-xs text-gray-500 mt-1">View analytics for details</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Active Services</h3>
                <span className="text-2xl">✂️</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">--</p>
              <p className="text-xs text-gray-500 mt-1">Manage in Services tab</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Gallery Photos</h3>
                <span className="text-2xl">🖼️</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">--</p>
              <p className="text-xs text-gray-500 mt-1">Upload in Gallery tab</p>
            </div>
          </div>

          {/* Management Cards */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Access</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {tabs.filter(t => t.id !== "welcome").map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-purple-300 transition-all text-left group"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl group-hover:scale-110 transition-transform">{tab.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                        {tab.label}
                      </h3>
                      <p className="text-sm text-gray-600">{tab.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-lg transition-all border border-gray-200 hover:border-gray-300 group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">🌐</span>
                <span className="text-sm font-medium text-gray-700">View Live Site</span>
              </a>
              <button
                onClick={() => setActiveTab("analytics")}
                className="flex items-center gap-3 px-4 py-3 bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-lg transition-all border border-blue-200 hover:border-blue-300 group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">📊</span>
                <span className="text-sm font-medium text-blue-700">View Analytics</span>
              </button>
              <button
                onClick={() => setActiveTab("gallery")}
                className="flex items-center gap-3 px-4 py-3 bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-lg transition-all border border-purple-200 hover:border-purple-300 group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">📸</span>
                <span className="text-sm font-medium text-purple-700">Upload Photos</span>
              </button>
              <button
                onClick={() => setActiveTab("transformations")}
                className="flex items-center gap-3 px-4 py-3 bg-gradient-to-br from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 rounded-lg transition-all border border-amber-200 hover:border-amber-300 group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">⚡</span>
                <span className="text-sm font-medium text-amber-700">Transformations</span>
              </button>
            </div>
          </div>
        </div>
      );

    case "analytics":
      return (
        <div>
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">📊</span>
              <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
            </div>
            <p className="text-gray-600">View your business metrics and GlossGenius data</p>
          </div>
          <DashboardClient />
        </div>
      );

    case "site-content":
      return (
        <div>
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">✏️</span>
              <h1 className="text-3xl font-bold text-gray-900">Site Content</h1>
            </div>
            <p className="text-gray-600">Edit homepage hero, announcement banner, and policies</p>
          </div>
          <ContentManager />
        </div>
      );

    case "services":
      return (
        <div>
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">✂️</span>
              <h1 className="text-3xl font-bold text-gray-900">Service Details</h1>
            </div>
            <p className="text-gray-600">Create and edit detailed service pages with pricing and FAQs</p>
          </div>
          <ServiceDetailsManager />
        </div>
      );

    case "testimonials":
      return (
        <div>
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">💬</span>
              <h1 className="text-3xl font-bold text-gray-900">Testimonials</h1>
            </div>
            <p className="text-gray-600">Manage client reviews displayed on your site</p>
          </div>
          <TestimonialsManager />
        </div>
      );

    case "faqs":
      return (
        <div>
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">❓</span>
              <h1 className="text-3xl font-bold text-gray-900">FAQs</h1>
            </div>
            <p className="text-gray-600">Manage frequently asked questions</p>
          </div>
          <FAQManager />
        </div>
      );

    case "chat":
      return (
        <div>
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">💭</span>
              <h1 className="text-3xl font-bold text-gray-900">Chat Widget</h1>
            </div>
            <p className="text-gray-600">Customize the live chat widget on your website</p>
          </div>
          <ChatSettingsManager />
        </div>
      );

    case "gallery":
      return (
        <div>
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">🖼️</span>
              <h1 className="text-3xl font-bold text-gray-900">Gallery</h1>
            </div>
            <p className="text-gray-600">Upload and manage photos for your gallery page</p>
          </div>
          <GalleryManager />
        </div>
      );

    case "transformations":
      return (
        <div>
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">⚡</span>
              <h1 className="text-3xl font-bold text-gray-900">Transformations</h1>
            </div>
            <p className="text-gray-600">Upload and manage before/after transformation photos</p>
          </div>
          <TransformationsManager />
        </div>
      );

    default:
      return null;
  }
}

