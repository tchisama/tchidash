"use client"

import type { MouseEvent } from "react"
import { ArrowUp, ArrowDown, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { PageElement } from "@/types/elements"
import { ImageElement } from "@/components/elements/image-element"
import { HeaderElement } from "@/components/elements/header-element"
import { ParagraphElement } from "@/components/elements/paragraph-element"
import { VariantSelectorElement } from "@/components/elements/variant-selector-element"
import { OrderFormElement } from "@/components/elements/order-form-element"
import { ReviewsElement } from "@/components/elements/reviews-element"
import { ContactFormElement } from "@/components/elements/contact-form-element"
import { FeaturesElement } from "@/components/elements/features-element"
import { FAQElement } from "@/components/elements/faq-element"
import { CTAElement } from "@/components/elements/cta-element"
import { SpecificationsElement } from "@/components/elements/specifications-element"
import { RelatedProductsElement } from "@/components/elements/related-products-element"
import { NewsletterElement } from "@/components/elements/newsletter-element"
import { HeroElement } from "@/components/elements/hero-element"

interface CanvasElementProps {
  element: PageElement
  isSelected: boolean
  onSelect: () => void
  onMove: (direction: "up" | "down") => void
  onRemove: () => void
  isFirst: boolean
  isLast: boolean
}

export function CanvasElement({
  element,
  isSelected,
  onSelect,
  onMove,
  onRemove,
  isFirst,
  isLast,
}: CanvasElementProps) {
  const handleClick = (e: MouseEvent) => {
    e.stopPropagation()
    onSelect()
  }

  const renderElement = () => {
    switch (element.type) {
      case "image":
        return <ImageElement element={element} />
      case "header":
        return <HeaderElement element={element} />
      case "paragraph":
        return <ParagraphElement element={element} />
      case "variant-selector":
        return <VariantSelectorElement element={element} />
      case "order-form":
        return <OrderFormElement element={element} />
      case "reviews":
        return <ReviewsElement element={element} />
      case "contact-form":
        return <ContactFormElement element={element} />
      case "features":
        return <FeaturesElement element={element} />
      case "faq":
        return <FAQElement element={element} />
      case "cta":
        return <CTAElement element={element} />
      case "specifications":
        return <SpecificationsElement element={element} />
      case "related-products":
        return <RelatedProductsElement element={element} />
      case "newsletter":
        return <NewsletterElement element={element} />
      case "hero":
        return <HeroElement element={element} />
      default:
        return null
    }
  }

  return (
    <div className={`relative group ${isSelected ? "ring-2 ring-primary" : ""}`} onClick={handleClick}>
      {isSelected && (
        <div className="absolute -top-3 -right-3 flex space-x-1 bg-white shadow-sm rounded-md border p-1 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation()
              onMove("up")
            }}
            disabled={isFirst}
          >
            <ArrowUp className="h-4 w-4" />
            <span className="sr-only">Move up</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation()
              onMove("down")
            }}
            disabled={isLast}
          >
            <ArrowDown className="h-4 w-4" />
            <span className="sr-only">Move down</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-destructive hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Remove</span>
          </Button>
        </div>
      )}
      {renderElement()}
    </div>
  )
}
