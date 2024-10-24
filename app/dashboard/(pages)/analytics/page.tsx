"use client";

import { OrdersDonutChart } from "./components/OrdersDonutChart";
import OrdersGraph from "./components/OrdersGraph";
import UsageGraph from "./components/UsageGraph";

export default function page() {
  return (
    <div className="space-y-8 container mx-auto">
      <div>
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">Orders</h1>
        <div className="flex gap-4">
          <OrdersGraph />
          <OrdersDonutChart />
        </div>
      </div>
      <div>
        <h1 className="text-3xl font-semibold text-gray-800 mt-12 mb-4">
          Usage and Cost
        </h1>
        <div className="flex gap-4">
          <UsageGraph />
        </div>
      </div>
    </div>
  );
}
