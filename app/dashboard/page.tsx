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
    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    const accessToken = localStorage.getItem('accessToken');
    
    if (storedUser && accessToken) {
      try {
        setUser(JSON.parse(storedUser));
        setLoading(false);
      } catch (err) {
        setError('Invalid user data');
        setLoading(false);
      }
    } else {
      // Redirect to login if no stored user or token
      router.push('/auth/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    router.push('/auth/login');
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
      <header className="bg-green-700 shadow-md">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">Farmer Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-white font-medium">Welcome, {user.fullName}</span>
            <button
              onClick={handleLogout}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 border border-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* GPT Alerts Section */}
        <div className="mb-8">
          <GptAlerts />
        </div>
        
        {/* Weather and Soil Health Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="lg:col-span-1">
            <WeatherPanel />
          </div>
          <div className="lg:col-span-1">
            <SoilHealthPanel />
          </div>
        </div>
        
        {/* Commodity Price Section */}
        <div className="mb-8">
          <CommodityPriceVisualization />
        </div>
        
        {/* Disease Logs Section */}
        <div className="mb-8">
          <DiseaseLogsPanel />
        </div>
        
        {/* Quick Links Section */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Farmer Tools</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/crop-suggestion"
              className="bg-green-100 hover:bg-green-200 p-6 rounded-md text-center flex flex-col items-center justify-center border-2 border-green-200 shadow-sm transition-all hover:shadow-md"
            >
              <span className="text-3xl mb-3">🌱</span>
              <div className="font-bold text-gray-800 text-lg">Crop Suggestions</div>
            </Link>
            <Link
              href="/plant-disease"
              className="bg-green-100 hover:bg-green-200 p-6 rounded-md text-center flex flex-col items-center justify-center border-2 border-green-200 shadow-sm transition-all hover:shadow-md"
            >
              <span className="text-3xl mb-3">🔬</span>
              <div className="font-bold text-gray-800 text-lg">Plant Disease</div>
            </Link>
            <Link
              href="/soil-analysis"
              className="bg-green-100 hover:bg-green-200 p-6 rounded-md text-center flex flex-col items-center justify-center border-2 border-green-200 shadow-sm transition-all hover:shadow-md"
            >
              <span className="text-3xl mb-3">🧪</span>
              <div className="font-bold text-gray-800 text-lg">Soil Analysis</div>
            </Link>
            <Link
              href="/whatsapp-bot"
              className="bg-green-100 hover:bg-green-200 p-6 rounded-md text-center flex flex-col items-center justify-center border-2 border-green-200 shadow-sm transition-all hover:shadow-md"
            >
              <span className="text-3xl mb-3">💬</span>
              <div className="font-bold text-gray-800 text-lg">WhatsApp Bot</div>
            </Link>
          </div>
        </div>
        
        {/* API Documentation Link - for developers or admin users */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Developer Resources</h2>
          <div className="flex justify-start">
            <Link
              href="/api-docs"
              className="inline-flex items-center gap-3 bg-blue-100 hover:bg-blue-200 px-5 py-3 rounded-md border-2 border-blue-200 shadow-sm transition-all hover:shadow-md"
            >
              <span className="text-2xl">📝</span>
              <span className="font-bold text-gray-800 text-lg">API Documentation</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
} 