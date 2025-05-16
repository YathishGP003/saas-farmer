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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-green-700">AgriLearnNetwork</Link>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-gray-100 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-6">
              <Link href="/dashboard" className="text-gray-700 hover:text-green-600 font-medium">Dashboard</Link>
              <Link href="/plant-disease" className="text-gray-700 hover:text-green-600 font-medium">Disease Detection</Link>
              <Link href="/crop-suggestion" className="text-gray-700 hover:text-green-600 font-medium">Crop Suggestion</Link>
              <Link href="/soil-analysis" className="text-gray-700 hover:text-green-600 font-medium">Soil Analysis</Link>
              
              <div className="ml-4 flex items-center space-x-3">
                <div className="relative">
                  <div className="flex items-center space-x-3">
                    <div className="flex flex-col justify-end text-right">
                      <div className="text-sm font-medium text-gray-700">{user.fullName}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold uppercase">
                      {user.fullName?.charAt(0) || 'U'}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="ml-2 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="pt-2 pb-4 space-y-1 px-4">
            <Link href="/dashboard" className="block py-2 px-3 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md">
              Dashboard
            </Link>
            <Link href="/plant-disease" className="block py-2 px-3 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md">
              Disease Detection
            </Link>
            <Link href="/crop-suggestion" className="block py-2 px-3 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md">
              Crop Suggestion
            </Link>
            <Link href="/soil-analysis" className="block py-2 px-3 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md">
              Soil Analysis
            </Link>
            <div className="py-3 px-3 flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold uppercase">
                  {user.fullName?.charAt(0) || 'U'}
                </div>
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-700">{user.fullName}</div>
                <div className="text-xs text-gray-500">{user.email}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left block py-2 px-3 text-base font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Dashboard Header */}
      <header className="bg-green-700 shadow-md">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">Farmer Dashboard</h1>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Plant Analyses</h3>
                <p className="text-xl font-semibold text-gray-800">24</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Soil Tests</h3>
                <p className="text-xl font-semibold text-gray-800">12</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Crop Suggestions</h3>
                <p className="text-xl font-semibold text-gray-800">8</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">AI Insights</h3>
                <p className="text-xl font-semibold text-gray-800">42</p>
              </div>
            </div>
          </div>
        </div>

        {/* GPT Alerts Section */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">AI Insights & Alerts</h2>
          <GptAlerts />
        </div>
        
        {/* Weather and Soil Health Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Weather Forecast</h2>
            <WeatherPanel />
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Soil Health</h2>
            <SoilHealthPanel />
          </div>
        </div>
        
        {/* Commodity Price Section */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Market Prices</h2>
          <CommodityPriceVisualization />
        </div>
        
        {/* Disease Logs Section */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Plant Health History</h2>
          <DiseaseLogsPanel />
        </div>
        
        {/* Quick Links Section */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Farmer Tools</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
          </div>
        </div>
      </main>
    </div>
  );
} 