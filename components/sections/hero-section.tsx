"use client"

import type { Section } from "@/components/landing-page-builder"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface HeroSectionProps {
  section: Section
  selectedElementId: string | null
  onSelectElement: (elementId: string) => void
}

export function HeroSection({ section, selectedElementId, onSelectElement }: HeroSectionProps) {
  // Default elements if none exist
  if (section.elements.length === 0) {
    return (
      <div
        className="p-8 md:p-12 lg:p-16 flex flex-col items-center text-center space-y-6"
        style={{
          backgroundColor: section.props?.backgroundColor || "transparent",
          color: section.props?.textColor || "inherit",
        }}
      >
        <div
          className={`cursor-pointer p-2 ${selectedElementId === "placeholder-heading" ? "ring-2 ring-primary" : ""}`}
          onClick={() => onSelectElement("placeholder-heading")}
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">Your Awesome Hero Heading</h1>
        </div>
        <div
          className={`cursor-pointer max-w-2xl p-2 ${selectedElementId === "placeholder-subheading" ? "ring-2 ring-primary" : ""}`}
          onClick={() => onSelectElement("placeholder-subheading")}
        >
          <p className="text-lg text-muted-foreground">
            This is a placeholder for your hero section. Add elements from the sidebar to customize this section.
          </p>
        </div>
        <div
          className={`cursor-pointer p-2 ${selectedElementId === "placeholder-button" ? "ring-2 ring-primary" : ""}`}
          onClick={() => onSelectElement("placeholder-button")}
        >
          <Button size="lg">Get Started</Button>
        </div>
        <div
          className={`cursor-pointer mt-8 p-2 ${selectedElementId === "placeholder-image" ? "ring-2 ring-primary" : ""}`}
          onClick={() => onSelectElement("placeholder-image")}
        >
          <Image
            src="/placeholder.svg?height=400&width=800"
            alt="Hero image"
            width={800}
            height={400}
            className="rounded-lg"
          />
        </div>
      </div>
    )
  }

  // Render actual elements
  return (
    <div
      className="p-8 md:p-12 lg:p-16 flex flex-col items-center text-center space-y-6"
      style={{
        backgroundColor: section.props?.backgroundColor || "transparent",
        color: section.props?.textColor || "inherit",
      }}
    >
      {section.elements.map((element) => (
        <div
          key={element.id}
          className={`cursor-pointer p-2 ${selectedElementId === element.id ? "ring-2 ring-primary" : ""}`}
          onClick={() => onSelectElement(element.id)}
          style={{
            textAlign: element.props?.textAlign || "center",
            margin:
              element.props?.margin === "none"
                ? "0"
                : element.props?.margin === "small"
                  ? "0.5rem 0"
                  : element.props?.margin === "large"
                    ? "2rem 0"
                    : "1rem 0",
          }}
        >
          {element.type === "heading" &&
            (element.content.level === "h1" ? (
              <h1
                className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
                style={{
                  color: element.props?.color || "inherit",
                  fontWeight: element.props?.fontWeight || "bold",
                }}
              >
                {element.content.text}
              </h1>
            ) : element.content.level === "h2" ? (
              <h2
                className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight"
                style={{
                  color: element.props?.color || "inherit",
                  fontWeight: element.props?.fontWeight || "bold",
                }}
              >
                {element.content.text}
              </h2>
            ) : (
              <h3
                className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight"
                style={{
                  color: element.props?.color || "inherit",
                  fontWeight: element.props?.fontWeight || "bold",
                }}
              >
                {element.content.text}
              </h3>
            ))}

          {element.type === "paragraph" && (
            <p
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              style={{ color: element.props?.color || "inherit" }}
            >
              {element.content.text}
            </p>
          )}

          {element.type === "button" && (
            <Button size="lg" variant={element.content.variant || "default"} asChild>
              <a href={element.content.url || "#"}>{element.content.text || "Button"}</a>
            </Button>
          )}

          {element.type === "image" && (
            <Image
              src={element.content.src || "/placeholder.svg?height=400&width=800"}
              alt={element.content.alt || "Image"}
              width={800}
              height={400}
              className="rounded-lg max-w-full"
            />
          )}
        </div>
      ))}
    </div>
  )
}
