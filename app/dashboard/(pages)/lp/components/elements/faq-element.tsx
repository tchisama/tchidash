"use client"

import type React from "react"
import type { PageElement, FAQ } from "@/types/elements"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface FAQElementProps {
  element: PageElement
}

export function FAQElement({ element }: FAQElementProps) {
  const { style, content } = element
  const faqs = content.faqs || []

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

  const questionStyle = {
    fontSize: `${style.questionFontSize || 16}px`,
    fontWeight: style.questionFontWeight || "medium",
    color: style.questionColor || "#000000",
  }

  const answerStyle = {
    fontSize: `${style.answerFontSize || 14}px`,
    color: style.answerColor || "#6b7280",
  }

  const itemStyle = {
    backgroundColor: style.itemBgColor || "#f9fafb",
    borderRadius: `${style.itemBorderRadius || 8}px`,
    padding: `${style.itemPadding || 16}px`,
    marginBottom: `${style.itemSpacing || 8}px`,
  }

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>{content.sectionTitle || "Frequently Asked Questions"}</h2>
      <p style={subtitleStyle}>{content.subtitle || "Find answers to common questions about our product"}</p>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq: FAQ, index: number) => (
          <AccordionItem
            key={faq.id}
            value={faq.id}
            className="border-0 mb-3 last:mb-0 overflow-hidden"
            style={itemStyle}
          >
            <AccordionTrigger className="hover:no-underline py-2" style={questionStyle}>
              {faq.question}
            </AccordionTrigger>
            <AccordionContent style={answerStyle}>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
