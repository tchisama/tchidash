"use client"

import type React from "react"
import type { PageElement } from "../../types/elements"
import { Button } from "@/components/ui/button"

interface CTAElementProps {
  element: PageElement
}

export function CTAElement({ element }: CTAElementProps) {
  const { style, content } = element

  const containerStyle = {
    padding: `${style.padding || 48}px`,
    margin: `${style.margin || 0}px`,
    borderRadius: `${style.borderRadius || 8}px`,
    border: style.borderWidth ? `${style.borderWidth}px solid ${style.borderColor || "#e5e7eb"}` : "none",
    backgroundColor: style.backgroundColor || "#000000",
    backgroundImage: style.backgroundImage ? `url(${style.backgroundImage})` : "none",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative" as React.CSSProperties["position"],
  }

  const overlayStyle = {
    position: "absolute" as React.CSSProperties["position"],
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: style.backgroundOverlay || "rgba(0, 0, 0, 0.5)",
    borderRadius: `${style.borderRadius || 8}px`,
    zIndex: 0,
  }

  const contentContainerStyle = {
    position: "relative" as React.CSSProperties["position"],
    zIndex: 1,
    maxWidth: `${style.contentWidth || 800}px`,
    margin: "0 auto",
  }

  const titleStyle = {
    color: style.titleColor || "#ffffff",
    fontSize: `${style.titleFontSize || 28}px`,
    fontWeight: style.titleFontWeight || "bold",
    marginBottom: "16px",
    textAlign: (style.titleAlign as React.CSSProperties["textAlign"]) || "center",
  }

  const subtitleStyle = {
    color: style.subtitleColor || "#f9fafb",
    fontSize: `${style.subtitleFontSize || 16}px`,
    marginBottom: "32px",
    textAlign: (style.subtitleAlign as React.CSSProperties["textAlign"]) || "center",
  }

  return (
    <div style={containerStyle}>
      {(style.backgroundImage || style.backgroundOverlay) && <div style={overlayStyle}></div>}
      <div style={contentContainerStyle}>
        <h2 style={titleStyle}>{content.title || "Ready to Experience the Difference?"}</h2>
        <p style={subtitleStyle}>
          {content.subtitle || "Join thousands of satisfied customers who have upgraded their lifestyle."}
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            size="lg"
            style={{
              backgroundColor: style.buttonColor || "#ffffff",
              color: style.buttonTextColor || "#000000",
            }}
            asChild
          >
            <a href={content.buttonLink || "#"}>{content.buttonText || "Shop Now"}</a>
          </Button>

          {content.secondaryButtonText && (
            <Button
              size="lg"
              variant="outline"
              style={{
                backgroundColor: style.secondaryButtonColor || "transparent",
                color: style.secondaryButtonTextColor || "#ffffff",
                borderColor: style.secondaryButtonBorderColor || "#ffffff",
              }}
              asChild
            >
              <a href={content.secondaryButtonLink || "#"}>{content.secondaryButtonText}</a>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
