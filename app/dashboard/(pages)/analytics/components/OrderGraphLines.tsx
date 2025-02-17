"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { collection, query, where, Timestamp } from "firebase/firestore";
import { db } from "@/firebase";
import { dbGetDocs } from "@/lib/dbFuntions/fbFuns";

import { Button } from "@/components/ui/button";

import {
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarHeading,
  RangeCalendar,
} from "@/components/ui/range-calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useStore } from "@/store/storeInfos";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const chartConfig = {
  delivered: {
    label: "Delivered",
    color: "hsl(var(--chart-1))",
  },
  returned: {
    label: "Returned",
    color: "hsl(var(--chart-2))",
  },
  canceled: {
    label: "Canceled",
    color: "hsl(var(--chart-3))",
  },
  fake: {
    label: "Fake",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

function OrdersGraph() {
  const [startDate, setStartDate] = React.useState<Date>(
    new Date(new Date().setDate(new Date().getDate() - 15)),
  );
  const [endDate, setEndDate] = React.useState<Date>(new Date());
  const { storeId } = useStore();

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const { data: chartData } = useQuery({
    queryKey: ["orders-chart", storeId, startDate, endDate],
    queryFn: async () => {
      const q = query(
        collection(db, "orders"),
        where("storeId", "==", storeId),
        where("createdAt", ">=", Timestamp.fromDate(startDate)),
        where("createdAt", "<=", Timestamp.fromDate(endDate)),
      );
      if (!storeId) return;
      const querySnapshot = await dbGetDocs(q, storeId, "");
      const ordersData: {
        [key: string]: {
          delivered: number;
          returned: number;
          canceled: number;
          fake: number;
        };
      } = {};

      querySnapshot.forEach((doc) => {
        const orderDate = formatDate(doc.data().createdAt.toDate());
        const status = doc.data().status; // Assuming each order has a "status" field

        if (!ordersData.hasOwnProperty(orderDate)) {
          ordersData[orderDate] = {
            delivered: 0,
            returned: 0,
            canceled: 0,
            fake: 0,
          };
        }

        switch (status) {
          case "delivered":
            ordersData[orderDate].delivered += 1;
            break;
          case "returned":
            ordersData[orderDate].returned += 1;
            break;
          case "canceled":
            ordersData[orderDate].canceled += 1;
            break;
          case "fake":
            ordersData[orderDate].fake += 1;
            break;
          default:
            break;
        }
      });

      const completeData = [];
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const formattedDate = formatDate(currentDate);
        completeData.push({
          date: formattedDate,
          delivered: ordersData[formattedDate]?.delivered || 0,
          returned: ordersData[formattedDate]?.returned || 0,
          canceled: ordersData[formattedDate]?.canceled || 0,
          fake: ordersData[formattedDate]?.fake || 0,
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return completeData;
    },
  });

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Orders Over Time</CardTitle>
          <CardDescription>
            Showing orders by status for the selected date range
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn("w-[280px] justify-start text-left font-normal")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(startDate, "MMM d, yyyy")} -{" "}
                {format(endDate, "MMM d, yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <RangeCalendar
                aria-label="Trip dates"
                className="bg-background rounded-lg px-2 py-3 border"
                onChange={(date: {
                  start: {
                    year: number;
                    month: number;
                    day: number;
                  };
                  end: {
                    year: number;
                    month: number;
                    day: number;
                  };
                }) => {
                  setStartDate(
                    new Date(date.start.year, date.start.month, date.start.day),
                  );
                  setEndDate(
                    new Date(date.end.year, date.end.month, date.end.day),
                  );
                }}
              >
                <CalendarHeading />
                <CalendarGrid>
                  <CalendarGridHeader>
                    {(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
                  </CalendarGridHeader>
                  <CalendarGridBody>
                    {(date) => <CalendarCell date={date} />}
                  </CalendarGridBody>
                </CalendarGrid>
              </RangeCalendar>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData || []}>
            <defs>
              <linearGradient id="fillDelivered" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--chart-1))"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--chart-1))"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillReturned" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--chart-2))"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--chart-2))"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillCanceled" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--chart-3))"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--chart-3))"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillFake" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--chart-4))"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--chart-4))"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="delivered"
              type="natural"
              fill="url(#fillDelivered)"
              stroke="hsl(var(--chart-1))"
            />
            <Area
              dataKey="returned"
              type="natural"
              fill="url(#fillReturned)"
              stroke="hsl(var(--chart-2))"
            />
            <Area
              dataKey="canceled"
              type="natural"
              fill="url(#fillCanceled)"
              stroke="hsl(var(--chart-3))"
            />
            <Area
              dataKey="fake"
              type="natural"
              fill="url(#fillFake)"
              stroke="hsl(var(--chart-4))"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default OrdersGraph;
