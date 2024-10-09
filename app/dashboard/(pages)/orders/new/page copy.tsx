"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product, Variant } from "@/types/product";
import {
  addDoc,
  and,
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { useStore } from "@/store/storeInfos";
import { db } from "@/firebase";
import { useQuery } from "@tanstack/react-query";
import {
  Currency,
  CustomerInfo,
  Order,
  OrderItem,
  PaymentMethod,
  ShippingInfo,
} from "@/types/order";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";

export default function CreateOrder() {
  const [order, setOrder] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    city: "",
    currency: "MAD" as Currency,
    paymentMethod: "cash_on_delivery" as PaymentMethod,
  });

  const [currentItem, setCurrentItem] = useState({
    productId: "",
    variantId: "",
    quantity: 1,
    price: 0,
    totalPrice: 0,
    title: "",
    image: "",
  });

  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const { storeId } = useStore();

  const { data: products } = useQuery({
    queryKey: ["products", storeId],
    queryFn: () => {
      const q = query(
        collection(db, "products"),
        and(where("storeId", "==", storeId), where("status", "!=", "deleted")),
      );
      const response = getDocs(q).then((response) =>
        response.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as Product),
      );
      return response;
    },
  });
  const [variants, setVariants] = useState<Variant[]>([]);
  useEffect(() => {
    if (!currentItem.productId) return;
    const product = products?.find((p) => p.id === currentItem.productId);
    if (!product) return;
    if (!product.variants) return;
    setVariants(product?.variants);
  }, [currentItem.productId, products]);

  // Mock data for products and variants

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrder((prev) => ({ ...prev, [name]: value }));
  };


  const getTotalPriceForItemWithDiscount = (
    productId: string,
    quantity: number,
  ) => {
    const product = products?.find((p) => p.id === productId);
    if (!product) return 0;
    if (!product.discount) return product.price * quantity;
    if (product.discount.type === "percentage") {
      return (
        (product.price - (product.price * product.discount.amount) / 100) *
        quantity
      );
    } else {
      return (product.price - product.discount.amount) * quantity;
    }
  };
  const getTotalPriceForItemWithDiscountAndVariant = (
    productId: string,
    variantId: string,
    quantity: number,
  ) => {
    const product = products?.find((p) => p.id === productId);
    const variant = variants?.find((v) => v.id === variantId);
    if (!product) return 0;
    if (!variant) return 0;
    if (!product.discount) return variant.price * quantity;
    if (product.discount.type === "percentage") {
      return (
        (variant.price -
          (variant.price * product.discount.amount) / 100) *
        quantity
      );
    } else {
      return (variant.price - product.discount.amount) * quantity;
    }
  };



const handleProductChange = (value: string) => {
  if (!products) return;
  const product = products.find((p) => p.id === value);
  if (!product) return;

  // Set the current item based on the product's base price, no variant selected yet
  setCurrentItem((prev) => ({
    ...prev,
    productId: value,
    variantId: "", // Reset variant when changing product
    price: product.price || 0,
    totalPrice: getTotalPriceForItemWithDiscount(value, prev.quantity || 1),
    title: product.title || "",
    discount: product.discount,
  }));

  // If product has variants, update the variants state
  if (product.variants) {
    setVariants(product.variants);
  } else {
    setVariants([]); // No variants, empty the variants state
  }
};

const handleVariantChange = (value: string) => {
  if (!variants) return;
  const variant = variants.find((v) => v.id === value);
  if (!variant) return;

  setCurrentItem((prev) => ({
    ...prev,
    variantId: value,
    price: variant.price, // Use variant price
    totalPrice: getTotalPriceForItemWithDiscountAndVariant(
      prev.productId,
      value,
      prev.quantity || 1,
    ),
    title: products?.find((p) => p.id === prev.productId)?.title +
      " [" + variant.title + "]",
  }));
};

