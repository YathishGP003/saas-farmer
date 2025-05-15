'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import GptAlerts from '../components/GptAlerts';
import WeatherPanel from '../components/WeatherPanel';
import CommodityPriceVisualization from '../components/CommodityPriceVisualization';
import DiseaseLogsPanel from '../components/DiseaseLogsPanel';
import SoilHealthPanel from '../components/SoilHealthPanel';

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
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/auth/me');
        
        if (!response.ok) {
          if (response.status === 401) {
            // Redirect to login if unauthorized
            router.push('/auth/login');
            return;
          }
          throw new Error('Failed to fetch user profile');
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      router.push('/auth/login');
    } catch (err) {
      setError('Failed to logout');
    }
  };

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

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">
          Not authenticated. Please{' '}
          <Link href="/auth/login" className="text-green-600 hover:underline">
            login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Farmer Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {user.fullName}</span>
            <button
              onClick={handleLogout}
              className="rounded-md bg-red-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* GPT Alerts Section */}
        <div className="mb-6">
          <GptAlerts />
        </div>
        
        {/* Weather and Commodity Price Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="lg:col-span-1">
            <WeatherPanel />
          </div>
          <div className="lg:col-span-1">
            <SoilHealthPanel />
          </div>
        </div>
        
        {/* Commodity Price Section */}
        <div className="mb-6">
          <CommodityPriceVisualization />
        </div>
        
        {/* Disease Logs Section */}
        <div className="mb-6">
          <DiseaseLogsPanel />
        </div>
        
        {/* Quick Links Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Farmer Tools</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/crop-suggestion"
              className="bg-green-100 hover:bg-green-200 p-4 rounded-md text-center flex flex-col items-center justify-center"
            >
              <span className="text-2xl mb-2">🌱</span>
              <div className="font-medium">Crop Suggestions</div>
            </Link>
            <Link
              href="/plant-disease"
              className="bg-green-100 hover:bg-green-200 p-4 rounded-md text-center flex flex-col items-center justify-center"
            >
              <span className="text-2xl mb-2">🔬</span>
              <div className="font-medium">Plant Disease</div>
            </Link>
            <Link
              href="/soil-analysis"
              className="bg-green-100 hover:bg-green-200 p-4 rounded-md text-center flex flex-col items-center justify-center"
            >
              <span className="text-2xl mb-2">🧪</span>
              <div className="font-medium">Soil Analysis</div>
            </Link>
            <Link
              href="/whatsapp-bot"
              className="bg-green-100 hover:bg-green-200 p-4 rounded-md text-center flex flex-col items-center justify-center"
            >
              <span className="text-2xl mb-2">💬</span>
              <div className="font-medium">WhatsApp Bot</div>
            </Link>
          </div>
        </div>
        
        {/* API Documentation Link - for developers or admin users */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Developer Resources</h2>
          <div className="flex justify-start">
            <Link
              href="/api-docs"
              className="inline-flex items-center gap-2 bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded-md"
            >
              <span>📝</span>
              <span className="font-medium">API Documentation</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
} 