"use client";

import type React from "react";
import { useState, useEffect } from "react";
import type { PageElement } from "../../types/elements";
import { useProduct } from "../../context/product-context";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { createOrder } from "@/lib/orders/createOrder";

interface OrderFormElementProps {
  element: PageElement;
  storeId: string; // Add storeId as a prop
}

export function OrderFormElement({ element, storeId }: OrderFormElementProps) {
  const { style, content } = element;
  const {
    selectedProduct,
    selectedVariant,
    quantity,
    getTotalPrice,
    getFullProductTitle,
  } = useProduct();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    number: "",
    address: "",
    city: "",
    note: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Log the selected variant whenever it changes
  useEffect(() => {
    console.log("Selected variant in order form:", selectedVariant);
  }, [selectedVariant]);

  const containerStyle = {
    padding: `${style.padding || 16}px`,
    margin: `${style.margin || 0}px`,
    borderRadius: `${style.borderRadius || 8}px`,
    border: style.borderWidth
      ? `${style.borderWidth}px solid ${style.borderColor || "#e5e7eb"}`
      : "1px solid #e5e7eb",
    backgroundColor: style.backgroundColor || "#ffffff",
  };

  const titleStyle = {
    color: style.titleColor || "#000",
    fontSize: `${style.titleFontSize || 20}px`,
    fontWeight: style.titleFontWeight || "bold",
    marginBottom: `${style.titleMarginBottom || 16}px`,
    textAlign: style.titleAlign || "left",
  } as React.CSSProperties;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct) {
      setError("Please select a product");
      return;
    }

    if (!selectedVariant) {
      setError("Please select a variant");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const orderDetails = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        number: formData.number,
        address: formData.address,
        city: formData.city,
        note: formData.note,
        cartItems: [
          {
            productId: selectedProduct.id,
            variantId: selectedVariant.id,
            name: selectedProduct.title,
            variantInfo: selectedVariant.title,
            price: selectedVariant.price,
            quantity: quantity,
            image: selectedVariant.images?.[0] || selectedProduct.images?.[0] || "",
          },
        ],
        cartTotal: getTotalPrice(),
      };

      // Call the createOrder function with the order details
      const response = await createOrder(orderDetails, storeId);
      console.log("Order created successfully:", response);
      setSuccess(true);
    } catch (err) {
      console.error("Error creating order:", err);
      setError("Failed to submit order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedProduct) {
    return (
      <div style={containerStyle as React.CSSProperties}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please select a product to enable the order form
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (success) {
    return (
      <div style={containerStyle as React.CSSProperties} className="min-h-[500px] flex flex-col items-center justify-center">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-4 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-green-600">Thank You!</h3>
          <Alert className="bg-green-50 border-green-200">
            <AlertDescription className="text-green-700 text-center">
              Your order has been submitted successfully!
            </AlertDescription>
          </Alert>
          <div className="mt-6 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <p className="text-gray-600">We appreciate your business!</p>
          </div>
          <p className="text-gray-500 mt-4">
            We will contact you shortly to confirm your order details.
          </p>
        </div>
      </div>
    );
  }

  // Use custom title if provided
  const formTitle = content.customTitle || style.title || "Your Information";
  // Use custom button text if provided
  const buttonText =
    content.customButtonText ||
    style.buttonText ||
    `Order Now • ${getTotalPrice().toFixed(2)}`;

  return (
    <div style={containerStyle as React.CSSProperties}>
      <div style={titleStyle as React.CSSProperties}>{formTitle as React.ReactNode}</div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {selectedProduct && (
          <div className="p-4 bg-gray-50 rounded-md mb-4">
            <h3 className="font-medium mb-2">Order Summary</h3>
            <div className="space-y-1">
              <p className="text-sm">
                <span className="font-medium">Product:</span>{" "}
                {getFullProductTitle()}
              </p>
              <p className="text-sm">
                <span className="font-medium">Quantity:</span> {quantity}
              </p>
              <p className="text-sm">
                <span className="font-medium">Unit Price:</span> $
                {selectedVariant?.price.toFixed(2) ||
                  selectedProduct.price.toFixed(2)}
              </p>
              <p className="font-medium text-base mt-2">
                Total: ${getTotalPrice().toFixed(2)}
              </p>
            </div>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter your first name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter your last name"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="number">Phone Number</Label>
          <Input
            id="number"
            name="number"
            type="tel"
            value={formData.number}
            onChange={handleChange}
            placeholder="Enter your phone number"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Shipping Address</Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your street address"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Enter your city"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="note">Order Notes (Optional)</Label>
          <Textarea
            id="note"
            name="note"
            value={formData.note}
            onChange={handleChange}
            placeholder="Any special instructions for your order"
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
          style={{
            backgroundColor: style.buttonColor || undefined,
            color: style.buttonTextColor || undefined,
          } as React.CSSProperties}
        >
          {isSubmitting ? "Processing..." : buttonText as React.ReactNode}
        </Button>
      </form>
    </div>
  );
}

export interface OrderDetails {
  firstName: string;
  lastName: string;
  number: string;
  address: string;
  city: string;
  note?: string;
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
