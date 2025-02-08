import { useStore } from "@/store/storeInfos";
import { Order } from "@/types/order";
import { useSession } from "next-auth/react";

const useRenderWhatsappMessage = ({
  currentOrder,
}: {
  currentOrder: Order;
}) => {
  const { store } = useStore();
  const { data } = useSession();

  if (!currentOrder) return (message: string) => message;
  return (message: string) =>
    message
      .replaceAll("{{name}}", currentOrder?.customer.name)
      .replaceAll("{{lastname}}", currentOrder?.customer.lastName ?? "")
      .replaceAll("{{phone}}", currentOrder?.customer.phoneNumber ?? "")
      .replaceAll("{{address}}", currentOrder?.customer.shippingAddress.address)
      .replaceAll("{{city}}", currentOrder?.customer.shippingAddress.city)
      .replaceAll("{{total_price}}", currentOrder?.totalPrice.toString())
      .replaceAll("{{total_items}}", currentOrder.totalItems.toString())
      .replaceAll(
        "{{user}}",
        store?.employees?.find((e) => e.email === data?.user?.email)?.name ??
          "",
      );
};

export default useRenderWhatsappMessage;

