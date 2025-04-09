"use client"

import { useState } from "react"
import type { Section, Element } from "@/components/landing-page-builder"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ColorPicker } from "@/components/color-picker"
import { Trash2 } from "lucide-react"

interface ElementEditorProps {
  section: Section | undefined
  element: Element | undefined
  onUpdateSection: (updates: Partial<Section>) => void
  onUpdateElement: (updates: Partial<Element>) => void
  onRemoveElement: () => void
}

export function ElementEditor({
  section,
  element,
  onUpdateSection,
  onUpdateElement,
  onRemoveElement,
}: ElementEditorProps) {
  const [activeTab, setActiveTab] = useState("content")

  if (!section) {
    return (
      <div className="p-4">
        <p className="text-muted-foreground">Select a section to edit</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium">{element ? "Element Properties" : "Section Properties"}</h3>
        {element && (
          <Button size="sm" variant="destructive" onClick={onRemoveElement}>
            <Trash2 className="mr-1 h-4 w-4" />
            Remove
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4 pt-4">
          {!element ? (
            // Section content editor
            <>
              <div className="space-y-2">
                <Label htmlFor="section-name">Section Name</Label>
                <Input
                  id="section-name"
                  value={section.name}
                  onChange={(e) => onUpdateSection({ name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="section-type">Section Type</Label>
                <Select value={section.type} onValueChange={(value) => onUpdateSection({ type: value })}>
                  <SelectTrigger id="section-type">
                    <SelectValue placeholder="Select section type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hero">Hero</SelectItem>
                    <SelectItem value="features">Features</SelectItem>
                    <SelectItem value="testimonials">Testimonials</SelectItem>
                    <SelectItem value="pricing">Pricing</SelectItem>
                    <SelectItem value="faq">FAQ</SelectItem>
                    <SelectItem value="contact">Contact</SelectItem>
                    <SelectItem value="products">Products</SelectItem>
                    <SelectItem value="cta">Call to Action</SelectItem>
                    <SelectItem value="stats">Statistics</SelectItem>
                    <SelectItem value="team">Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : (
            // Element content editor
            <>
              {element.type === "heading" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="heading-text">Heading Text</Label>
                    <Input
                      id="heading-text"
                      value={element.content.text || ""}
                      onChange={(e) =>
                        onUpdateElement({
                          content: { ...element.content, text: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heading-level">Heading Level</Label>
                    <Select
                      value={element.content.level || "h2"}
                      onValueChange={(value) =>
                        onUpdateElement({
                          content: { ...element.content, level: value },
                        })
                      }
                    >
                      <SelectTrigger id="heading-level">
                        <SelectValue placeholder="Select heading level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="h1">H1</SelectItem>
                        <SelectItem value="h2">H2</SelectItem>
                        <SelectItem value="h3">H3</SelectItem>
                        <SelectItem value="h4">H4</SelectItem>
                        <SelectItem value="h5">H5</SelectItem>
                        <SelectItem value="h6">H6</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {element.type === "paragraph" && (
                <div className="space-y-2">
                  <Label htmlFor="paragraph-text">Paragraph Text</Label>
                  <Textarea
                    id="paragraph-text"
                    rows={4}
                    value={element.content.text || ""}
                    onChange={(e) =>
                      onUpdateElement({
                        content: { ...element.content, text: e.target.value },
                      })
                    }
                  />
                </div>
              )}

              {element.type === "image" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="image-src">Image URL</Label>
                    <Input
                      id="image-src"
                      value={element.content.src || ""}
                      onChange={(e) =>
                        onUpdateElement({
                          content: { ...element.content, src: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image-alt">Alt Text</Label>
                    <Input
                      id="image-alt"
                      value={element.content.alt || ""}
                      onChange={(e) =>
                        onUpdateElement({
                          content: { ...element.content, alt: e.target.value },
                        })
                      }
                    />
                  </div>
                </>
              )}

              {element.type === "button" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="button-text">Button Text</Label>
                    <Input
                      id="button-text"
                      value={element.content.text || ""}
                      onChange={(e) =>
                        onUpdateElement({
                          content: { ...element.content, text: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="button-url">Button URL</Label>
                    <Input
                      id="button-url"
                      value={element.content.url || ""}
                      onChange={(e) =>
                        onUpdateElement({
                          content: { ...element.content, url: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="button-variant">Button Style</Label>
                    <Select
                      value={element.content.variant || "default"}
                      onValueChange={(value) =>
                        onUpdateElement({
                          content: { ...element.content, variant: value },
                        })
                      }
                    >
                      <SelectTrigger id="button-variant">
                        <SelectValue placeholder="Select button style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="secondary">Secondary</SelectItem>
                        <SelectItem value="outline">Outline</SelectItem>
                        <SelectItem value="ghost">Ghost</SelectItem>
                        <SelectItem value="link">Link</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {element.type === "form" && (
                <div className="space-y-2">
                  <Label htmlFor="form-action">Form Action URL</Label>
                  <Input
                    id="form-action"
                    value={element.content.action || ""}
                    onChange={(e) =>
                      onUpdateElement({
                        content: { ...element.content, action: e.target.value },
                      })
                    }
                  />
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="style" className="space-y-4 pt-4">
          {!element ? (
            // Section style editor
            <>
              <div className="space-y-2">
                <Label htmlFor="section-padding">Padding</Label>
                <Select
                  value={section.props?.padding || "default"}
                  onValueChange={(value) =>
                    onUpdateSection({
                      props: { ...section.props, padding: value },
                    })
                  }
                >
                  <SelectTrigger id="section-padding">
                    <SelectValue placeholder="Select padding" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                    <SelectItem value="xl">Extra Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="section-bg">Background Color</Label>
                <ColorPicker
                  id="section-bg"
                  value={section.props?.backgroundColor || "#ffffff"}
                  onChange={(value) =>
                    onUpdateSection({
                      props: { ...section.props, backgroundColor: value },
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="section-text-color">Text Color</Label>
                <ColorPicker
                  id="section-text-color"
                  value={section.props?.textColor || "#000000"}
                  onChange={(value) =>
                    onUpdateSection({
                      props: { ...section.props, textColor: value },
                    })
                  }
                />
              </div>
            </>
          ) : (
            // Element style editor
            <>
              <div className="space-y-2">
                <Label htmlFor="element-margin">Margin</Label>
                <Select
                  value={element.props?.margin || "default"}
                  onValueChange={(value) =>
                    onUpdateElement({
                      props: { ...element.props, margin: value },
                    })
                  }
                >
                  <SelectTrigger id="element-margin">
                    <SelectValue placeholder="Select margin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="element-text-align">Text Alignment</Label>
                <Select
                  value={element.props?.textAlign || "left"}
                  onValueChange={(value) =>
                    onUpdateElement({
                      props: { ...element.props, textAlign: value },
                    })
                  }
                >
                  <SelectTrigger id="element-text-align">
                    <SelectValue placeholder="Select text alignment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                    <SelectItem value="justify">Justify</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(element.type === "heading" || element.type === "paragraph") && (
                <div className="space-y-2">
                  <Label htmlFor="element-text-color">Text Color</Label>
                  <ColorPicker
                    id="element-text-color"
                    value={element.props?.color || "#000000"}
                    onChange={(value) =>
                      onUpdateElement({
                        props: { ...element.props, color: value },
                      })
                    }
                  />
                </div>
              )}

              {element.type === "heading" && (
                <div className="space-y-2">
                  <Label htmlFor="element-font-weight">Font Weight</Label>
                  <Select
                    value={element.props?.fontWeight || "bold"}
                    onValueChange={(value) =>
                      onUpdateElement({
                        props: { ...element.props, fontWeight: value },
                      })
                    }
                  >
                    <SelectTrigger id="element-font-weight">
                      <SelectValue placeholder="Select font weight" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="semibold">Semibold</SelectItem>
                      <SelectItem value="bold">Bold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
