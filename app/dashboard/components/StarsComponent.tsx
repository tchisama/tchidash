"use client";
import { db } from "@/firebase";
import { useStore } from "@/store/storeInfos";
import { useQuery } from "@tanstack/react-query";
import { endOfDay } from "date-fns";
import {
  collection,
  count,
  getAggregateFromServer,
  query,
  sum,
  Timestamp,
  where,
} from "firebase/firestore";

function classNames(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function StarsComponent() {
  const { storeId } = useStore();
  const { data } = useQuery({
    queryKey: ["Stars", storeId],
    queryFn: async () => {
      if (!storeId) return null;

      const now = endOfDay(new Date()).getTime();
      const last30Days = Timestamp.fromDate(
        new Date(now - 30 * 24 * 60 * 60 * 1000),
      );
      const last7Days = Timestamp.fromDate(
        new Date(now - 7 * 24 * 60 * 60 * 1000),
      );
      const lastDay = Timestamp.fromDate(
        new Date(now - 1 * 24 * 60 * 60 * 1000),
      );

      // Queries
      const q30Days = query(
        collection(db, "orders"),
        where("storeId", "==", storeId),
        where("createdAt", ">", last30Days),
      );

      const q7Days = query(
        collection(db, "orders"),
        where("storeId", "==", storeId),
        where("createdAt", ">", last7Days),
      );

      const q1Day = query(
        collection(db, "orders"),
        where("storeId", "==", storeId),
        where("createdAt", ">", lastDay),
      );

      const qDelivered = query(
        collection(db, "orders"),
        where("storeId", "==", storeId),
        where("orderStatus", "==", "delivered"),
        where("createdAt", ">", last30Days),
      );

      // Fetch Aggregates
      const res30Days = await getAggregateFromServer(q30Days, {
        count: count(),
      });
      const res7Days = await getAggregateFromServer(q7Days, { count: count() });
      const res1Day = await getAggregateFromServer(q1Day, { count: count() });
      const resDelivered = await getAggregateFromServer(qDelivered, {
        count: count(),
      });
      const revenue = await getAggregateFromServer(q30Days, {
        sum: sum("totalPrice"),
      });

      // Calculate Averages
      const totalOrdersLast30Days = res30Days.data().count || 0;
      const totalOrdersLast7Days = res7Days.data().count || 0;
      const totalOrdersLastDay = res1Day.data().count || 0;
      const deliveredOrdersLast30Days = resDelivered.data().count || 0;

      const avgOrdersPerDay30 = totalOrdersLast30Days / 30;
      const avgOrdersPerDay7 = totalOrdersLast7Days / 7;

      const avgRevenuePerDay30 = revenue.data().sum / 30;
      const totalRevenue = revenue.data().sum;

      // Calculate % change from last week
      const percentageChange =
        avgOrdersPerDay7 > 0
          ? (
              ((avgOrdersPerDay30 - avgOrdersPerDay7) / avgOrdersPerDay7) *
              100
            ).toFixed(1)
          : "0";

      return {
        totalRevenue,
        avgRevenuePerDay30,
        totalOrdersLast30Days,
        totalOrdersLastDay,
        avgOrdersPerDay30,
        avgOrdersPerDay7,
        percentageChange,
        deliveredOrdersLast30Days,
      };
    },
  });

  const stats = [
    {
      name: "Total Revenue (Last 30 Days)",
      value: `${data?.totalRevenue.toLocaleString()} Dh`,
      change: `${Math.ceil(data?.avgRevenuePerDay30 ?? 0)} Dh / Day`,
      changeType: "positive",
    },
    {
      name: "Average Orders per Day",
      value: `${data?.avgOrdersPerDay30} Orders`,
      change: `${data?.percentageChange}% from last week`,
      changeType: Number(data?.percentageChange) >= 0 ? "positive" : "negative",
    },
    {
      name: "Total Orders (Last 30 Days)",
      value: `${data?.totalOrdersLast30Days} Orders`,
      change: `+ ${data?.totalOrdersLastDay} Today`,
      changeType: "positive",
    },
    {
      name: "Delivered Orders",
      value: `${data?.deliveredOrdersLast30Days} / ${data?.totalOrdersLast30Days}`,
      change: `Completion Rate: ${(
        ((data?.deliveredOrdersLast30Days ?? 0) /
          (data?.totalOrdersLast30Days ?? 1)) *
        100
      ).toFixed(1)}%`,
      changeType:
        ((data?.deliveredOrdersLast30Days ?? 0) /
          (data?.totalOrdersLast30Days ?? 1)) *
          100 >=
        50
          ? "positive"
          : "negative",
    },
  ];

  return (
    <dl className="mx-auto grid grid-cols-1 border rounded-2xl overflow-hidden gap-px bg-gray-900/5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8"
        >
          <dt className="text-sm font-medium leading-6 text-gray-500">
            {stat.name}
          </dt>
          <dd
            className={classNames(
              stat.changeType === "negative"
                ? "text-rose-600"
                : "text-gray-700",
              "text-xs font-medium",
            )}
          >
            {stat.change}
          </dd>
          <dd className="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900">
            {stat.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
