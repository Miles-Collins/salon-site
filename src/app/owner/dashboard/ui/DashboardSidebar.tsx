"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/owner/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/gallery", label: "Gallery", icon: "🖼️" },
  { href: "/transformations", label: "Transformations", icon: "⚡" },
  { href: "/services", label: "Services", icon: "✂️" },
  { href: "/contact", label: "Contact", icon: "📧" },
];

export default function DashboardSidebar() {
  const { user } = useUser();
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
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

        {/* Navigation Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href === "/owner/dashboard" && pathname?.startsWith("/owner"));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${
                  isActive
                    ? "bg-slate-700 text-white shadow-md"
                    : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                }`}
              >
                <span className="text-xl" role="img" aria-label={item.label}>
                  {item.icon}
                </span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700">
          <p className="text-xs text-slate-500 text-center">
            © 2025 Color Rebel
          </p>
        </div>
      </aside>

      {/* Mobile Spacer (sidebar is hidden on mobile, content uses navbar mobile menu) */}
    </>
  );
}
