"use client";

import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig } from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
import { dbGetAggregateFromServer } from "@/lib/dbFuntions/fbFuns";
import { collection, query, sum, Timestamp, where } from "firebase/firestore";
import { db } from "@/firebase";
import { useStore } from "@/store/storeInfos";
import { endOfMonth, startOfMonth } from "date-fns";
import formatDataSize, {
  costFromUsageDownload,
  costFromUsageUpload,
} from "@/lib/formatDataSize";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export const description = "An interactive bar chart";

const chartConfig = {
  download: {
    label: "Download",
    color: "hsl(var(--chart-1))",
  },
  upload: {
    label: "Upload",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function UsageGraph() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("download");
  const [startDate] = React.useState(startOfMonth(new Date()));
  const [endDate] = React.useState(endOfMonth(new Date()));
  const { storeId, store } = useStore();

  const { data, error, isLoading } = useQuery({
    queryKey: ["usage-graph"],
    queryFn: async () => {
      const qDownload = query(
        collection(db, "usage"),
        where("storeId", "==", storeId),
        where("action", "==", "download"),
        where("createdAt", ">=", Timestamp.fromDate(startDate)),
        where("createdAt", "<=", Timestamp.fromDate(endDate)),
      );
      const qUpload = query(
        collection(db, "usage"),
        where("storeId", "==", storeId),
        where("action", "==", "upload"),
        where("createdAt", ">=", Timestamp.fromDate(startDate)),
        where("createdAt", "<=", Timestamp.fromDate(endDate)),
      );
      if (!storeId) return;
      const download = await dbGetAggregateFromServer(
        qDownload,
        {
          dataAmount: sum("dataAmount"),
        },
        storeId,
        "",
      );
      const upload = await dbGetAggregateFromServer(
        qUpload,
        {
          dataAmount: sum("dataAmount"),
        },
        storeId,
        "",
      );
      return {
        download: download.data().dataAmount,
        upload: upload.data().dataAmount,
      };
    },
  });

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className=" min-w-[800px]">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Data Usage</CardTitle>
          <CardDescription>
            Data Usage in this month for download and upload
          </CardDescription>
          <p className="font-bold text-3xl text-primary capitalize">
            {data &&
              (
                costFromUsageDownload(data.download) +
                costFromUsageUpload(data.upload)
              ).toFixed(3)}{" "}
            {store?.settings.currency.symbol}
          </p>
        </div>
        <div className="flex w-[400px]">
          {["download", "upload"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {data && formatDataSize(data[chart] ?? 0, 1)}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 flex flex-col gap-2 sm:p-6 w-full">
        <div>
          <h3 className="flex gap-1">
            {activeChart}ed Data
            {data &&
            data[activeChart ?? "download"] >
              data[activeChart === "download" ? "upload" : "download"] ? (
              <ArrowDownRight />
            ) : (
              <ArrowUpRight />
            )}
          </h3>
          <h1 className="text-6xl font-bold">
            {formatDataSize((data && data[activeChart ?? "download"]) ?? 0, 3)}
          </h1>
        </div>
        <div>
          <h3>Cost </h3>
          <h1 className="font-bold text-xl capitalize">
            {activeChart === "download"
              ? costFromUsageDownload(data?.download ?? 0).toFixed(3)
              : costFromUsageUpload(data?.upload ?? 0).toFixed(3)}{" "}
            {store && store.settings.currency.symbol}
          </h1>
        </div>
      </CardContent>
    </Card>
  );
}
