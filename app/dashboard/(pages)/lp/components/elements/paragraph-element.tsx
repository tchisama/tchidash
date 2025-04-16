"use client"

import type React from "react"

import type { PageElement } from "@/types/elements"

interface ParagraphElementProps {
  element: PageElement
}

export function ParagraphElement({ element }: ParagraphElementProps) {
  const { content, style } = element
  const text = content.text || "Paragraph text goes here. Edit this text in the content panel."

  const paragraphStyle = {
    color: style.textColor || "#000",
    fontSize: `${style.fontSize || 16}px`,
    fontWeight: style.fontWeight || "normal",
    textAlign: style.textAlign || "left",
    padding: `${style.padding || 0}px`,
    margin: `${style.margin || 0}px`,
    borderRadius: `${style.borderRadius || 0}px`,
    border: style.borderWidth ? `${style.borderWidth}px solid ${style.borderColor || "#e5e7eb"}` : "none",
    backgroundColor: style.backgroundColor || "transparent",
    lineHeight: style.lineHeight || "1.5",
  } as React.CSSProperties

  return <div style={paragraphStyle}>{text}</div>
}
