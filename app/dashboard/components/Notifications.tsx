"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { db } from "@/firebase";
import { useStore } from "@/store/storeInfos";
import {   useQueryClient } from "@tanstack/react-query";
import { collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore";
import { Bell, BellIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import type { Notification as NotificationType } from "@/types/notification";
import Image from "next/image";
import { timeSince } from "@/lib/utils/functions/date";
import React, { useEffect } from "react";
import { markNotificationAsRead } from "@/lib/utils/functions/notifications";
import { usePermission } from "@/hooks/use-permission";


function Dot({ className }: { className?: string }) {
  return (
    <svg
      width="6"
      height="6"
      fill="currentColor"
      viewBox="0 0 6 6"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="3" cy="3" r="3" />
    </svg>
  );
}

function Notification() {
  const [unreadCount, setUnreadCount] = React.useState(0);
  const {storeId} = useStore();
  const {data:session} = useSession();
  const [numberOfNotifications, setNumberOfNotifications] = React.useState(8);


  const email = session?.user?.email;
  
  const queryClient = useQueryClient();
  const [notifications, setNotifications] = React.useState<NotificationType[] | undefined>(undefined);


useEffect(() => {
    if (!storeId) return;

    // Set up the real-time listener
    const q = query(
      collection(db, "notifications"),
      where("storeId", "==", storeId),
      orderBy("createdAt", "desc"),
      limit(numberOfNotifications)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as NotificationType[];

      // Update the React Query cache
      setNotifications(data);

      // Update unread count if email is provided
    });

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, [storeId, email, numberOfNotifications, queryClient]);


  useEffect(() => {
    if (!notifications) return;
    if (email) {
      const unreadCount = notifications.filter((notification) => !notification.seen?.includes(email)).length;
      setUnreadCount(unreadCount); // Assuming setUnreadCount is defined elsewhere
    }
  }, [notifications, email]);




  const handleMarkAllAsRead = () => {
    if (!email || !storeId) return;

    // mark all notifications as read in the backend
    notifications?.forEach((notification) => {
      if (!notification.seen.includes(email??"")) {
        markNotificationAsRead(notification.id, email??"");
      }
    });
  };

  const handleNotificationClick = (id: string) => {
    if (!email || !storeId) return;
    markNotificationAsRead(id, email); // Assuming markNotificationAsRead is defined elsewhere
  };

  const hasViewPermission = usePermission();

  if (!hasViewPermission("notifications", "view")) {
    return <div></div>;
  }


  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon"  variant="outline" className="relative w-10 h-10" aria-label="Open notifications">
          <Bell size={16} strokeWidth={2} aria-hidden="true" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 left-full min-w-5 -translate-x-1/2 px-1">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-1">
        <div className="flex items-baseline justify-between gap-4 px-3 py-2">
          <div className="text-sm font-semibold">Notifications</div>
          {unreadCount > 0 && (
            <button className="text-xs font-medium hover:underline" onClick={handleMarkAllAsRead}>
              Mark all as read
            </button>
          )}
        </div>
        <div
          role="separator"
          aria-orientation="horizontal"
          className="-mx-1 my-1 h-px bg-border"
        ></div>
        {
          notifications?.length === 0 && (
            <div className="flex flex-col gap-2 opacity-30">
              <BellIcon className="w-10 h-10 mx-auto mt-8" />
            <div className="text-center py-2">No notifications</div>
            </div>
          )
        }
        {
          false ? <div className="text-center py-2">Loading...</div>
          :
          notifications &&
        notifications.map((notification) => (
          <div
            key={notification.id}
            style={{
              opacity: notification.seen.includes(email ?? "") ? 0.7 : 1,
            }}
            className="rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
          >
            <div className="relative flex items-start gap-3 pe-3">
              <Image
                className="size-10 rounded-md bg-slate-100 border"
                src={notification.image}
                width={34}
                height={34}
                alt={""}
              />
              <div className="flex-1 space-y-1">
                <button
                  className="text-left text-foreground/80 after:absolute after:inset-0"
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <span className=" text-black hover:underline">
                    {notification.user}
                  </span>{" "}
                  <span className="font-medium text-black ">
                  {notification.action}{" "}
                  </span>

                  <span className=" text-slate-700 hover:underline">
                    {notification.target}
                  </span>
                  .
                </button>
                <div className="text-xs text-muted-foreground">{
                  // time passed from createdAt
                  timeSince(notification.createdAt.toDate(), new Date())
                  }</div>
              </div>
              {
                email &&
              !notification.seen.includes(email) && (
                <div className="absolute end-0 self-center">
                  <Dot />
                </div>
              )}
            </div>
          </div>
        ))}
        <div className="text-center py-2">
          {
            notifications && notifications.length > 0 &&
          <Button
            size="sm"
            variant="outline"
            onClick={() => setNumberOfNotifications((prev) => prev + 5)}
          >
            Load more
          </Button>
          }
        </div>
      </PopoverContent>
    </Popover>
  );
}

export { Notification };
