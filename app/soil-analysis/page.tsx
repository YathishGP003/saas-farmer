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
        body: JSON.stringify(formData),
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Soil Analysis and Recommendations</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-green-700">How It Works</h2>
        <p className="mb-4">
          Our soil analysis tool uses your soil data to provide personalized recommendations
          for crops, fertilizers, and water management based on agricultural science.
        </p>
        <ul className="list-disc pl-8 mb-6 space-y-2">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between mt-2">
                <span className="text-xs">Acidic (0)</span>
                <span className="text-sm font-medium">{formData.pH}</span>
                <span className="text-xs">Alkaline (14)</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
          </div>
          
          <button 
            type="submit" 
            className="w-full mt-6 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Get Recommendations'}
          </button>
        </form>
      </div>
      
      {result && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-green-700">Soil Analysis Results</h2>
          
          <div className="mb-6">
            <h3 className="font-medium text-lg mb-3 text-green-800">Recommended Crops</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {result.recommendedCrops.map((crop, index) => (
                  <li key={index} className="flex items-center">
                    <span className="mr-2 text-green-600">•</span> {crop}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium text-lg mb-3 text-green-800">Fertilizer Recommendations</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium mb-2">Recommended NPK Ratio: <span className="text-green-700">{result.fertilizerPlan.npkRatio}</span></p>
              <p className="mb-3">{result.fertilizerPlan.description}</p>
              
              <p className="font-medium mb-2">Organic Options:</p>
              <ul className="list-disc pl-5 space-y-1">
                {result.fertilizerPlan.organicOptions.map((option, index) => (
                  <li key={index}>{option}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium text-lg mb-3 text-green-800">Water Requirements</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="mb-2"><span className="font-medium">Amount:</span> {result.waterRequirements.amount}</p>
              <p className="mb-3"><span className="font-medium">Schedule:</span> {result.waterRequirements.schedule}</p>
              
              <p className="font-medium mb-2">Sustainable Water Management:</p>
              <ul className="list-disc pl-5 space-y-1">
                {result.waterRequirements.sustainableMethods.map((method, index) => (
                  <li key={index}>{method}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="font-medium text-lg mb-3 text-green-800">Sustainable Farming Practices</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <ul className="list-disc pl-5 space-y-1">
                {result.sustainablePractices.map((practice, index) => (
                  <li key={index}>{practice}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              * Recommendations are based on your provided soil data and agricultural science. 
              For most accurate results, consider professional soil testing services.
            </p>
          </div>
        </div>
      )}
      
      <div className="mt-8 text-center">
        <Link href="/" className="text-green-600 hover:text-green-800 font-medium">
          Back to Home
        </Link>
      </div>
    </div>
  );
} 