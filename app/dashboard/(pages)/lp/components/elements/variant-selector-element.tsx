"use client"

import type React from "react"
import Image from "next/image"
import type { PageElement } from "@/types/elements"
import { useProduct } from "@/context/product-context"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface VariantSelectorElementProps {
  element: PageElement
}

export function VariantSelectorElement({ element }: VariantSelectorElementProps) {
  const { style, content } = element
  const {
    selectedProduct,
    selectedVariant,
    setSelectedVariant,
    quantity,
    setQuantity,
    getTotalPrice,
    getFullProductTitle,
  } = useProduct()

  const containerStyle = {
    padding: `${style.padding || 16}px`,
    margin: `${style.margin || 0}px`,
    borderRadius: `${style.borderRadius || 8}px`,
    border: style.borderWidth ? `${style.borderWidth}px solid ${style.borderColor || "#e5e7eb"}` : "1px solid #e5e7eb",
    backgroundColor: style.backgroundColor || "#f9fafb",
  }

  const titleStyle = {
    color: style.titleColor || "#000",
    fontSize: `${style.titleFontSize || 18}px`,
    fontWeight: style.titleFontWeight || "bold",
    marginBottom: `${style.titleMarginBottom || 16}px`,
  } as React.CSSProperties

  const handleQuantityChange = (newQuantity: number) => {
    // Ensure quantity is at least 1 and not more than available inventory
    const maxInventory = selectedVariant?.inventoryQuantity || 100
    const validQuantity = Math.max(1, Math.min(newQuantity, maxInventory))
    setQuantity(validQuantity)
  }

  if (!selectedProduct) {
    return (
      <div style={containerStyle}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Please select a product to display variants</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (
    !selectedProduct.options ||
    selectedProduct.options.length === 0 ||
    !selectedProduct.variants ||
    selectedProduct.variants.length === 0
  ) {
    return (
      <div style={containerStyle}>
        <Alert>
          <AlertDescription>This product has no variants to display</AlertDescription>
        </Alert>
      </div>
    )
  }

  // Use custom title if provided, otherwise use product title
  const productTitle = content.customTitle || selectedProduct.title

  return (
    <div style={containerStyle}>
      <h2 className="text-xl font-bold mb-4">{productTitle}</h2>

      {selectedProduct.options.map((option, index) => (
        <div key={index} className="mb-6 last:mb-0">
          {/* Use custom option name if provided, otherwise use product option name */}
          <div style={titleStyle}>Select {content.customOptionName || option.name}</div>

          <RadioGroup
            value={selectedVariant?.id || ""}
            onValueChange={(value) => {
              const variant = selectedProduct.variants.find((v) => v.id === value)
              if (variant) {
                setSelectedVariant(variant)
              }
            }}
            className="grid gap-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedProduct.variants.map((variant) => (
                <div key={variant.id} className="relative">
                  <RadioGroupItem value={variant.id} id={variant.id} className="peer sr-only" />
                  <Label
                    htmlFor={variant.id}
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    {variant.images && variant.images.length > 0 && (
                      <div className="mb-3 w-full">
                        <Image
                          src={variant.images[0] || "/placeholder.svg"}
                          alt={variant.title}
                          width={150}
                          height={150}
                          className="w-full h-auto object-cover rounded-md"
                        />
                      </div>
                    )}
                    <div className="font-medium">{variant.title}</div>
                    <div className="mt-1 text-sm">${variant.price}</div>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
      ))}

      {selectedVariant && (
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-white rounded-md border">
            <div className="font-medium text-lg">{getFullProductTitle()}</div>
            <div className="text-sm text-muted-foreground mb-4">Unit Price: ${selectedVariant.price}</div>

            <div className="flex items-center space-x-2 mb-4">
              <Label htmlFor="quantity" className="font-medium">
                Quantity:
              </Label>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-r-none"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                  <span className="sr-only">Decrease quantity</span>
                </Button>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max={selectedVariant.inventoryQuantity || 100}
                  value={quantity}
                  onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value) || 1)}
                  className="h-8 w-16 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-l-none"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= (selectedVariant.inventoryQuantity || 100)}
                >
                  <Plus className="h-3 w-3" />
                  <span className="sr-only">Increase quantity</span>
                </Button>
              </div>
            </div>

            <div className="text-lg font-bold">Total: ${getTotalPrice().toFixed(2)}</div>
          </div>
        </div>
      )}
    </div>
  )
}
