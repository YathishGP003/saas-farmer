"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "../components/AppLayout";
import WeatherPanel from "../components/WeatherPanel";
import SoilHealthPanel from "../components/SoilHealthPanel";
import GptAlerts from "../components/GptAlerts";
import CommodityPriceVisualization from "../components/CommodityPriceVisualization";
import DiseaseLogsPanel from "../components/DiseaseLogsPanel";

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("user");
    const accessToken = localStorage.getItem("accessToken");

    if (storedUser && accessToken) {
      try {
        setUser(JSON.parse(storedUser));
        setLoading(false);
      } catch (err) {
        setError("Invalid user data");
        setLoading(false);
      }
    } else {
      // Redirect to login if no stored user or token
      // router.push("/auth/login");

      // For demo purposes, just set loading to false without redirecting
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
          Dashboard
        </h1>

        {/* Main content area with vertical stacking */}
        <div className="space-y-8">
          {/* AI alerts section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              AI Farming Insights
            </h2>
            <GptAlerts />
          </div>

          {/* Weather Panel - Full Width */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Weather Forecast
            </h2>
            <WeatherPanel />
          </div>

          {/* Soil Health Panel - Full Width */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Soil Health
            </h2>
            <SoilHealthPanel />
          </div>

          {/* Activity Logs - Disease Detection History */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Recent Disease Detection
            </h2>
            <DiseaseLogsPanel />
          </div>

          {/* Market Prices */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Market Commodity Prices
            </h2>
            <CommodityPriceVisualization />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
