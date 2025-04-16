"use client"

import type React from "react"
import type { PageElement } from "@/types/elements"
import { Button } from "@/components/ui/button"

interface HeroElementProps {
  element: PageElement
}

export function HeroElement({ element }: HeroElementProps) {
  const { style, content } = element

  const containerStyle = {
    height: `${style.height || 500}px`,
    padding: `${style.padding || 48}px`,
    margin: `${style.margin || 0}px`,
    borderRadius: `${style.borderRadius || 0}px`,
    border: style.borderWidth ? `${style.borderWidth}px solid ${style.borderColor || "#e5e7eb"}` : "none",
    backgroundColor: style.backgroundColor || "#000000",
    backgroundImage: content.backgroundImage ? `url(${content.backgroundImage})` : "none",
    backgroundSize: style.backgroundSize || "cover",
    backgroundPosition: style.backgroundPosition || "center",
    position: "relative" as React.CSSProperties["position"],
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }

  const overlayStyle = {
    position: "absolute" as React.CSSProperties["position"],
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: `rgba(0, 0, 0, ${content.overlayOpacity || 0.3})`,
    borderRadius: `${style.borderRadius || 0}px`,
    zIndex: 0,
  }

  const contentContainerStyle = {
    position: "relative" as React.CSSProperties["position"],
    zIndex: 1,
    maxWidth: `${style.contentWidth || 800}px`,
    margin: "0 auto",
    textAlign: "center" as React.CSSProperties["textAlign"],
  }

  const titleStyle = {
    color: style.titleColor || "#ffffff",
    fontSize: `${style.titleFontSize || 48}px`,
    fontWeight: style.titleFontWeight || "bold",
    marginBottom: "16px",
    textAlign: (style.titleAlign as React.CSSProperties["textAlign"]) || "center",
  }

  const subtitleStyle = {
    color: style.subtitleColor || "#f9fafb",
    fontSize: `${style.subtitleFontSize || 20}px`,
    marginBottom: "32px",
    textAlign: (style.subtitleAlign as React.CSSProperties["textAlign"]) || "center",
  }

  return (
    <div style={containerStyle}>
      {content.backgroundImage && <div style={overlayStyle}></div>}
      <div style={contentContainerStyle}>
        <h1 style={titleStyle}>{content.title || "Premium Leather Products"}</h1>
        <p style={subtitleStyle}>{content.subtitle || "Handcrafted with care for the modern lifestyle"}</p>

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
