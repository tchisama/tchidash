"use client";
import { db } from "@/firebase";
import { usePermission } from "@/hooks/use-permission";
import { useStore } from "@/store/storeInfos";
import { useQuery } from "@tanstack/react-query";
import {
  collection,
  getCountFromServer,
  query,
  where,
} from "firebase/firestore";
import { Clock, PhoneOff, Stars, Truck } from "lucide-react";

export default function StarsForOrders({
  setFilter,
  filter,
}: {
  filter: {
    status: string;
    search: string;
    searchBy: "Name" | "Number" | "Order ID";
  };
  setFilter: (filter: {
    status: string;
    search: string;
    searchBy: "Name" | "Number" | "Order ID";
  }) => void;
}) {
  const { storeId } = useStore();
  const { data } = useQuery({
    queryKey: ["Stars for orders", storeId],
    queryFn: async () => {
      if (!storeId) return null;

      const pendingOrders = query(
        collection(db, "orders"),
        where("storeId", "==", storeId),
        where("orderStatus", "==", "pending"),
      );
      const shippedOrders = query(
        collection(db, "orders"),
        where("storeId", "==", storeId),
        where("orderStatus", "==", "shipped"),
      );
      const noReplyOrders = query(
        collection(db, "orders"),
        where("storeId", "==", storeId),
        where("orderStatus", "==", "no_reply"),
      );
      const scheduledOrders = query(
        collection(db, "orders"),
        where("storeId", "==", storeId),
        where("orderStatus", "==", "scheduled"),
      );

      const pendingOrdersCount = await getCountFromServer(pendingOrders).then(
        (r) => r.data().count,
      );
      const shippedOrdersCount = await getCountFromServer(shippedOrders).then(
        (r) => r.data().count,
      );
      const noReplyOrdersCount = await getCountFromServer(noReplyOrders).then(
        (r) => r.data().count,
      );
      const scheduledOrdersCount = await getCountFromServer(
        scheduledOrders,
      ).then((r) => r.data().count);

      return {
        pendingOrdersCount,
        shippedOrdersCount,
        noReplyOrdersCount,
        scheduledOrdersCount,
      };
    },
  });

  // Check if the user has view permission
  const hasViewPermission = usePermission();

  if (!hasViewPermission("employees", "update")) {
    return <div></div>;
  }

  const iconClassName = "h-5 w-5 text-gray-400";

  const stats = [
    {
      name: "Pending",
      status: "pending",
      value: data?.pendingOrdersCount || 0,
      icon: <Stars className={iconClassName} />,
    },
    {
      name: "Shipped",
      status: "shipped",
      value: data?.shippedOrdersCount || 0,
      icon: <Truck className={iconClassName} />,
    },
    {
      name: "No Reply",
      status: "no_reply",
      value: data?.noReplyOrdersCount || 0,
      icon: <PhoneOff className={iconClassName} />,
    },
    {
      name: "Scheduled",
      status: "scheduled",
      value: data?.scheduledOrdersCount || 0,
      icon: <Clock className={iconClassName} />,
    },
  ];

  return (
    <dl className="md:w-fit grid grid-cols-2 w-full md:flex  border rounded-2xl overflow-hidden gap-px bg-gray-900/5">
      {stats.map((stat) =>
        stat.value === 0 ? null : (
          <button
            key={stat.name}
            onClick={() => {
              setFilter({
                ...filter,
                status: stat.status,
              });
            }}
            className="flex items-center hover:bg-primary-foreground  flex-wrap relative justify-between gap-x-4 gap-y-2 bg-white px-4 py-4 sm:px-6 xl:px-6"
          >
            <div className="flex gap-4">
              <div className="">{stat.icon}</div>
              <dt className="text-sm font-medium leading-6 text-gray-500">
                {stat.name}
              </dt>
            </div>
            <dd className="text-xl font-semibold leading-7 text-gray-900">
              {stat.value}
            </dd>
          </button>
        ),
      )}
    </dl>
  );
}
