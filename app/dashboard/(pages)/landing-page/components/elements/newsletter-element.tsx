"use client"

import type React from "react"

import { useState } from "react"
import type { PageElement } from "../../types/elements"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface NewsletterElementProps {
  element: PageElement
}

export function NewsletterElement({ element }: NewsletterElementProps) {
  const { style, content } = element
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const containerStyle = {
    padding: `${style.padding || 24}px`,
    margin: `${style.margin || 0}px`,
    borderRadius: `${style.borderRadius || 8}px`,
    border: style.borderWidth ? `${style.borderWidth}px solid ${style.borderColor || "#e5e7eb"}` : "1px solid #e5e7eb",
    backgroundColor: style.backgroundColor || "#f9fafb",
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
    marginBottom: "24px",
    textAlign: (style.subtitleAlign as React.CSSProperties["textAlign"]) || "center",
  }

  const formContainerStyle = {
    maxWidth: `${style.maxWidth || 500}px`,
    margin: "0 auto",
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Newsletter subscription:", email)
    setIsSubmitted(true)
    setEmail("")
  }

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>{content.sectionTitle || "Stay Updated"}</h2>
      <p style={subtitleStyle}>{content.subtitle || "Subscribe to our newsletter for exclusive offers and updates"}</p>

      <div style={formContainerStyle}>
        {isSubmitted ? (
          <div className="text-center p-4 bg-green-50 text-green-700 rounded-md">
            {content.successMessage || "Thank you for subscribing!"}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={content.placeholderText || "Enter your email"}
              required
              className="flex-1"
              style={{
                backgroundColor: style.inputBgColor || "#ffffff",
                borderColor: style.inputBorderColor || "#e5e7eb",
                color: style.inputTextColor || "#000000",
              }}
            />
            <Button
              type="submit"
              style={{
                backgroundColor: style.buttonColor || "#000000",
                color: style.buttonTextColor || "#ffffff",
              }}
            >
              {content.buttonText || "Subscribe"}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
