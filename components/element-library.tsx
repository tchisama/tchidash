"use client"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlignLeft, Heading1, ImageIcon, ListChecks } from "lucide-react"
import { CheckIcon, ComponentPlaceholderIcon } from "@radix-ui/react-icons"

interface ElementLibraryProps {
  onAddElement: (type: string, content?: any, props?: any) => void
  disabled?: boolean
}

export function ElementLibrary({ onAddElement, disabled = false }: ElementLibraryProps) {
  const elementTypes = [
    {
      type: "heading",
      name: "Heading",
      icon: Heading1,
      description: "Add a heading to your section",
      defaultContent: { text: "New Heading", level: "h2" },
    },
    {
      type: "paragraph",
      name: "Paragraph",
      icon: AlignLeft,
      description: "Add a paragraph of text",
      defaultContent: { text: "New paragraph text goes here. Edit this text to add your own content." },
    },
    {
      type: "image",
      name: "Image",
      icon: ImageIcon,
      description: "Add an image to your section",
      defaultContent: {
        src: "/placeholder.svg?height=300&width=400",
        alt: "Placeholder image",
      },
    },
    {
      type: "button",
      name: "Button",
      icon: CreditCard,
      description: "Add a button with a link",
      defaultContent: {
        text: "Click Me",
        url: "#",
        variant: "default",
      },
    },
    {
      type: "list",
      name: "List",
      icon: ListChecks,
      description: "Add a bulleted or numbered list",
      defaultContent: {
        items: ["Item 1", "Item 2", "Item 3"],
        type: "bullet",
      },
    },
    {
      type: "form",
      name: "Form",
      icon: Check,
      description: "Add a contact or subscription form",
      defaultContent: {
        fields: [
          { name: "name", label: "Name", type: "text", required: true },
          { name: "email", label: "Email", type: "email", required: true },
          { name: "message", label: "Message", type: "textarea", required: false },
        ],
        submitText: "Submit",
        action: "#",
      },
    },
  ]

  return (
    <ScrollArea className="h-[300px] pr-3">
      <div className="grid grid-cols-1 gap-2">
        {elementTypes.map((element) => (
          <Card
            key={element.type}
            className={`cursor-pointer hover:bg-accent ${disabled ? "opacity-50 pointer-events-none" : ""}`}
            onClick={() => !disabled && onAddElement(element.type, element.defaultContent)}
          >
            <CardContent className="p-3 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                {element.icon && <element.icon className="h-5 w-5" />}
              </div>
              <div>
                <h4 className="text-sm font-medium">{element.name}</h4>
                <p className="text-xs text-muted-foreground">{element.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {disabled && (
        <p className="text-xs text-muted-foreground mt-2 text-center">Select a section first to add elements</p>
      )}
    </ScrollArea>
  )
}
