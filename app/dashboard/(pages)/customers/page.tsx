"use client";
import React, { useState } from "react";
import {
  collection,
  orderBy,
  query,
  where,
  limit,
  startAfter,
  getAggregateFromServer,
  count,
  sum,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useQuery } from "@tanstack/react-query";
import { Customer } from "@/types/customer";
import { useStore } from "@/store/storeInfos";
import { dbGetDocs } from "@/lib/dbFuntions/fbFuns";
import { usePermission } from "@/hooks/use-permission";
import { Button } from "@/components/ui/button";
import Avvvatars from "avvvatars-react";
import {
  DollarSign,
  MapPin,
  MapPinCheck,
  PhoneIcon,
  ShoppingBasket,
  X,
} from "lucide-react";
import { IconBrandWhatsapp } from "@tabler/icons-react";

const ITEMS_PER_PAGE = 25;

export default function CustomerPage() {
  const { storeId } = useStore();
  const [page, setPage] = useState(1);
  const [lastDoc, setLastDoc] = useState<null | unknown>(null);

  const {
    data: customers = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["customers", page],
    queryFn: async () => {
      if (!storeId) return [];
      let q = query(
        collection(db, "customers"),
        where("storeId", "==", storeId),
        orderBy("createdAt", "desc"),
        limit(ITEMS_PER_PAGE),
      );
      if (lastDoc) q = query(q, startAfter(lastDoc));
      const response = await dbGetDocs(q, storeId, "");
      setLastDoc(
        response.docs.length ? response.docs[response.docs.length - 1] : null,
      );
      return response.docs.map(
        (doc) => ({ ...doc.data(), id: doc.id }) as Customer,
      );
    },
    staleTime: 1 * 60 * 1000, // 10 minutes in milliseconds
    gcTime: 3 * 60 * 1000, // 15 minutes in milliseconds (should be longer than staleTime)
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const hasViewPermission = usePermission();
  if (!hasViewPermission("customers", "view")) {
    return <div>You don{"'"}t have permission to view this page</div>;
  }

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load customer data {error.message}.</p>;

  return (
    <div>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {customers.map((customer) => (
          <CustomerCard key={customer.id} customer={customer} />
        ))}
      </ul>
      <div className="flex justify-center mt-6 space-x-4">
        <Button
          variant="outline"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span className="text-gray-700">Page {page}</span>
        <Button
          variant="outline"
          onClick={() =>
            setPage((prev) =>
              customers.length < ITEMS_PER_PAGE ? prev : prev + 1,
            )
          }
          disabled={customers.length < ITEMS_PER_PAGE}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export function CustomerCardByNumber({
  number: phoneNumber,
}: {
  number: string;
}) {
  const { store } = useStore();
  const { data } = useQuery({
    queryKey: ["customer", phoneNumber],
    queryFn: async () => {
      if (!store) return null;
      const q = query(
        collection(db, "customers"),
        where("phoneNumber", "==", phoneNumber),
        where("storeId", "==", store.id),
      );
      const response = await dbGetDocs(q, store.id, "");
      return response.docs.map(
        (doc) => ({ ...doc.data(), id: doc.id }) as Customer,
      )[0];
    },
    staleTime: 1 * 60 * 1000, // 10 minutes in milliseconds
    gcTime: 3 * 60 * 1000, // 15 minutes in milliseconds (should be longer than staleTime)
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  if (!data) return null;
  return <CustomerCard customer={data} />;
}

export function CustomerCard({ customer }: { customer: Customer }) {
  const { data } = useQuery({
    queryKey: ["customer", customer.id],
    queryFn: async () => {
      const q = query(
        collection(db, "orders"),
        where("customer.phoneNumber", "==", customer.phoneNumber),
        where("storeId", "==", customer.storeId),
        where("orderStatus", "==", "delivered"),
      );
      const q2 = query(
        collection(db, "orders"),
        where("customer.phoneNumber", "==", customer.phoneNumber),
        where("storeId", "==", customer.storeId),
      );
      const q3 = query(
        collection(db, "orders"),
        where("customer.phoneNumber", "==", customer.phoneNumber),
        where("storeId", "==", customer.storeId),
        where("orderStatus", "in", [
          "returned",
          "cancelled",
          "fake",
          "no_reply",
        ]),
      );
      const response = await getAggregateFromServer(q, {
        count: count(),
        totalPrice: sum("totalPrice"),
      });
      const response2 = await getAggregateFromServer(q2, {
        count: count(),
        totalPrice: sum("totalPrice"),
      });
      const response3 = await getAggregateFromServer(q3, {
        count: count(),
        totalPrice: sum("totalPrice"),
      });
      return {
        totalOrders: response2.data().count,
        totalDelivered: response.data().count,
        totalPrice: response.data().totalPrice,
        totalCancelled: response3.data().count,
      };
    },

    staleTime: 10 * 60 * 1000, // 10 minutes in milliseconds
    gcTime: 15 * 60 * 1000, // 15 minutes in milliseconds (should be longer than staleTime)
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return (
    <li className="col-span-1 divide-y border divide-gray-200 rounded-lg bg-white shadow-sm">
      <div className="flex w-full items-center justify-between space-x-6 p-6">
        <Avvvatars
          value={String(customer.phoneNumber)}
          size={40}
          style="shape"
        />
        <div className="flex-1 truncate">
          <div className="flex items-center space-x-3">
            <h3 className="truncate text-sm font-medium text-gray-900">
              {customer.firstName} {customer.lastName}{" "}
            </h3>
          </div>
          {customer.phoneNumber && (
            <p className="mt-1 truncate text-sm text-gray-500">
              {customer.phoneNumber}
            </p>
          )}
        </div>
        <div>
          {data && (
            <div className="">
              <div className="flex justify-end gap-2">
                <div className="flex gap-2 items-center justify-end truncate text-sm text-gray-500">
                  <ShoppingBasket className="h-4 w-4" />
                  <p className="">{data.totalOrders}</p>
                </div>
                {data.totalDelivered > 0 && (
                  <>
                    <div className="h-4 border-l"></div>
                    <div className="flex gap-2 items-center  truncate text-sm text-primary">
                      <MapPinCheck className="h-4 w-4" />
                      <p className="">{data.totalDelivered}</p>
                    </div>
                  </>
                )}
                {data.totalCancelled > 0 && (
                  <>
                    <div className="h-4 border-l"></div>
                    <div className="flex gap-2 items-center  truncate text-sm text-red-500">
                      <X className="h-4 w-4" />
                      <p className="">{data.totalCancelled}</p>
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-2 items-center justify-end  mt-1">
                <DollarSign className="h-4 w-4" />
                <p className="">{data.totalPrice} Dh</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="px-3 p-2">
        <p className="mt-1 truncate  text-gray-700 flex items-center gap-1">
          <MapPin className="h-4 w-4 inline-block" /> {customer?.address?.city}
        </p>
        <p className="mt-1 truncate text-sm text-gray-500">
          {customer?.address?.street}
        </p>
      </div>
      <div>
        <div className="-mt-px flex divide-x divide-gray-200">
          <div className="flex w-0 flex-1">
            <a
              href={`https://wa.me/212${customer.phoneNumber}`}
              className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
            >
              <IconBrandWhatsapp
                aria-hidden="true"
                className="h-5 w-5 text-gray-400"
              />
              Open Chat
            </a>
          </div>
          <div className="-ml-px flex w-0 flex-1">
            <a
              href={`tel:${customer.phoneNumber}`}
              className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
            >
              <PhoneIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />
              Call
            </a>
          </div>
        </div>
      </div>
    </li>
  );
}
