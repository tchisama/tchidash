"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import type { PageElement } from "../types/elements"
import { ImageElement } from "./../components/elements/image-element"
import { HeaderElement } from "./../components/elements/header-element"
import { ParagraphElement } from "./../components/elements/paragraph-element"
import { VariantSelectorElement } from "./../components/elements/variant-selector-element"
import { OrderFormElement } from "./../components/elements/order-form-element"
import { ReviewsElement } from "./../components/elements/reviews-element"
import { ContactFormElement } from "./../components/elements/contact-form-element"
import { FeaturesElement } from "./../components/elements/features-element"
import { FAQElement } from "./../components/elements/faq-element"
import { CTAElement } from "./../components/elements/cta-element"
import { SpecificationsElement } from "./../components/elements/specifications-element"
import { RelatedProductsElement } from "./../components/elements/related-products-element"
import { NewsletterElement } from "./../components/elements/newsletter-element"
import { HeroElement } from "./../components/elements/hero-element"

interface PreviewProps {
  elements: PageElement[]
  previewWidth?: number
  screenSize: string
}

export function Preview({ elements, previewWidth = 1280, screenSize }: PreviewProps) {
  const renderElement = (element: PageElement) => {
    switch (element.type) {
      case "image":
        return <ImageElement key={element.id} element={element} />
      case "header":
        return <HeaderElement key={element.id} element={element} />
      case "paragraph":
        return <ParagraphElement key={element.id} element={element} />
      case "variant-selector":
        return <VariantSelectorElement key={element.id} element={element} />
      case "order-form":
        return <OrderFormElement key={element.id} element={element} />
      case "reviews":
        return <ReviewsElement key={element.id} element={element} />
      case "contact-form":
        return <ContactFormElement key={element.id} element={element} />
      case "features":
        return <FeaturesElement key={element.id} element={element} />
      case "faq":
        return <FAQElement key={element.id} element={element} />
      case "cta":
        return <CTAElement key={element.id} element={element} />
      case "specifications":
        return <SpecificationsElement key={element.id} element={element} />
      case "related-products":
        return <RelatedProductsElement key={element.id} element={element} />
      case "newsletter":
        return <NewsletterElement key={element.id} element={element} />
      case "hero":
        return <HeroElement key={element.id} element={element} />
      default:
        return null
    }
  }

  return (
    <div className="h-full bg-gray-100 overflow-hidden">
      <ScrollArea className="h-full">
        <div
          className={`mx-auto p-0 transition-all duration-300 ${screenSize === "mobile" ? "max-w-[375px]" : screenSize === "tablet" ? "max-w-[768px]" : "max-w-[1280px]"}`}
        >
          <div
            className="bg-white shadow-sm rounded-lg overflow-hidden"
            style={{ width: "100%", maxWidth: `${previewWidth}px` }}
          >
            {elements.length === 0 ? (
              <div className="h-[calc(100vh-12rem)] flex items-center justify-center text-muted-foreground p-8">
                <p>No elements added yet. Switch to Editor to add elements.</p>
              </div>
            ) : (
              <div>{elements.map(renderElement)}</div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
