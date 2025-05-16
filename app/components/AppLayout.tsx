"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

// Navigation links for sidebar
const navigationLinks = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: "🏠",
  },
  {
    name: "Disease Detection",
    href: "/plant-disease",
    icon: "🔬",
  },
  {
    name: "Crop Suggestion",
    href: "/crop-suggestion",
    icon: "🌱",
  },
  {
    name: "Soil Analysis",
    href: "/soil-analysis",
    icon: "🧪",
  },
  {
    name: "Weather Forecast",
    href: "/weather-forecast",
    icon: "🌦️",
  },
  {
    name: "Market Prices",
    href: "/market-prices",
    icon: "💰",
  },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden -ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Open sidebar</span>
              {isMobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>

            {/* Logo */}
            <Link
              href="/dashboard"
              className="flex items-center ml-3 lg:ml-0 text-green-600 font-bold text-xl lg:text-2xl"
            >
              <span className="text-2xl mr-2">🌿</span>
              AgriLearnNetwork
            </Link>
          </div>

          {/* User profile and logout */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-gray-700">
                  Chandan C R
                </span>
                <span className="text-xs text-gray-500">
                  chandancr515@gmail.com
                </span>
              </div>
              <div className="bg-green-600 h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold">
                C
              </div>
            </div>
            <Link
              href="/auth/login"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </Link>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Sidebar Backdrop */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`bg-white border-r border-gray-200 w-64 flex-shrink-0 flex flex-col z-20
                     fixed lg:fixed top-16 h-[calc(100vh-4rem)] overflow-y-auto
                     transition-transform duration-300 ease-in-out
                     ${
                       isMobileMenuOpen
                         ? "translate-x-0"
                         : "-translate-x-full lg:translate-x-0"
                     }`}
        >
          <nav className="flex-1 overflow-y-auto pt-5 px-2 pb-4">
            <div className="px-2 mb-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Farmer Tools
              </h3>
            </div>
            <div className="space-y-1">
              {navigationLinks.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md
                              ${
                                isActive
                                  ? "bg-green-50 text-green-700"
                                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                              }`}
                  >
                    <span className="mr-3 text-xl">{item.icon}</span>
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 ml-0 lg:ml-64">
          {children}
        </main>
      </div>
    </div>
  );
}
