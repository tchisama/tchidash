"use client";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BarChart,
  FileQuestion,
  Grid3X3,
  Heading1,
  LayoutGrid,
  MessageSquare,
  Package,
  ShoppingBag,
  Users,
} from "lucide-react";
import { EnvelopeClosedIcon } from "@radix-ui/react-icons";

interface SectionLibraryProps {
  onAddSection: (type: string, name: string) => void;
}

export function SectionLibrary({ onAddSection }: SectionLibraryProps) {
  const sectionTypes = [
    {
      type: "hero",
      name: "Hero Section",
      icon: Heading1,
      description: "A large banner section typically at the top of a page",
    },
    {
      type: "features",
      name: "Features Section",
      icon: Grid3X3,
      description: "Showcase your product or service features",
    },
    {
      type: "testimonials",
      name: "Testimonials Section",
      icon: MessageSquare,
      description: "Display customer testimonials and reviews",
    },
    {
      type: "pricing",
      name: "Pricing Section",
      icon: Package,
      description: "Show your pricing plans and options",
    },
    {
      type: "faq",
      name: "FAQ Section",
      icon: FileQuestion,
      description: "Answer frequently asked questions",
    },
    {
      type: "contact",
      name: "Contact Section",
      icon: Mail,
      description: "Add a contact form or contact information",
    },
    {
      type: "products",
      name: "Products Section",
      icon: ShoppingBag,
      description: "Display your products in a grid or list",
    },
    {
      type: "cta",
      name: "Call to Action Section",
      icon: LayoutGrid,
      description: "Add a compelling call to action",
    },
    {
      type: "stats",
      name: "Statistics Section",
      icon: BarChart,
      description: "Showcase important statistics and numbers",
    },
    {
      type: "team",
      name: "Team Section",
      icon: Users,

      jj




      description: "Introduce your team members",
    },
  ];

  return (
    <ScrollArea className="h-[300px] pr-3">
      <div className="grid grid-cols-1 gap-2">
        {sectionTypes.map((section) => (
          <Card
            key={section.type}
            className="cursor-pointer hover:bg-accent"
            onClick={() => onAddSection(section.type, section.name)}
          >
            <CardContent className="p-3 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                <section.icon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-medium">{section.name}</h4>
                <p className="text-xs text-muted-foreground">
                  {section.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
