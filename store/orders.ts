import {create} from "zustand";
import { Order, OrderStatus } from "@/types/order";

// Define the Order type as before


// Define Zustand Store
interface OrderState {
  orders: Order[]; // List of all orders
  setOrders: (orders: Order[]) => void;
  currentOrder: Order | null; // The current order being worked on

  newOrder: Order | null;
  setNewOrder: (order: Order | null) => void;


  addOrder: (order: Order) => void; // Function to add a new order
  setCurrentOrder: (orderId: string) => void; // Set the current order by id
  updateOrderStatus: (orderId: string, status: OrderStatus) => void; // Update the status of an order
}

// Zustand store implementation
export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  setOrders: (orders: Order[]) => set({ orders }),
  currentOrder: null,

  newOrder:null,
  setNewOrder: (order: Order | null) => set({ newOrder: order }),

  // Add a new order to the store
  addOrder: (order: Order) => set((state) => ({ orders: [...state.orders, order] })),

  // Set the current order based on order ID
  setCurrentOrder: (orderId: string) =>
    set((state) => ({
      currentOrder: state.orders.find((order) => order.id === orderId) || null,
    })),

  // Update the status of a specific order
  updateOrderStatus: (orderId: string, status: OrderStatus) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId ? { ...order, orderStatus: status } : order
      ),
    })),
}));