const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const newQuantity = parseInt(e.target.value) || 1;

  setCurrentItem((prev) => {
    const totalPrice = prev.variantId
      ? getTotalPriceForItemWithDiscountAndVariant(prev.productId, prev.variantId, newQuantity)
      : getTotalPriceForItemWithDiscount(prev.productId, newQuantity);

    return {
      ...prev,
      quantity: newQuantity,
      totalPrice,
    };
  });
};


  const addItem = () => {
    if (variants.length > 0 && !currentItem.variantId) return;
    if (currentItem.productId) {
      setOrderItems((prev) => [...prev, currentItem]);
    }
  };

  const removeItem = (index: number) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
  };

  const calculateTotalsWithDiscount = (items: OrderItem[]) => {
    let totalItems = 0;
    let subtotal = 0;

    items.forEach((item) => {
      totalItems += item.quantity;
      subtotal += item.totalPrice;
    });

    return { totalItems, subtotal };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Calculate subtotal and totalItems based on the added order items
    const { totalItems, subtotal } = calculateTotalsWithDiscount(orderItems);

    // Build the customer information based on the form
    const customer: CustomerInfo = {
      id: "unique-customer-id", // You can generate or assign the actual customer ID here
      name: `${order.firstName} ${order.lastName}`,
      firstName: order.firstName,
      lastName: order.lastName,
      phoneNumber: order.phoneNumber,
      shippingAddress: {
        address: order.address,
        city: order.city,
      },
    };

    // Prepare default shipping info
    const shippingInfo: ShippingInfo = {
      method: "standard", // Set default shipping method here
      cost: 40, // Default shipping cost or retrieve dynamically
      shippingStatus: "pending",
    };

    // Calculate total price (subtotal + shipping - discount)
    const totalPrice = subtotal + shippingInfo.cost;

    // Build the final order object
    const fullOrder: Order = {
      id: "unique-order-id", // Generate a unique order ID
      customer,
      items: orderItems,
      totalItems,
      subtotal,
      shippingInfo,
      totalPrice,
      currency: order.currency,
      paymentMethod: order.paymentMethod,
      orderStatus: "pending", // Set initial order status
      createdAt: Timestamp.now(), // Automatically use Firebase timestamp
      storeId: storeId,
    } as Order;

    // Submit order data (Here, you can send this fullOrder to your backend or Firebase)
    console.log("Order to create:", fullOrder);
    addDoc(collection(db, "orders"), fullOrder).then((docRef) => {
      console.log("Order created with ID:", docRef.id);
    });

    // Reset form or trigger further actions
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle>Create New Order</CardTitle>
        <CardDescription>Enter the details for the new order.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <h3 className="text-lg font-medium">Customer Informations</h3>
          <div className="grid max-w-5xl grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={order.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={order.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={order.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={order.city}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={order.address}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <Separator />
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Add Items</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 ">
              <div className="space-y-2">
                <Label htmlFor="product">Product</Label>
                <Select
                  value={currentItem.productId}
                  onValueChange={handleProductChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products &&
                      products.length > 0 &&
                      products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.title}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              {variants && variants.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="variant">Variant</Label>
                  <Select
                    value={currentItem.variantId}
                    onValueChange={handleVariantChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select variant" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentItem.productId &&
                        variants &&
                        variants.length > 0 &&
                        variants.map((variant) => (
                          <SelectItem key={variant.id} value={variant.id}>
                            {variant.title}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={currentItem.quantity}
                  onChange={handleQuantityChange}
                  min="1"
                />
              </div>
              <div className="flex items-end">
                <Button type="button" variant={"outline"} onClick={addItem}>
                  Add Item
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl border">
            <Table className="">
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Variant</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Product Price</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products &&
                  variants &&
                  orderItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {products.find((p) => p.id === item.productId)?.title}
                      </TableCell>
                      <TableCell>
                        {variants.find((v) => v.id === item.variantId)
                          ?.title ?? (
                          <span className="text-muted-foreground">
                            No variant
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.price} Dh</TableCell>
                      <TableCell>
                        {item.discount && item.discount ? (
                          <span>
                            {item.discount.amount *
                              (item.discount.type === "percentage"
                                ? 1
                                : item.quantity)}{" "}
                            {item.discount.type === "percentage" ? "%" : "Dh"}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">
                            No discount
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {getTotalPriceForItemWithDiscount(
                          item.productId,
                          item.quantity,
                        )}{" "}
                        Dh
                      </TableCell>
                      <TableCell className="flex justify-end">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeItem(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" onClick={handleSubmit}>
          Create Order
        </Button>
      </CardFooter>
    </Card>
  );
}

