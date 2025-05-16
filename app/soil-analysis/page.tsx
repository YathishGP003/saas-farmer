"use client";

import React, { useState } from "react";
import Link from "next/link";
import { indianStates } from "@/utils/cropData";

export default function SoilAnalysisPage() {
  const [formData, setFormData] = useState({
    state: "",
    district: "",
    pH: 7.0,
    nitrogen: 0,
    phosphorus: 0,
    potassium: 0,
    moisture: 0,
  });
  
  const [language, setLanguage] = useState("english");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    recommendedCrops: string[];
    fertilizerPlan: {
      npkRatio: string;
      organicOptions: string[];
      description: string;
    };
    waterRequirements: {
      amount: string;
      schedule: string;
      sustainableMethods: string[];
    };
    sustainablePractices: string[];
  } | null>(null);

  const languages = [
    "english",
    "hindi",
    "tamil",
    "telugu",
    "kannada",
    "malayalam",
    "marathi",
    "punjabi",
    "gujarati",
    "bengali",
    "oriya",
    "assamese"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: name === 'pH' ? parseFloat(value) : name === 'state' || name === 'district' ? value : parseInt(value, 10)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/soil-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, language }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get soil analysis');
      }
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to get soil analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 py-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-green-800">Soil Analysis and Recommendations</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-green-700">How It Works</h2>
          <p className="mb-4 text-gray-800 text-base">
            Our soil analysis tool uses your soil data to provide personalized recommendations
            for crops, fertilizers, and water management based on agricultural science.
          </p>
          <ul className="list-disc pl-8 mb-6 space-y-2 text-gray-800">
            <li>Enter your soil's pH, nutrient levels (N-P-K), and moisture content</li>
            <li>Get crop recommendations suitable for your soil conditions</li>
            <li>Receive customized fertilizer plans with organic options</li>
            <li>Learn about water requirements and sustainable farming methods</li>
            <li>Location-specific recommendations when you provide your region</li>
          </ul>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  State
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select your state (optional)</option>
                  {indianStates.map((stateName) => (
                    <option key={stateName} value={stateName}>
                      {stateName}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  District/Area
                </label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter your district (optional)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Soil pH (0-14)
                </label>
                <input
                  type="range"
                  name="pH"
                  min="0"
                  max="14"
                  step="0.1"
                  value={formData.pH}
                  onChange={handleInputChange}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-sm font-medium text-red-600">Acidic (0)</span>
                  <span className="text-sm font-bold">{formData.pH}</span>
                  <span className="text-sm font-medium text-purple-600">Alkaline (14)</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Nitrogen (N) Level (kg/ha)
                </label>
                <input
                  type="number"
                  name="nitrogen"
                  value={formData.nitrogen}
                  onChange={handleInputChange}
                  min="0"
                  max="1000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Phosphorus (P) Level (kg/ha)
                </label>
                <input
                  type="number"
                  name="phosphorus"
                  value={formData.phosphorus}
                  onChange={handleInputChange}
                  min="0"
                  max="1000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Potassium (K) Level (kg/ha)
                </label>
                <input
                  type="number"
                  name="potassium"
                  value={formData.potassium}
                  onChange={handleInputChange}
                  min="0"
                  max="1000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Soil Moisture (%)
                </label>
                <input
                  type="number"
                  name="moisture"
                  value={formData.moisture}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Preferred Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <button 
              type="submit" 
              className="w-full mt-6 bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-lg font-semibold"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </span>
              ) : 'Get Recommendations'}
            </button>
          </form>
        </div>
        
        {result && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-5 text-green-700">Soil Analysis Results</h2>
            
            <div className="mb-6">
              <h3 className="font-bold text-xl mb-3 text-green-800">Recommended Crops</h3>
              <div className="bg-green-50 p-5 rounded-lg border border-green-100">
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {result.recommendedCrops.map((crop, index) => (
                    <li key={index} className="flex items-center bg-white p-2 border border-green-200 rounded">
                      <span className="mr-2 text-green-600 text-xl">•</span> 
                      <span className="text-gray-900 font-semibold text-base">{crop}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-bold text-xl mb-3 text-green-800">Fertilizer Recommendations</h3>
              <div className="bg-green-50 p-5 rounded-lg border border-green-100">
                <div className="mb-3 p-2 bg-white border border-green-200 rounded">
                  <p className="font-bold text-base">
                    Recommended NPK Ratio: <span className="text-green-700">{result.fertilizerPlan.npkRatio}</span>
                  </p>
                </div>
                
                <div className="mb-4 p-2 bg-white border border-green-200 rounded">
                  <p className="text-gray-800 font-semibold text-base">{result.fertilizerPlan.description}</p>
                </div>
                
                <p className="font-bold mb-2 text-green-800">Organic Options:</p>
                <ul className="list-disc pl-5 space-y-2">
                  {result.fertilizerPlan.organicOptions.map((option, index) => (
                    <li key={index} className="text-gray-800 font-semibold text-base bg-white p-2 border border-green-200 rounded">{option}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-bold text-xl mb-3 text-green-800">Water Requirements</h3>
              <div className="bg-green-50 p-5 rounded-lg border border-green-100">
                <div className="mb-3 p-2 bg-white border border-green-200 rounded">
                  <p className="text-gray-800 font-semibold text-base">
                    <span className="font-bold text-green-800 mr-2">Amount:</span> 
                    <span className="text-gray-900">{result.waterRequirements.amount}</span>
                  </p>
                </div>
                
                <div className="mb-4 p-2 bg-white border border-green-200 rounded">
                  <p className="text-gray-800 font-semibold text-base">
                    <span className="font-bold text-green-800 mr-2">Schedule:</span> 
                    <span className="text-gray-900">{result.waterRequirements.schedule}</span>
                  </p>
                </div>
                
                <p className="font-bold mb-2 text-green-800">Sustainable Water Management:</p>
                <ul className="list-disc pl-5 space-y-2">
                  {result.waterRequirements.sustainableMethods.map((method, index) => (
                    <li key={index} className="text-gray-800 font-semibold text-base bg-white p-2 border border-green-200 rounded">{method}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-bold text-xl mb-3 text-green-800">Sustainable Farming Practices</h3>
              <div className="bg-green-50 p-5 rounded-lg border border-green-100">
                <ul className="list-disc pl-5 space-y-2">
                  {result.sustainablePractices.map((practice, index) => (
                    <li key={index} className="text-gray-800 font-semibold text-base bg-white p-2 border border-green-200 rounded">{practice}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-700 font-medium">
                * Recommendations are based on your provided soil data and agricultural science. 
                For most accurate results, consider professional soil testing services.
              </p>
            </div>
          </div>
        )}
        
        <div className="mt-8 text-center">
          <Link href="/" className="text-green-700 hover:text-green-900 font-semibold text-lg">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 