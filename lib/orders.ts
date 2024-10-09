import { OrderItem } from "@/types/order";

export const getTotalPriceFromItem = (item: OrderItem) => {
  const unitPrice = item.price;
  const quantity = item.quantity;
  const discount = item.discount?.type == "fixed" ? item.discount.amount : 
  unitPrice * (item.discount?.amount || 0) / 100

  return (unitPrice - discount) * quantity
}