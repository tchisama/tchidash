import { useOrderStore } from "@/store/orders";

const useRenderWhatsappMessage = () => {
	const { currentOrder } = useOrderStore();
  if(!currentOrder) return (message:string) => message;
	return (message:string) => message
		.replaceAll("{{name}}", currentOrder?.customer.name)
		.replaceAll("{{lastname}}", currentOrder?.customer.lastName ?? "")
		.replaceAll("{{phone}}", currentOrder?.customer.phoneNumber ?? "")
		.replaceAll("{{address}}", currentOrder?.customer.shippingAddress.address)
		.replaceAll("{{city}}", currentOrder?.customer.shippingAddress.city)
		.replaceAll("{{total_price}}", currentOrder?.totalPrice.toString())
		.replaceAll("{{total_items}}", currentOrder.totalItems.toString());
};


export default useRenderWhatsappMessage;