"use client";
import React from "react";
import { useDialogs } from "@/store/dialogs";
import { dbAddDoc, dbDeleteDoc } from "@/lib/dbFuntions/fbFuns";
import { db } from "@/firebase";
import { collection, doc, Timestamp, updateDoc } from "firebase/firestore";
import {
  Bike,
  MoreVertical,
  Phone,
  ScrollIcon,
  Trash2,
  TruckIcon,
  Edit,
  Stars,
  Copy,
  Ticket,
  ArrowUpRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/storeInfos";
import { IconBrandWhatsapp } from "@tabler/icons-react";

import { useSession } from "next-auth/react";
import useRenderWhatsappMessage from "@/lib/utils/functions/renderWhatsappMessage";
import { Order } from "@/types/order";
import { useRouter } from "next/navigation";
import DigylogDialog from "./DigylogDialog";
import OrderToImage from "./OrderToImage";
import axios from "axios";
import { useOrderStore } from "@/store/orders";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Note } from "./OrderNotes";
import useNotification from "@/hooks/useNotification";
import { useIntegrations } from "@/hooks/use-integrations";

type Props = {
  currentOrder: Order;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost";
};

function OrderActions({ currentOrder, variant }: Props) {
  const { store, storeId } = useStore();
  const { setSelectedOrder, orders, setOrders } = useOrderStore();

  const { sendNotification } = useNotification();
  const { data: session } = useSession();
  const { setDigylogOpen, setOrderToImageOpen } = useDialogs();
  const renderMessage = useRenderWhatsappMessage({
    currentOrder: currentOrder as Order,
  });
  const router = useRouter();

  const deleteOrder = async (orderId: string) => {
    if (!currentOrder) return;
    if (
      ["cancelled", "returned", "pending"].includes(currentOrder.orderStatus)
    ) {
      if (!storeId) return;

      dbDeleteDoc(doc(db, "orders", orderId), storeId, "");
      dbDeleteDoc(doc(db, "sales", orderId), storeId, "");
      sendNotification(`deleted 🗑️`, `order #${currentOrder.sequence}`);
      return;
    } else {
      alert("You can't delete an order that is not cancelled or returned");
    }
  };
  const integrations = useIntegrations();

  const handleDownloadLabel = async () => {
    try {
      // Make a GET or POST request to the API endpoint
      const response = await axios.post(
        "/api/integrations/digylog/labels",
        {
          orders: [currentOrder?.shippingInfo.trackingNumber],
          format: 1,
          storeId: storeId,
        },
        {
          responseType: "blob", // Important: Set the response type to 'blob' for file downloads
        },
      );

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a temporary anchor element to trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "labels.pdf"); // Set the file name
      document.body.appendChild(link);

      // Trigger the download
      link.click();

      // Clean up
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading labels:", error);
      alert("Failed to download labels. Please try again.");
    }
  };

  return (
    <div className="inline-block">
      <DigylogDialog currentOrder={currentOrder} />
      <OrderToImage currentOrder={currentOrder} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant={variant ?? "outline"}
            className="h-8 w-8"
          >
            <MoreVertical className="h-3.5 w-3.5" />
            <span className="sr-only">More</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px] shadow-xl">
          <DropdownMenuItem
            onClick={() => {
              window.open(`/dashboard/orders/${currentOrder?.sequence}`);
            }}
          >
            <ArrowUpRight className="h-3.5 w-3.5 mr-2" />
            Open in New Tab
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              const whatsappConfirmMessage = store?.whatsappConfirmationMessage;
              if (!whatsappConfirmMessage) return;
              if (!storeId) return;
              if (!session) return;
              if (!currentOrder) return;
              sendNotification(
                `Sent whatsapp confirmation 💬`,
                `of order:#${currentOrder?.sequence}`,
              );
              dbAddDoc(
                collection(db, "notes"),
                {
                  creator: session.user?.email ?? "",
                  content: "Sent Whatsapp Confirmation 💬",
                  createdAt: Timestamp.now(),
                  details: {
                    for: "order",
                    orderId: currentOrder.id,
                  },
                } as Note,
                currentOrder.storeId,
                "",
              );

              const message = renderMessage(whatsappConfirmMessage);
              window.open(
                `https://wa.me/212${currentOrder?.customer?.phoneNumber}?text=${encodeURIComponent(
                  message,
                )}`,
              );
            }}
          >
            <IconBrandWhatsapp className="h-3.5 w-3.5 mr-2" />
            Confirm Order
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              const askForReview = store?.AskReviewMessage;
              if (!askForReview) return;
              if (!storeId) return;
              if (!session) return;
              sendNotification(
                `Sent Ask for review message 💬`,
                `of order:#${currentOrder?.sequence}`,
              );
              const message = renderMessage(askForReview);
              window.open(
                `https://wa.me/212${currentOrder?.customer?.phoneNumber}?text=${encodeURIComponent(
                  message,
                )}`,
              );
            }}
          >
            <Stars className="h-3.5 w-3.5 mr-2" />
            Ask for Review
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              {currentOrder?.assignedTo ? (
                <Avatar className="w-6 h-6 mr-2">
                  <AvatarImage
                    src={
                      store?.employees?.find(
                        (employee) =>
                          employee.email === currentOrder?.assignedTo,
                      )?.imageUrl
                    }
                  />
                </Avatar>
              ) : null}
              Assigned to{" "}
              {store?.employees?.find(
                (employee) => employee.email === currentOrder?.assignedTo,
              )?.name ?? "no one"}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {store?.employees?.map((employee) => (
                <DropdownMenuItem
                  key={employee.id}
                  onClick={() => {
                    if (!currentOrder) return;
                    if (!storeId) return;
                    updateDoc(doc(db, "orders", currentOrder.id), {
                      assignedTo: employee.email,
                    });
                    setOrders(
                      orders.map((order) =>
                        order.id === currentOrder.id
                          ? { ...order, assignedTo: employee.email }
                          : order,
                      ),
                    );

                    sendNotification(
                      `assigned 📌`,
                      `order #${currentOrder.sequence} to ${employee.name}`,
                    );
                  }}
                >
                  <Avatar className="w-6 h-6 mr-2">
                    <AvatarImage src={employee.imageUrl} alt={employee.name} />
                  </Avatar>
                  {employee.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              if (confirm("Are you sure you want to delete this order?")) {
                if (!currentOrder) return;
                if (!storeId) return;
                if (!store) return;
                const duplicateOrder = {
                  ...currentOrder,
                  sequence: store?.sequences?.orders ?? 0,
                  orderStatus: "pending",
                } as Order;
                axios
                  .post("/api/orders?storeId=" + storeId, duplicateOrder)
                  .then(() => {
                    window.location.reload();
                  });
              }
            }}
          >
            <Copy className="h-3.5 w-3.5 mr-2" />
            Duplicate Order
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setSelectedOrder([currentOrder?.id]);
              router.push("/dashboard/tickets");
            }}
          >
            <Ticket className="h-3.5 w-3.5 mr-2" />
            Get Ticket
          </DropdownMenuItem>
          {integrations("digylog")?.enabled &&
            currentOrder?.shippingInfo?.trackingNumber && (
              <DropdownMenuItem
                onClick={() => {
                  handleDownloadLabel();
                }}
              >
                {" "}
                <Ticket className="h-3.5 w-3.5 mr-2" />
                Digylog Label{" "}
              </DropdownMenuItem>
            )}

          <DropdownMenuItem
            onClick={() => {
              router.push(`/dashboard/orders/edit/${currentOrder?.sequence}`);
            }}
          >
            <Edit className="h-3.5 w-3.5 mr-2" />
            Edit Order
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              window.open(`tel:+212${currentOrder?.customer?.phoneNumber}`);
            }}
          >
            <Phone className="h-3.5 w-3.5 mr-2" />
            Call Customer
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setOrderToImageOpen(true);
            }}
          >
            <ScrollIcon className="h-3.5 w-3.5 mr-2" />
            Get Order Receipt
          </DropdownMenuItem>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <TruckIcon className="h-3.5 w-3.5 mr-2" />
              Shipping Options
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>
                  <Bike className="h-3.5 w-3.5 mr-2" />
                  Manual
                </DropdownMenuItem>
                {store?.integrations?.find((i) => i.name === "digylog")
                  ?.enabled && (
                  <DropdownMenuItem onClick={() => setDigylogOpen(true)}>
                    <div className="flex items-center">
                      <TruckIcon className="h-3.5 w-3.5 mr-2" />
                      Digylog
                    </div>
                  </DropdownMenuItem>
                )}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-500 bg-red-50"
            onClick={() => {
              deleteOrder(currentOrder.id);
            }}
          >
            <Trash2 className="h-3.5 w-3.5 mr-2" />
            Trash
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default OrderActions;
