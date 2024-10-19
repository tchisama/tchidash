import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  Label,
  Rectangle,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useStore } from "@/store/storeInfos";
import { startOfDay } from "date-fns";

function OrdersGraph() {
  // start date is 30 days before
  const [startDate] = React.useState(
    new Date(new Date().setDate(startOfDay(new Date()).getDate() - 10)),
  );
  const [endDate] = React.useState(startOfDay(new Date()));
  const { storeId } = useStore();

  // Helper function to format dates as 'YYYY-MM-DD'
  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const { data: chartData, isLoading } = useQuery({
    queryKey: ["orders-chart", storeId],
    queryFn: async () => {
      const q = query(
        collection(db, "orders"),
        where("storeId", "==", storeId),
        where("createdAt", ">=", Timestamp.fromDate(startDate)),
        where("createdAt", "<=", Timestamp.fromDate(endDate)),
      );
      const querySnapshot = await getDocs(q);
      let ordersData: {
        [key: string]: number;
      } = {};

      querySnapshot.forEach((doc) => {
        const orderDate = formatDate(doc.data().createdAt.toDate());
        if (!ordersData.hasOwnProperty(orderDate)) {
          //ordersData[orderDate] = 0;
          ordersData = { ...ordersData, [orderDate]: 0 };
        }
        //ordersData[orderDate] += 1; // count the number of orders per day
        ordersData = {
          ...ordersData,
          [orderDate]: ordersData[orderDate] + 1,
        };
      });

      // Fill in the missing dates between startDate and endDate
      const completeData = [];
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const formattedDate = formatDate(currentDate);
        completeData.push({
          date: formattedDate,
          orders: ordersData[formattedDate] || 0, // use 0 if no data for the date
        });
        currentDate.setDate(currentDate.getDate() + 1); // move to the next day
      }

      return completeData;
    },
  });

  return (
    chartData && (
      <Card className="max-w-7xl" x-chunk="charts-01-chunk-0">
        <CardHeader className="space-y-0 pb-2">
          <CardDescription>Last {10} Days</CardDescription>
          <CardTitle className="text-4xl tabular-nums">
            {isLoading
              ? "Loading..."
              : chartData.reduce((acc, day) => acc + day.orders, 0)}{" "}
            <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
              orders
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            className="h-[300px] w-full"
            config={{
              steps: {
                label: "orders",
                color: "hsl(var(--chart-1))",
              },
            }}
          >
            <BarChart
              accessibilityLayer
              margin={{
                left: -4,
                right: -4,
              }}
              data={chartData || []}
            >
              <Bar
                dataKey="orders"
                fill="var(--color-steps)"
                radius={10}
                fillOpacity={0.6}
                activeBar={<Rectangle fillOpacity={0.8} />}
              />
              <XAxis
                dataKey="date"
                tickLine={true}
                axisLine={false}
                tickMargin={4}
                tickFormatter={(value) => {
                  return new Date(value).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                  });
                }}
              />
              <YAxis
                tickLine={true}
                axisLine={true}
                // i want to alignt it to the right
                orientation="right"
                width={25}
                tickMargin={4}
                tickFormatter={(value) => {
                  return value;
                }}
              />

              <ChartTooltip
                defaultIndex={2}
                content={
                  <ChartTooltipContent
                    hideIndicator
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      });
                    }}
                  />
                }
                cursor={false}
              />
              <ReferenceLine
                y={1200}
                stroke="hsl(var(--muted-foreground))"
                strokeDasharray="3 3"
                strokeWidth={1}
              >
                <Label
                  position="insideBottomLeft"
                  value="Average Steps"
                  offset={10}
                  fill="hsl(var(--foreground))"
                />
                <Label
                  position="insideTopLeft"
                  value="12,343"
                  className="text-lg"
                  fill="hsl(var(--foreground))"
                  offset={10}
                  startOffset={100}
                />
              </ReferenceLine>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    )
  );
}

export default OrdersGraph;
