"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { db } from "@/firebase";
import { useStore } from "@/store/storeInfos";
import {  useQuery, useQueryClient } from "@tanstack/react-query";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { Bell } from "lucide-react";
import { useSession } from "next-auth/react";
import type { Notification as NotificationType } from "@/types/notification";
import Image from "next/image";
import { timeSince } from "@/lib/utils/functions/date";
import React from "react";
import { markNotificationAsRead } from "@/lib/utils/functions/notifications";


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


  const email = session?.user?.email;
  
  const queryClient = useQueryClient();


  const {data: notifications, isLoading} = useQuery({
    queryKey:["notifications", storeId],
    queryFn: async () => {
      if (!storeId) return;
      const notifications = await getDocs(query(
        collection(db, "notifications"),
        where("storeId", "==", storeId),
        orderBy("createdAt", "desc"),
        limit(30)
      )).then((response) => {
        return response.docs.map((doc) => ({...doc.data(),id: doc.id}) as NotificationType);
      });
      if (!notifications) return [];
      if (!email) return notifications;
      setUnreadCount(
        notifications.filter((notification) => !notification.seen.includes(email)).length
      );
      // console.log(notifications);
      return notifications ?? [];
    }
  })

  const handleMarkAllAsRead = () => {
    if (!email || !storeId) return;

    // mark all notifications as read in the backend
    notifications?.forEach((notification) => {
      if (!notification.seen.includes(email)) {
        markNotificationAsRead(notification.id, email);
      }
    });
    // Mark all notifications as read
    queryClient.setQueryData(["notifications", storeId], (oldData: NotificationType[] | undefined) => {
      if (!oldData) return [];

      return oldData.map((notification) => ({
        ...notification,
        seen: [...(notification.seen ?? []), email], // Add email to the `seen` array
      }));
    });
    setUnreadCount(0);

    // Optionally, you can also update the backend to mark all notifications as read
    // await markAllNotificationsAsRead(storeId, email);
  };

  const handleNotificationClick = (id: string) => {
    if (!email || !storeId) return;

    // Mark the notification as read in the backend
    markNotificationAsRead(id, email); // Assuming markNotificationAsRead is defined elsewhere

    // Update the local cache
    queryClient.setQueryData(["notifications", storeId], (oldData: NotificationType[] | undefined) => {
      if (!oldData) return [];

      return oldData.map((notification) => {
        if (notification.id === id) {
          return {
            ...notification,
            seen: [...(notification.seen ?? []), email], // Add email to the `seen` array
          };
        }
        return notification;
      });
    });
    setUnreadCount((count) => count - 1);
  };



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
          isLoading ? <div className="text-center py-2">Loading...</div>
          :
          notifications &&
        notifications.map((notification) => (
          <div
            key={notification.id}
            className="rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
          >
            <div className="relative flex items-start gap-3 pe-3">
              <Image
                className="size-9 rounded-md"
                src={notification.image}
                width={32}
                height={32}
                alt={notification.user}
              />
              <div className="flex-1 space-y-1">
                <button
                  className="text-left text-foreground/80 after:absolute after:inset-0"
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <span className="font-medium text-foreground hover:underline">
                    {notification.user}
                  </span>{" "}
                  {notification.action}{" "}
                  <span className="font-medium text-foreground hover:underline">
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
      </PopoverContent>
    </Popover>
  );
}

export { Notification };
