"use client"

import type React from "react"

import { useState } from "react"
import type { PageElement } from "../../types/elements"
import { useProduct } from "../../context/product-context"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface OrderFormElementProps {
  element: PageElement
}

export function OrderFormElement({ element }: OrderFormElementProps) {
  const { style, content } = element
  const { selectedProduct, selectedVariant, quantity, getTotalPrice, getFullProductTitle } = useProduct()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  })

  const containerStyle = {
    padding: `${style.padding || 16}px`,
    margin: `${style.margin || 0}px`,
    borderRadius: `${style.borderRadius || 8}px`,
    border: style.borderWidth ? `${style.borderWidth}px solid ${style.borderColor || "#e5e7eb"}` : "1px solid #e5e7eb",
    backgroundColor: style.backgroundColor || "#ffffff",
  }

  const titleStyle = {
    color: style.titleColor || "#000",
    fontSize: `${style.titleFontSize || 20}px`,
    fontWeight: style.titleFontWeight || "bold",
    marginBottom: `${style.titleMarginBottom || 16}px`,
    textAlign: style.titleAlign || "left",
  } as React.CSSProperties

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, you would submit the order here with the product info
    const orderDetails = {
      product: selectedProduct?.title,
      variant: selectedVariant?.title,
      quantity,
      totalPrice: getTotalPrice(),
      customerInfo: formData,
    }

    console.log("Order submitted:", orderDetails)
    alert(`Order for ${quantity} x ${getFullProductTitle()} submitted successfully!`)
  }

  if (!selectedProduct) {
    return (
      <div style={containerStyle}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Please select a product to enable the order form</AlertDescription>
        </Alert>
      </div>
    )
  }

  // Use custom title if provided
  const formTitle = content.customTitle || style.title || "Your Information"
  // Use custom button text if provided
  const buttonText = content.customButtonText || style.buttonText || `Order Now • ${getTotalPrice().toFixed(2)}`

  return (
    <div style={containerStyle}>
      <div style={titleStyle}>{formTitle}</div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {selectedProduct && (
          <div className="p-4 bg-gray-50 rounded-md mb-4">
            <h3 className="font-medium mb-2">Order Summary</h3>
            <div className="space-y-1">
              <p className="text-sm">
                <span className="font-medium">Product:</span> {getFullProductTitle()}
              </p>
              <p className="text-sm">
                <span className="font-medium">Quantity:</span> {quantity}
              </p>
              <p className="text-sm">
                <span className="font-medium">Unit Price:</span> $
                {selectedVariant?.price.toFixed(2) || selectedProduct.price.toFixed(2)}
              </p>
              <p className="font-medium text-base mt-2">Total: ${getTotalPrice().toFixed(2)}</p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Shipping Address</Label>
          <Textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your shipping address"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Order Notes (Optional)</Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any special instructions for your order"
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          style={{
            backgroundColor: style.buttonColor || undefined,
            color: style.buttonTextColor || undefined,
          }}
        >
          {buttonText}
        </Button>
      </form>
    </div>
  )
}
