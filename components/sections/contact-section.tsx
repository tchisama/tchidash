"use client"

import type { Section } from "@/components/landing-page-builder"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone } from "lucide-react"
import { EnvelopeClosedIcon } from "@radix-ui/react-icons"

interface ContactSectionProps {
  section: Section
  selectedElementId: string | null
  onSelectElement: (elementId: string) => void
}

export function ContactSection({ section, selectedElementId, onSelectElement }: ContactSectionProps) {
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
        <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Have questions? We're here to help. Reach out to us using the form below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <div>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Your name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Your email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Your message" rows={5} />
            </div>
            <Button type="submit" className="w-full">
              Send Message
            </Button>
          </form>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Address</h4>
                  <p className="text-muted-foreground">123 Main Street, City, Country</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="h-5 w-5 mr-3 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Phone</h4>
                  <p className="text-muted-foreground">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start">
                <EnvelopeClosedIcon className="h-5 w-5 mr-3 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Email</h4>
                  <p className="text-muted-foreground">contact@example.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
