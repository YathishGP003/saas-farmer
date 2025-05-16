"use client";

import { useState, useEffect, useRef } from "react";
import { WeatherAdvice } from "@/types/dashboard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

// Weather icon mapping based on condition
const weatherIcons: Record<string, string> = {
  Clear: "☀️",
  "Partly Cloudy": "⛅",
  Cloudy: "☁️",
  Rain: "🌧️",
  "Light Rain": "🌦️",
  "Heavy Rain": "⛈️",
  Thunderstorm: "🌩️",
  Snow: "❄️",
  Fog: "��️",
  Windy: "💨",
  Clouds: "☁️",
  Mist: "🌫️",
  Haze: "🌫️",
  Drizzle: "🌦️",
};

const weatherApi = {
  key: "4eb3703790b356562054106543b748b2",
  baseUrl: "https://api.openweathermap.org/data/2.5",
};

export default function WeatherPanel() {
  const [weatherData, setWeatherData] = useState<WeatherAdvice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // User location inputs
  const [location, setLocation] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [usingCurrentLocation, setUsingCurrentLocation] = useState(false);
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Sample location data for search suggestions - in a real app, this would come from an API
  const locationOptions = [
    "Bangalore",
    "Chennai",
    "Davangere",
    "Hyderabad",
    "Mumbai",
    "Delhi",
    "Kolkata",
    "Pune",
    "Jaipur",
    "Ahmedabad",
    "Mysore",
    "Shimla",
    "Goa",
    "Kochi",
    "Chandigarh",
    "Lucknow",
    "Indore",
    "Bhopal",
    "Patna",
    "Agra",
    "Surat",
    "Kanpur",
    "Nagpur",
  ];

  // Handle search input change
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);

    if (value.length > 1) {
      const results = locationOptions.filter((loc) =>
        loc.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(results);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  // Handle location selection
  const handleLocationSelect = (selectedLocation: string) => {
    setSearchInput(selectedLocation);
    setShowResults(false);
  };

  // Search weather for the entered location
  const handleSearch = () => {
    if (searchInput.trim()) {
      setLocation(searchInput.toLowerCase());
      setUsingCurrentLocation(false);
      setCoordinates(null);
    }
  };

  // Get user's current location
  const getUserLocation = () => {
    setLoading(true);
    setUsingCurrentLocation(true);
    setSearchInput("");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };
          setCoordinates(coords);
          setLocation("");
          fetchWeatherAdvice(undefined, coords);
        },
        (error) => {
          console.error("Error getting location:", error);
          setError(
            "Failed to get your location. Please try selecting a city instead."
          );
          setUsingCurrentLocation(false);
          setLoading(false);
        }
      );
    } else {
      setError(
        "Geolocation is not supported by your browser. Please try selecting a city instead."
      );
      setUsingCurrentLocation(false);
      setLoading(false);
    }
  };

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Set a default location if none is selected
    if (!location && !coordinates) {
      setLocation("bangalore");
      setSearchInput("Bangalore");
    }
  }, []);

  useEffect(() => {
    if (location && !usingCurrentLocation) {
      fetchWeatherAdvice(location);
    }
  }, [location]);

  const fetchWeatherAdvice = async (
    locationName?: string,
    coords?: { lat: number; lon: number }
  ) => {
    try {
      setLoading(true);

      // Fetch current weather
      const weatherUrl = coords
        ? `${weatherApi.baseUrl}/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${weatherApi.key}&units=metric`
        : `${weatherApi.baseUrl}/weather?q=${locationName}&appid=${weatherApi.key}&units=metric`;

      const weatherResponse = await fetch(weatherUrl);
      if (!weatherResponse.ok) {
        throw new Error("Failed to fetch weather data");
      }
      const weatherData = await weatherResponse.json();

      // Fetch 5-day forecast
      const forecastUrl = coords
        ? `${weatherApi.baseUrl}/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${weatherApi.key}&units=metric`
        : `${weatherApi.baseUrl}/forecast?q=${locationName}&appid=${weatherApi.key}&units=metric`;

      const forecastResponse = await fetch(forecastUrl);
      if (!forecastResponse.ok) {
        throw new Error("Failed to fetch forecast data");
      }
      const forecastData = await forecastResponse.json();

      // Process current weather data
      const currentWeather = {
        temp: Math.round(weatherData.main.temp),
        condition: weatherData.weather[0].main,
        humidity: weatherData.main.humidity,
        windSpeed: weatherData.wind.speed,
        rainfall: weatherData.rain ? weatherData.rain["1h"] || 0 : 0,
        timestamp: new Date().toISOString(),
        feelsLike: Math.round(weatherData.main.feels_like),
        pressure: weatherData.main.pressure,
      };

      // Process forecast data
      const forecast = forecastData.list
        .filter((item: any, index: number) => index % 8 === 0) // Get one reading per day
        .slice(0, 7) // Get 7 days
        .map((item: any) => ({
          date: item.dt_txt,
          tempHigh: Math.round(item.main.temp_max),
          tempLow: Math.round(item.main.temp_min),
          condition: item.weather[0].main,
          rainProbability: item.pop * 100,
          rainfall: item.rain ? item.rain["3h"] || 0 : 0,
          humidity: item.main.humidity,
        }));

      // Generate farming advice based on weather conditions
      const advice = generateFarmingAdvice(currentWeather, forecast);

      setWeatherData({
        currentWeather,
        forecast,
        advice,
        location: weatherData.name,
        crop: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Function to generate farming advice based on weather conditions
  const generateFarmingAdvice = (currentWeather: any, forecast: any[]) => {
    const recommendations = [];

    // Temperature-based advice
    if (currentWeather.temp > 30) {
      recommendations.push(
        "High temperatures detected. Ensure adequate water supply and consider shade for sensitive crops."
      );
    } else if (currentWeather.temp < 15) {
      recommendations.push(
        "Low temperatures expected. Protect sensitive crops with covers during nighttime."
      );
    }

    // Rainfall-based advice
    const hasRain = forecast.some((day) => day.rainProbability > 60);
    if (hasRain) {
      recommendations.push(
        "Heavy rainfall expected. Consider covering crops to prevent soil erosion."
      );
    } else if (currentWeather.humidity < 40) {
      recommendations.push(
        "Low humidity conditions. Increase irrigation frequency."
      );
    }

    // General recommendations
    if (currentWeather.humidity > 80) {
      recommendations.push(
        "High humidity may promote fungal diseases. Ensure good air circulation between plants."
      );
    }

    if (currentWeather.windSpeed > 20) {
      recommendations.push(
        "Strong winds expected. Consider supporting tall plants and protecting delicate crops."
      );
    }

    return recommendations.join(" ");
  };

  // Format date for forecast display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.toLocaleDateString([], { weekday: "short" }),
      date: date.toLocaleDateString([], { month: "short", day: "numeric" }),
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 text-gray-800 font-medium text-lg min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-2"></div>
        <span className="ml-3">Loading weather data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-8 text-red-600 font-medium text-lg min-h-[200px]">
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p>Error: {error}</p>
          <button
            className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 border border-gray-200">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">
        Weather & Farming Insights
      </h2>

      {/* Location Search */}
      <div className="mb-6">
        <label className="block text-sm font-bold text-gray-700 mb-1">
          Location
        </label>
        <div className="flex flex-col sm:flex-row gap-2" ref={searchRef}>
          <div className="relative flex-grow">
            <input
              type="text"
              className="w-full border-2 border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-800"
              placeholder="Search for a location..."
              value={searchInput}
              onChange={handleSearchInputChange}
              disabled={usingCurrentLocation}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />

            {/* Search results dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-green-50 cursor-pointer text-gray-800"
                    onClick={() => handleLocationSelect(result)}
                  >
                    {result}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium flex-shrink-0 min-w-[80px]"
            >
              Search
            </button>

            <button
              onClick={getUserLocation}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center justify-center font-medium flex-shrink-0 min-w-[40px]"
              title="Use my current location"
            >
              📍
            </button>
          </div>
        </div>

        {usingCurrentLocation && (
          <div className="mt-1 text-sm text-green-600 font-medium">
            Using your current location
          </div>
        )}

        {weatherData?.location && (
          <div className="mt-1 text-sm text-blue-600 font-medium">
            Showing weather for:{" "}
            <span className="font-bold">{weatherData.location}</span>
          </div>
        )}
      </div>

      {/* Weather Display */}
      {weatherData && (
        <div>
          {/* Current Weather & Forecast Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Current Weather Card */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 shadow-sm col-span-1">
              <h3 className="text-lg font-bold mb-3 text-blue-900">
                Current Weather
              </h3>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="text-4xl mb-2 font-bold flex items-center">
                    <span className="text-5xl mr-2">
                      {weatherIcons[weatherData.currentWeather.condition] ||
                        "🌡️"}
                    </span>
                    <span>{weatherData.currentWeather.temp}°C</span>
                  </div>
                  <div className="text-blue-800 font-medium">
                    {weatherData.currentWeather.condition}
                  </div>
                  <div className="text-sm text-blue-700 font-medium">
                    Feels like {weatherData.currentWeather.feelsLike}°C
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div className="flex items-center">
                    <span className="text-blue-800 mr-2">💧</span>
                    <span className="text-gray-800 font-medium">
                      {weatherData.currentWeather.humidity}%
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-blue-800 mr-2">💨</span>
                    <span className="text-gray-800 font-medium">
                      {weatherData.currentWeather.windSpeed} km/h
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-blue-800 mr-2">🌧️</span>
                    <span className="text-gray-800 font-medium">
                      {weatherData.currentWeather.rainfall} mm
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-blue-800 mr-2">📊</span>
                    <span className="text-gray-800 font-medium">
                      {weatherData.currentWeather.pressure} mb
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-700 mt-4">
                Last updated:{" "}
                {new Date(
                  weatherData.currentWeather.timestamp
                ).toLocaleString()}
              </div>
            </div>

            {/* 7-Day Forecast Card - Spans 2 columns on larger screens */}
            <div className="col-span-1 sm:col-span-1 lg:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold mb-3 text-gray-800">
                7-Day Forecast
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 overflow-x-auto">
                {weatherData.forecast.map((day, index) => {
                  const { day: weekday, date: formattedDate } = formatDate(
                    day.date
                  );
                  return (
                    <div
                      key={index}
                      className="bg-white p-2 rounded-md text-center border border-gray-200 shadow-sm flex flex-col items-center"
                    >
                      <div className="text-xs font-bold mb-1 text-gray-800">
                        {weekday}
                      </div>
                      <div className="text-xs text-gray-600 mb-1">
                        {formattedDate}
                      </div>
                      <div className="text-2xl mb-1">
                        {weatherIcons[day.condition] || "🌡️"}
                      </div>
                      <div className="text-xs font-medium mb-1 text-gray-800 max-w-full truncate">
                        {day.condition}
                      </div>
                      <div className="text-xs font-bold text-gray-800">
                        {day.tempHigh}° / {day.tempLow}°
                      </div>
                      <div className="text-xs text-gray-700 font-medium">
                        {Math.round(day.rainProbability)}% rain
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Farming Recommendations Card */}
          {weatherData.advice && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200 shadow-sm mb-6">
              <h3 className="text-lg font-bold mb-3 text-green-800">
                Farming Recommendations
              </h3>

              <div className="p-3 bg-white rounded-md border border-green-100">
                <p className="text-green-900 font-medium">
                  {weatherData.advice}
                </p>
              </div>
            </div>
          )}

          {/* Weather Dashboard with Charts */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold mb-3 text-gray-800">
              Weather Dashboard
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Temperature Chart */}
              <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                <h4 className="text-md font-bold mb-2 text-gray-800">
                  Temperature Trend
                </h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={weatherData.forecast.map((day) => ({
                        day: formatDate(day.date).day,
                        High: day.tempHigh,
                        Low: day.tempLow,
                      }))}
                      margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="High"
                        stroke="#FF5722"
                        activeDot={{ r: 8 }}
                      />
                      <Line type="monotone" dataKey="Low" stroke="#2196F3" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Rainfall & Humidity Chart */}
              <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                <h4 className="text-md font-bold mb-2 text-gray-800">
                  Rainfall & Humidity
                </h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={weatherData.forecast.map((day) => ({
                        day: formatDate(day.date).day,
                        Rainfall: day.rainfall || 0,
                        Humidity: day.humidity,
                      }))}
                      margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis
                        yAxisId="left"
                        orientation="left"
                        stroke="#82ca9d"
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="#8884d8"
                      />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="Rainfall" fill="#82ca9d" />
                      <Bar yAxisId="right" dataKey="Humidity" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
