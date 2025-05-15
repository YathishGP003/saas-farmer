"use client";

import React, { useState } from "react";
import Link from "next/link";
import { indianStates, agriculturalSeasons } from "@/utils/cropData";

export default function CropSuggestionPage() {
  const [timeRange, setTimeRange] = useState(3);
  const [state, setState] = useState("");
  const [plantingSeason, setPlantingSeason] = useState("");
  const [soilType, setSoilType] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    suggestedCrops: { name: string; rationale: string }[];
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/crop-suggestion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timeRange,
          state,
          plantingSeason,
          soilType
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get crop suggestions');
      }
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to get crop suggestions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const soilTypes = [
    "Clay",
    "Sandy",
    "Loamy",
    "Silt",
    "Black Cotton Soil",
    "Red Soil",
    "Alluvial Soil",
    "Laterite Soil",
    "Not Sure"
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Crop Suggestion Tool</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-green-700">How It Works</h2>
        <p className="mb-4">
          Our crop suggestion tool uses agricultural expertise and knowledge of climate conditions
          to recommend the most suitable and profitable crops for your region and timeline.
        </p>
        <ul className="list-disc pl-8 mb-6 space-y-2">
          <li>Location-specific recommendations based on climate</li>
          <li>Seasonal growing conditions consideration</li>
          <li>Planting-to-harvest timeline analysis</li>
          <li>Soil type compatibility</li>
          <li>Market potential assessment</li>
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
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="">Select your state</option>
                {indianStates.map((stateName) => (
                  <option key={stateName} value={stateName}>
                    {stateName}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Planting Season
              </label>
              <select
                value={plantingSeason}
                onChange={(e) => setPlantingSeason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="">Select planting season</option>
                {agriculturalSeasons.map((season) => (
                  <option key={season} value={season}>
                    {season}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Soil Type
              </label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="">Select soil type</option>
                {soilTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                When do you want to harvest? (in months)
              </label>
              <input 
                type="range" 
                min="1" 
                max="24" 
                value={timeRange} 
                onChange={(e) => setTimeRange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>1 month</span>
                <span>{timeRange} months</span>
                <span>24 months</span>
              </div>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="w-full mt-6 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? 'Getting Suggestions...' : 'Get Crop Suggestions'}
          </button>
        </form>
      </div>
      
      {result && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-green-700">Recommendations</h2>
          
          {result.message && (
            <div className="mb-6 text-gray-700">
              <p>{result.message}</p>
            </div>
          )}
          
          <div className="space-y-6">
            {result.suggestedCrops.map((crop, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-lg mb-2 text-green-800">{index + 1}. {crop.name}</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="whitespace-pre-line">{crop.rationale}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              * Recommendations based on agricultural expertise and growing conditions. 
              Actual results may vary based on local conditions, weather patterns, and management practices.
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