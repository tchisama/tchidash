"use client";

import {
  ImageIcon,
  Type,
  AlignLeft,
  Grid3X3,
  FileText,
  Star,
  MessageSquare,
  ListChecks,
  HelpCircle,
  MousePointerClick,
  ClipboardList,
  Layers,
  Mail,
  LayoutGrid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ElementType } from "../types/elements";
import { Separator } from "@/components/ui/separator";

interface ElementsSidebarProps {
  onAddElement: (type: ElementType) => void;
}

export function ElementsSidebar({ onAddElement }: ElementsSidebarProps) {
  const elements = [
    {
      category: "Basic",
      items: [
        { type: "image" as ElementType, icon: ImageIcon, label: "Image" },
        { type: "header" as ElementType, icon: Type, label: "Header" },
        {
          type: "paragraph" as ElementType,
          icon: AlignLeft,
          label: "Paragraph",
        },
      ],
    },
    {
      category: "E-commerce",
      items: [
        {
          type: "hero" as ElementType,
          icon: LayoutGrid,
          label: "Hero Section",
        },
        {
          type: "variant-selector" as ElementType,
          icon: Grid3X3,
          label: "Product Variants",
        },
        {
          type: "order-form" as ElementType,
          icon: FileText,
          label: "Order Form",
        },
        {
          type: "features" as ElementType,
          icon: ListChecks,
          label: "Product Features",
        },
        {
          type: "specifications" as ElementType,
          icon: ClipboardList,
          label: "Specifications",
        },
        {
          type: "related-products" as ElementType,
          icon: Layers,
          label: "Related Products",
        },
      ],
    },
    {
      category: "Conversion",
      items: [
        { type: "reviews" as ElementType, icon: Star, label: "Reviews" },
        { type: "faq" as ElementType, icon: HelpCircle, label: "FAQ" },
        {
          type: "cta" as ElementType,
          icon: MousePointerClick,
          label: "Call to Action",
        },
        { type: "newsletter" as ElementType, icon: Mail, label: "Newsletter" },
        {
          type: "contact-form" as ElementType,
          icon: MessageSquare,
          label: "Contact Form",
        },
      ],
    },
  ];

  return (
    <div className="border-r bg-white h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Elements</h2>
        <p className="text-sm text-muted-foreground">
          Add elements to your page
        </p>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {elements.map((category) => (
            <div key={category.category} className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                {category.category}
              </h3>
              <div className="space-y-2">
                {category.items.map((element) => (
                  <Button
                    key={element.type}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => onAddElement(element.type)}
                  >
                    <element.icon className="mr-2 h-4 w-4" />
                    {element.label}
                  </Button>
                ))}
              </div>
              {category !== elements[elements.length - 1] && (
                <Separator className="my-2" />
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
