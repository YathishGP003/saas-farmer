"use client";

import { useState } from "react";
import AppLayout from "../components/AppLayout";
import CommodityPriceVisualization from "../components/CommodityPriceVisualization";

export default function MarketPricesPage() {
  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
          Market Prices
        </h1>

        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4 text-green-700">
              Agricultural Commodity Prices
            </h2>
            <p className="mb-6 text-gray-800">
              Track current market prices for key agricultural commodities. This
              data helps farmers make informed decisions about what crops to
              grow and when to sell their harvest for maximum profit.
            </p>

            <CommodityPriceVisualization />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
