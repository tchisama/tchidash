"use client"

import Image from "next/image"
import type { PageElement } from "@/types/elements"

interface ImageElementProps {
  element: PageElement
}

export function ImageElement({ element }: ImageElementProps) {
  const { content, style } = element
  const src = content.src || "/placeholder.svg?height=400&width=600"
  const alt = content.alt || "Image"

  return (
    <div
      className="relative"
      style={{
        padding: `${style.padding || 0}px`,
        margin: `${style.margin || 0}px`,
        borderRadius: `${style.borderRadius || 0}px`,
        border: style.borderWidth ? `${style.borderWidth}px solid ${style.borderColor || "#e5e7eb"}` : "none",
        backgroundColor: style.backgroundColor || "transparent",
      }}
    >
      <div
        className="relative"
        style={{
          width: "100%",
          height: style.height ? `${style.height}px` : "auto",
          maxWidth: style.maxWidth ? `${style.maxWidth}px` : "100%",
          margin: "0 auto",
        }}
      >
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          width={600}
          height={400}
          className="object-cover w-full h-full"
          style={{
            objectFit: style.objectFit || "cover",
            borderRadius: `${style.imageBorderRadius || 0}px`,
          }}
        />
      </div>
    </div>
  )
}
