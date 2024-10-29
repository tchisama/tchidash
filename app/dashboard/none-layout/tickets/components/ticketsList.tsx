"use client";
import { useOrderStore } from "@/store/orders";
import React from "react";
import OrderTicket from "./ticket";
import { Order } from "@/types/order";

function TicketList() {
  const { selectedOrder, orders } = useOrderStore();
  return (
    <div className="max-w-[2000px]  mx-auto">
      <div className="grid-cols-3  grid  " id="ticket-list">
        {selectedOrder.map((orderId) => {
          const order = orders.find((order) => order.id === orderId) as Order;
          if (!order) return null;
          return <OrderTicket key={orderId} order={order} />;
        })}
      </div>
    </div>
  );
}

export default TicketList;
