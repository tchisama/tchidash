"use client"

import type React from "react"
import type { PageElement } from "../../types/elements"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface RelatedProductsElementProps {
  element: PageElement
}

export function RelatedProductsElement({ element }: RelatedProductsElementProps) {
  const { style, content } = element
  const products = content.products || []

  const containerStyle = {
    padding: `${style.padding || 24}px`,
    margin: `${style.margin || 0}px`,
    borderRadius: `${style.borderRadius || 8}px`,
    border: style.borderWidth ? `${style.borderWidth}px solid ${style.borderColor || "#e5e7eb"}` : "1px solid #e5e7eb",
    backgroundColor: style.backgroundColor || "#ffffff",
  }

  const titleStyle = {
    color: style.titleColor || "#000",
    fontSize: `${style.titleFontSize || 24}px`,
    fontWeight: style.titleFontWeight || "bold",
    marginBottom: "8px",
    textAlign: (style.titleAlign as React.CSSProperties["textAlign"]) || "center",
  }

  const subtitleStyle = {
    color: style.subtitleColor || "#6b7280",
    fontSize: `${style.subtitleFontSize || 16}px`,
    marginBottom: "32px",
    textAlign: (style.subtitleAlign as React.CSSProperties["textAlign"]) || "center",
  }

  const productStyle = {
    backgroundColor: style.productBgColor || "#ffffff",
    borderRadius: `${style.productBorderRadius || 8}px`,
    borderWidth: `${style.productBorderWidth || 1}px`,
    borderColor: style.productBorderColor || "#e5e7eb",
    borderStyle: "solid",
  }

  const productTitleStyle = {
    fontSize: `${style.productTitleSize || 16}px`,
    color: style.productTitleColor || "#000000",
    fontWeight: "medium",
  }

  const productPriceStyle = {
    fontSize: `${style.productPriceSize || 14}px`,
    color: style.productPriceColor || "#6b7280",
  }

  const columns = style.columns || 3

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>{content.sectionTitle || "You May Also Like"}</h2>
      <p style={subtitleStyle}>{content.subtitle || "Customers who bought this item also purchased"}</p>

      <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-6`}>
        {products.map((product: unknown) => (
          <div key={product.id} style={productStyle} className="overflow-hidden">
            {content.showProductImages !== false && product.image && (
              <div className="aspect-square w-full overflow-hidden">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                  width={300}
                  height={300}
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                />
              </div>
            )}
            <div className="p-4">
              <h3 style={productTitleStyle} className="mb-2">
                {product.title}
              </h3>

              {content.showProductPrices !== false && (
                <p style={productPriceStyle} className="mb-4">
                  ${product.price.toFixed(2)}
                </p>
              )}

              {content.showProductButtons !== false && (
                <Button
                  size="sm"
                  className="w-full"
                  style={{
                    backgroundColor: style.buttonColor || "#000000",
                    color: style.buttonTextColor || "#ffffff",
                  }}
                  asChild
                >
                  <a href={product.link || "#"}>{content.buttonText || "View Product"}</a>
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
