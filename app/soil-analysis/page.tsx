import AppLayout from "../components/AppLayout";
import SoilHealthPanel from "../components/SoilHealthPanel";

export default function SoilAnalysisPage() {
  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
          Soil Analysis
        </h1>
        <div className="space-y-8">
          <SoilHealthPanel />
        </div>
      </div>
    </AppLayout>
  );
}
