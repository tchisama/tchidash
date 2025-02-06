"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useOrderStore } from "@/store/orders";
import { collection, orderBy, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { dbGetDocs } from "@/lib/dbFuntions/fbFuns";
import { Note } from "../../components/OrderNotes";
import { orderStatusValuesWithIcon } from "../../components/StateChanger";
import {  UserIcon } from '@heroicons/react/20/solid';
import { useStore } from "@/store/storeInfos";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { ArrowRight } from "lucide-react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function OrderTimeline() {
  const { currentOrder } = useOrderStore();
  const {store} = useStore()
  const { data: notes } = useQuery({
    queryKey: ["notes", currentOrder?.id],
    queryFn: async () => {
      if (!currentOrder) return [];
      const q = query(
        collection(db, "notes"),
        where("details.for", "==", "order"),
        where("details.orderId", "==", currentOrder?.id),
        orderBy("createdAt", "desc"),
      );
      const notes = await dbGetDocs(q, currentOrder.storeId, "");
      return notes.docs
        .map((doc) => ({ ...doc.data(), id: doc.id }) as Note)
        .filter((note) => note.changed);
    },
  });

  const timelineEvents = notes?.map((note) => ({
    id: note.id,
    content: note.changed,
    target: note.creator,
    date: note.createdAt.toDate().toLocaleDateString(),
    datetime: note.createdAt.toDate().toISOString(),
    icon: orderStatusValuesWithIcon.find((status) => status.name === note.changed)?.icon || UserIcon,
    iconBackground: orderStatusValuesWithIcon.find((status) => status.name === note.changed)?.color + "91",
  })) || [];

  if (currentOrder) {
    timelineEvents.push({
      id: 'order-created',
      content: 'New Order',
      target: currentOrder.customer?.name ,
      date: currentOrder.createdAt.toDate().toLocaleDateString(),
      datetime: currentOrder.createdAt.toDate().toISOString(),
      icon: orderStatusValuesWithIcon.find((status) => status.name === "pending")?.icon || UserIcon,
      iconBackground: orderStatusValuesWithIcon.find((status) => status.name === "pending")?.color + "91",
    });
  }

  return (
        <div className="flow-root mt-8">
          <ul role="list" className="-mb-8">
            {timelineEvents.map((event, eventIdx) => (
              <li key={event.id}>
                <div className="relative pb-8">
                  {eventIdx !== timelineEvents.length - 1 ? (
                    <span aria-hidden="true" className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span
                        style={{
                          backgroundColor: event.iconBackground
                        }}
                        className={classNames(
                          'flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white',
                        )}
                      >

                        {
                          event.icon as React.ReactElement
                        }
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                      <div>
                        <p className="text-sm flex flex-col  gap-1 text-gray-500">
                          <div className="flex gap-2">
                          <Avatar className="h-5 w-5 border">
                            <AvatarImage src={store?.employees?.find((employee) => employee.email === event.target)?.imageUrl ?? ""} />
                            <AvatarFallback className="text-xs">{store?.employees?.find((employee) => employee.email === event.target)?.name[0] ?? ""}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium flex items-center gap-2 text-gray-900">
                            {store?.employees?.find((employee) => employee.email === event.target)?.name ?? event.target}
                            <ArrowRight className="h-3 text-gray-600 w-3" />
                            {event.content}{' '}
                          </span>
                          </div>
                        </p>
                      </div>
                      <div className="whitespace-nowrap text-right text-sm text-gray-500">
                        <time dateTime={event.datetime}>{event.date}</time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
  );
}