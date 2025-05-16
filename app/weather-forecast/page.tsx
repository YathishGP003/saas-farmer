import AppLayout from "../components/AppLayout";
import WeatherPanel from "../components/WeatherPanel";

export default function WeatherForecastPage() {
  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
          Weather Forecast
        </h1>
        <div className="space-y-8">
          <WeatherPanel />
        </div>
      </div>
    </AppLayout>
  );
}
