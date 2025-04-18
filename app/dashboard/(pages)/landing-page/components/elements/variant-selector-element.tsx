"use client"

import type React from "react"
import Image from "next/image"
import type { PageElement } from "../../types/elements"
import { useProduct } from "../../context/product-context"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

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

      {/* Variant Image Display */}
      {selectedVariant?.images && selectedVariant.images.length > 0 && (
        <div className="mb-6 w-full">
          {selectedVariant.images.length === 1 ? (
            <Card className="border-0">
              <CardContent className="flex items-center justify-center p-2">
                <div className="relative w-full aspect-square max-w-[500px]">
                  <Image
                    src={selectedVariant.images[0]}
                    alt={`${selectedVariant.title} - Image`}
                    fill
                    className="object-cover w-full rounded-md"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                  />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Carousel className="w-full">
              <CarouselContent>
                {selectedVariant.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <Card className="border-0">
                      <CardContent className="flex items-center justify-center p-2">
                        <div className="relative w-full aspect-[16/9] max-h-[500px]">
                          <Image
                            src={image}
                            alt={`${selectedVariant.title} - Image ${index + 1}`}
                            fill
                            className="object-contain rounded-md"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          )}
        </div>
      )}

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

            <div className="flex flex-col  space-x-2 mb-4">
              <Label htmlFor="quantity" className="font-medium">
                Quantity:
              </Label>
              <br />
              <div className="flex items-center">
                <Button
                  variant={"secondary"}
                  size="icon"
                  className="h-10 w-10 rounded-r-none bg-gray-300"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                  <span className="sr-only">Decrease quantity</span>
                </Button>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max={selectedVariant.inventoryQuantity || 100}
                  value={quantity}
                  onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value) || 1)}
                  className="h-10 w-16 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <Button
                  variant={"secondary"}
                  size="icon"
                  className="h-10 w-10 rounded-l-none bg-gray-300"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= (selectedVariant.inventoryQuantity || 100)}
                >
                  <Plus className="h-4 w-4" />
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
