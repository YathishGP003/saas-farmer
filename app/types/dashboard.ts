export interface CurrentWeather {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  rainfall: number;
  timestamp: string;
  feelsLike: number;
  pressure: number;
}

export interface ForecastDay {
  date: string;
  tempHigh: number;
  tempLow: number;
  condition: string;
  rainProbability: number;
  rainfall: number;
  humidity: number;
}

export interface WeatherAdvice {
  currentWeather: CurrentWeather;
  forecast: ForecastDay[];
  advice: string;
  location?: string;
  crop?: string;
}
