import axios from "axios";

// Constants
const ORDER_API_URL = "/api/orders";

interface ApiPayload {
  customer: {
    firstName: string;
    lastName: string;
    name: string;
    phoneNumber: string;
    shippingAddress: {
      address: string;
      city: string;
    };
  };
  note?: {
    creator: string;
    creatorId: string;
    content: string;
  };
  orderStatus: string;
  items: ApiOrderItem[];
  shippingInfo: {
    cost: number;
  };
  storeId: string;
  createdAt: Date;
}

// API Types
interface ApiOrderItem {
  productId: string;
  variantId: string;
  quantity: number;
  title: string;
  price: number;
  totalPrice: number;
  imageUrl: string;
}

export interface OrderDetails {
  firstName: string;
  lastName: string;
  number: string;
  address: string;
  city: string;
  note?: string;
  userType?: "default" | "specific";
  cartItems: {
    productId: string;
    variantId: string;
    name: string;
    variantInfo?: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  cartTotal: number;
}

export const createOrder = async (
  orderDetails: OrderDetails,
  STORE_ID: string,
): Promise<unknown> => {
  console.log("Preparing order payload:", orderDetails);

  if (!STORE_ID) {
    console.error("Store ID is not configured!");
    throw new Error("Store configuration error.");
  }
  if (!ORDER_API_URL) {
    console.error("Order API URL is not configured!");
    throw new Error("API configuration error.");
  }

  // Map Cart Items to API Structure
  const apiOrderItems: ApiOrderItem[] = orderDetails.cartItems.map((item) => ({
    productId: item.productId,
    variantId: item.variantId,
    quantity: item.quantity,
    title: `${item.name}${item.variantInfo ? ` (${item.variantInfo})` : ""}`,
    price: item.price,
    totalPrice: item.price * item.quantity,
    imageUrl: item.image,
  }));

  // Calculate Shipping Cost
  const shippingCost = orderDetails.cartTotal > 19000 ? 0 : 3500; // Free shipping over $190

  // Construct API Payload
  const payload: ApiPayload = {
    customer: {
      firstName: orderDetails.firstName,
      lastName: orderDetails.lastName,
      name: `${orderDetails.firstName} ${orderDetails.lastName}`,
      phoneNumber: orderDetails.number,
      shippingAddress: {
        address: orderDetails.address || "POS Default Address",
        city: orderDetails.city || "POS Default City",
      },
    },
    ...(orderDetails.note &&
      orderDetails.note.trim() !== "" && {
        note: {
          creator: "Customer",
          creatorId: "customer",
          content: orderDetails.note,
        },
      }),
    orderStatus: "pending",
    items: apiOrderItems,
    shippingInfo: {
      cost: shippingCost,
    },
    storeId: STORE_ID,
    createdAt: new Date(),
  };

  console.log("Sending order to API:", ORDER_API_URL);
  console.log("Payload:", JSON.stringify(payload, null, 2));

  try {
    const response = await axios.post(ORDER_API_URL, payload, {
      params: { storeId: STORE_ID },
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Order created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to create order:", error);
    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
      });
    }
    throw new Error("Failed to submit order. Please try again.");
  }
};
