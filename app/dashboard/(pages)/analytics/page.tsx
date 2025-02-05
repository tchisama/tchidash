"use client";

import StarsComponent from "../../components/StarsComponent";
import MoroccanMap from "./components/MoroccanMap";
import { OrdersDonutChart } from "./components/OrdersDonutChart";
import OrdersGraph from "./components/OrdersGraph";

export default function page() {
  return (
    <div className="space-y-8 container mx-auto">
      <div>
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">Orders</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 w-full gap-3 ">
          <div className="md:col-span-4">
            <StarsComponent />
          </div>
          <div className="">
            <OrdersDonutChart />
          </div>
          <div className="md:col-span-3 flex">
            <OrdersGraph />
          </div>
          <div className="w-full md:col-span-3 ">
            <MoroccanMap />
          </div>
        </div>
      </div>
    </div>
  );
}
