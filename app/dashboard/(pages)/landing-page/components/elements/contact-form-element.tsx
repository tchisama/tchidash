"use client"

import type React from "react"
import { useState } from "react"
import type { PageElement } from "../../types/elements"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { collection, Timestamp } from "firebase/firestore"
import { db } from "@/firebase"
import { dbAddDoc } from "@/lib/dbFuntions/fbFuns"

interface ContactFormElementProps {
  element: PageElement
  storeId: string
}

export function ContactFormElement({ element, storeId }: ContactFormElementProps) {
  const { style, content } = element
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  })

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
    marginBottom: "24px",
    textAlign: (style.titleAlign as React.CSSProperties["textAlign"]) || "center",
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!storeId) return

    try {
      await dbAddDoc(
        collection(db, "messages"),
        {
          name: formData.name,
          phone: formData.phone,
          storeId,
          message: formData.message,
          status: "new",
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        },
        storeId,
        ""
      )
      
      // Reset form after successful submission
      setFormData({ name: "", phone: "", message: "" })
      alert("Message sent successfully! We'll get back to you soon.")
    } catch (error) {
      console.error("Error sending message:", error)
      alert("Failed to send message. Please try again.")
    }
  }

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>{content.sectionTitle || "Contact Us"}</h2>
      <p style={subtitleStyle}>{content.subtitle || "Have questions? We're here to help!"}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="contact-name">Your Name</Label>
          <Input
            id="contact-name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-phone">Phone Number</Label>
          <Input
            id="contact-phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-message">Message</Label>
          <Textarea
            id="contact-message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="How can we help you?"
            rows={4}
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          style={{
            backgroundColor: style.buttonColor || undefined,
            color: style.buttonTextColor || undefined,
          }}
        >
          {content.buttonText || "Send Message"}
        </Button>
      </form>
    </div>
  )
}
