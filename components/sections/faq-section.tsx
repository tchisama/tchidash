"use client"

import type { Section } from "@/components/landing-page-builder"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface FAQSectionProps {
  section: Section
  selectedElementId: string | null
  onSelectElement: (elementId: string) => void
}

export function FAQSection({ section, selectedElementId, onSelectElement }: FAQSectionProps) {
  // Default placeholder content
  return (
    <div
      className="py-12 px-6 md:px-12"
      style={{
        backgroundColor: section.props?.backgroundColor || "transparent",
        color: section.props?.textColor || "inherit",
      }}
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Find answers to common questions about our product and services.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {[1, 2, 3, 4].map((i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger>Question {i}?</AccordionTrigger>
              <AccordionContent>
                This is a placeholder for the answer to question {i}. Replace with actual content.
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
