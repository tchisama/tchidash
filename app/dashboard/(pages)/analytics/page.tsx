"use client";

import MoroccanMap from "./components/MoroccanMap";
import { OrdersDonutChart } from "./components/OrdersDonutChart";
import OrdersGraph from "./components/OrdersGraph";
import UsageGraph from "./components/UsageGraph";

export default function page() {
  return (
    <div className="space-y-8 container mx-auto">
      <div>
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">Orders</h1>
        <div className="grid grid-cols-4 w-full gap-3 ">
          <div className="w-full">
            <OrdersDonutChart />
          </div>
          <div className="col-span-3 flex">
            <OrdersGraph />
          </div>
          <div className="w-full col-span-2">
            <MoroccanMap />
          </div>
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
