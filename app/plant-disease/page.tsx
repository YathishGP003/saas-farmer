"use client";

import { useState } from "react";
import Image from "next/image";

interface DiseaseData {
  name: string;
  cure: string;
  prevention: string;
}

export default function PlantDiseasePage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [diseaseData, setDiseaseData] = useState<DiseaseData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setDiseaseData(null);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedImage) {
      setError("Please select an image first");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append("image", selectedImage);
      
      const response = await fetch("/api/analyze-plant", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setDiseaseData(data);
    } catch (err) {
      setError(`Failed to analyze image: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Plant Disease Detection</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="imageInput"
            />
            <label 
              htmlFor="imageInput"
              className="cursor-pointer block"
            >
              {imagePreview ? (
                <div className="relative w-full h-64 mx-auto">
                  <Image 
                    src={imagePreview} 
                    alt="Selected plant" 
                    fill 
                    style={{ objectFit: "contain" }}
                    className="rounded-lg"
                  />
                </div>
              ) : (
                <div className="border-2 border-gray-300 border-dashed rounded-lg p-12">
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">Click to upload an image of a diseased plant</p>
                    <p className="mt-1 text-xs text-gray-500">PNG, JPG, JPEG up to 10MB</p>
                  </div>
                </div>
              )}
            </label>
          </div>
          
          <button 
            type="submit" 
            className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition duration-200"
            disabled={loading || !selectedImage}
          >
            {loading ? "Analyzing..." : "Analyze Plant Disease"}
          </button>
          
          {error && (
            <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
          )}
        </form>
        
        {diseaseData && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-green-800">Diagnosis Results</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800">Disease</h3>
                <p className="mt-1">{diseaseData.name}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-800">Cure</h3>
                <p className="mt-1">{diseaseData.cure}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-800">Prevention</h3>
                <p className="mt-1">{diseaseData.prevention}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 