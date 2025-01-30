"use client";
import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useOrderStore } from "@/store/orders";
import { cn } from "@/lib/utils";
import { and, collection, query, sum, where } from "firebase/firestore";
import { db } from "@/firebase";
import { startOfMonth, startOfWeek } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "@/store/storeInfos";
import { ArrowUpRightIcon } from "lucide-react";
import { dbGetAggregateFromServer } from "@/lib/dbFuntions/fbFuns";

function Analytic() {
  const { currentOrder } = useOrderStore();
  const { storeId, store } = useStore();
  const {
    data: thisWeekProfit,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["ThisWeekProfit"],
    queryFn: async () => {
      const q = query(
        collection(db, "orders"),
        and(
          where("storeId", "==", storeId),
          where("createdAt", ">=", startOfWeek(new Date())),
          where("orderStatus", "==", "delivered"),
        ),
      );
      if (!storeId) return;
      const querySnapshot = await dbGetAggregateFromServer(
        q,
        {
          totalProfit: sum("totalPrice"),
        },
        storeId,
        "",
      );
      return querySnapshot.data().totalProfit;
    },
  });

  const {
    data: lastWeekProfit,
    isLoading: isLoadingLastWeek,
    error: errorLastWeek,
  } = useQuery({
    queryKey: ["LastWeekProfit"],
    queryFn: async () => {
      const q = query(
        collection(db, "orders"),
        and(
          where("storeId", "==", storeId),
          where("createdAt", "<=", startOfWeek(new Date())),
          where(
            "createdAt",
            ">=",
            startOfWeek(new Date(new Date().setDate(new Date().getDate() - 7))),
          ),
          where("orderStatus", "==", "delivered"),
        ),
      );
      if (!storeId) return;
      const querySnapshot = await dbGetAggregateFromServer(
        q,
        {
          totalProfit: sum("totalPrice"),
        },
        storeId,
        "",
      );
      return querySnapshot.data().totalProfit;
    },
  });

  const {
    data: thisMonthProfit,
    isLoading: isLoadingThisMonth,
    error: errorThisMonth,
  } = useQuery({
    queryKey: ["ThisMonthProfit"],
    queryFn: async () => {
      const q = query(
        collection(db, "orders"),
        and(
          where("storeId", "==", storeId),
          where("createdAt", ">=", startOfMonth(new Date())),
          where("orderStatus", "==", "delivered"),
        ),
      );
      if (!storeId) return;
      const querySnapshot = await dbGetAggregateFromServer(
        q,
        {
          totalProfit: sum("totalPrice"),
        },
        storeId,
        "",
      );
      return querySnapshot.data().totalProfit;
    },
  });

  const { data: lastMonthProfit } = useQuery({
    queryKey: ["LastMonthProfit"],
    queryFn: async () => {
      const q = query(
        collection(db, "orders"),
        and(
          where("storeId", "==", storeId),
          where("createdAt", "<=", startOfMonth(new Date())),
          where(
            "createdAt",
            ">=",
            startOfMonth(
              new Date(new Date().setMonth(new Date().getMonth() - 1)),
            ),
          ),
          where("orderStatus", "==", "delivered"),
        ),
      );
      if (!storeId) return;
      const querySnapshot = await dbGetAggregateFromServer(
        q,
        {
          totalProfit: sum("totalPrice"),
        },
        storeId,
        "",
      );
      return querySnapshot.data().totalProfit;
    },
  });

  const [thisWeekProgress, setThisWeekProgress] = React.useState(0);
  useEffect(() => {
    if (thisWeekProfit && lastWeekProfit) {
      setThisWeekProgress(
        Math.round(
          ((thisWeekProfit as number) / (lastWeekProfit as number)) * 100,
        ),
      );
    }
  }, [thisWeekProfit, lastWeekProfit]);

  const [thisMonthProgress, setThisMonthProgress] = React.useState(0);
  useEffect(() => {
    if (thisMonthProfit && lastMonthProfit) {
      setThisMonthProgress(
        lastMonthProfit == 0
          ? 100
          : Math.round(
              ((thisMonthProfit as number) / (lastMonthProfit as number)) * 100,
            ),
      );
    }
  }, [thisMonthProfit, lastMonthProfit]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error{error.message}</div>;
  if (isLoadingLastWeek) return <div>Loading...</div>;
  if (errorLastWeek) return <div>Error{errorLastWeek.message}</div>;
  if (isLoadingThisMonth) return <div>Loading...</div>;
  if (errorThisMonth) return <div>Error{errorThisMonth.message}</div>;

  return (
    store && (
      <div
        className={cn(
          "grid gap-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4",
          currentOrder && "lg:grid-cols-3",
        )}
      >
        {thisWeekProfit && lastWeekProfit ? (
          <Card x-chunk="dashboard-05-chunk-1">
            <CardHeader className="pb-2">
              <CardDescription>This Week</CardDescription>
              <CardTitle
                className={cn(
                  "text-4xl flex items-end",
                  thisWeekProfit > lastWeekProfit && "text-primary",
                )}
              >
                {thisWeekProfit} Dh
                {thisWeekProfit > lastWeekProfit && (
                  <ArrowUpRightIcon className="w-8 h-8" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                {thisWeekProgress}% from last week
              </div>
            </CardContent>
            <CardFooter>
              <Progress
                value={Math.min(thisWeekProgress, 100)}
                aria-label="increase"
              />
            </CardFooter>
          </Card>
        ) : null}
        {thisMonthProfit && lastMonthProfit ? (
          <Card x-chunk="dashboard-05-chunk-2">
            <CardHeader className="pb-2">
              <CardDescription>This Month</CardDescription>
              <CardTitle
                className={cn(
                  "text-4xl flex items-end",
                  thisMonthProfit > lastMonthProfit && "text-primary",
                )}
              >
                {thisMonthProfit} Dh
                {thisMonthProfit > lastMonthProfit && (
                  <ArrowUpRightIcon className="w-8 h-8" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                {thisMonthProgress}% from last month
              </div>
            </CardContent>
            <CardFooter>
              <Progress
                value={Math.min(thisMonthProgress, 100)}
                aria-label="12% increase"
              />
            </CardFooter>
          </Card>
        ) : null}
      </div>
    )
  );
}

export default Analytic;
