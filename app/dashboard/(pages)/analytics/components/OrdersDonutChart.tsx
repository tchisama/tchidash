"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
import {
  collection,
  getCountFromServer,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useStore } from "@/store/storeInfos";
import { orderStatusValuesWithIcon } from "../../orders/components/StateChanger";

// Config for your chart colors
// const chartConfig = {
//   pending: {
//     label: "Pending",
//     color: "#534b52",
//   },
//   processing: {
//     label: "Processing",
//     color: "#3d348b",
//   },
//   shipped: {
//     label: "Shipped",
//     color: "#2667ff",
//   },
//   delivered: {
//     label: "Delivered",
//     color: "#43aa8b",
//   },
//   cancelled: {
//     label: "Cancelled",
//     color: "#f8961e",
//   },
//   returned: {
//     label: "Returned",
//     color: "#e63946",
//   },
// } satisfies ChartConfig;

const chartConfig: {
  [key: string]: {
    label: string;
    color: string;
  };
} = {};
orderStatusValuesWithIcon.forEach((status) => {
  chartConfig[status.name] = {
    label: status.name,
    color: status.color,
  };
});

type OrderStatus = keyof typeof chartConfig; // Type that matches the keys of chartConfig

export function OrdersDonutChart() {
  const { storeId } = useStore();

  // Query to fetch the data from Firestore
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["orders-donut-chart"],
    queryFn: async () => {
      const statuses: OrderStatus[] = Object.keys(chartConfig) as OrderStatus[];

      const statusQueries = statuses.map(async (status) => {
        const ordersQuery = query(
          collection(db, "orders"),
          where("orderStatus", "==", status),
          where("storeId", "==", storeId),
        );
        const countSnapshot = await getCountFromServer(ordersQuery);
        return {
          status,
          count: countSnapshot.data().count,
        };
      });

      const ordersCountByStatus = await Promise.all(statusQueries);
      return ordersCountByStatus;
    },
  });

  // If still loading, show a placeholder or loading spinner
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Transform the fetched data to match the structure needed by Recharts
  const chartData =
    ordersData &&
    ordersData.map((order) => {
      return {
        status: order.status,
        count: order.count,
        fill:
          chartConfig[order.status]?.color + "88" || "hsl(var(--chart-other))", // Now TypeScript knows status matches chartConfig keys
      };
    });

  // Total count of orders for the center of the donut chart
  const totalOrders = chartData
    ? chartData.reduce((acc, curr) => acc + curr.count, 0)
    : null;

  const deliveredOrders = chartData
    ? chartData.find((order) => order.status === "delivered")?.count || 0
    : 0;

  // Delivery rate: Delivered orders / Total orders
  const deliveryRate =
    totalOrders && deliveredOrders
      ? ((deliveredOrders / totalOrders) * 100).toFixed(2) + "%"
      : "0%";

  return (
    totalOrders && (
      <Card className="flex flex-col w-full md:h-full">
        <CardHeader className="items-center pb-0">
          <CardTitle>Order Status Donut Chart</CardTitle>
          <CardDescription>Order Status Overview</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[300px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="status"
                innerRadius={80}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalOrders.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Orders
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            Delivery Rate: {deliveryRate} <TrendingUp size={16} />
          </div>
          <div className="leading-none text-muted-foreground">
            Showing total orders for all statuses
          </div>
        </CardFooter>
      </Card>
    )
  );
}
