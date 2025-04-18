"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { PageElement, Review } from "../types/elements"
import { ImageStyleForm } from "./../components/style-forms/image-style-form"
import { HeaderStyleForm } from "./../components/style-forms/header-style-form"
import { ParagraphStyleForm } from "./../components/style-forms/paragraph-style-form"
import { VariantSelectorStyleForm } from "./../components/style-forms/variant-selector-style-form"
import { OrderFormStyleForm } from "./../components/style-forms/order-form-style-form"
import { ReviewsStyleForm } from "./../components/style-forms/reviews-style-form"
import { ContactFormStyleForm } from "./../components/style-forms/contact-form-style-form"
import { FeaturesStyleForm } from "./../components/style-forms/features-style-form"
import { FAQStyleForm } from "./../components/style-forms/faq-style-form"
import { CTAStyleForm } from "./../components/style-forms/cta-style-form"
import { SpecificationsStyleForm } from "./../components/style-forms/specifications-style-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Star, X, Upload } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { Switch } from "@/components/ui/switch"
import { ReviewForm } from "./../components/forms/review-form"
import FilesystemExplorer from "@/components/FilesystemExplorer"
import { HeroStyleForm } from "./style-forms/hero-style-form"
import { Slider } from "@/components/ui/slider"

interface StylePanelProps {
  selectedElement: PageElement | undefined
  onUpdateElement: (id: string, updates: Partial<PageElement>) => void
}

export function StylePanel({ selectedElement, onUpdateElement }: StylePanelProps) {
  const [activeTab, setActiveTab] = useState("style")
  const [showAddReview, setShowAddReview] = useState(false)
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null)

  if (!selectedElement) {
    return (
      <div className="border-l bg-white h-full p-4 flex items-center justify-center text-center text-muted-foreground overflow-hidden">
        <div>
          <p>Select an element to edit its properties</p>
        </div>
      </div>
    )
  }

  const renderStyleForm = () => {
    switch (selectedElement.type) {
      case "image":
        return (
          <ImageStyleForm
            element={selectedElement}
            onUpdate={(updates) => onUpdateElement(selectedElement.id, updates)}
          />
        )
      case "header":
        return (
          <HeaderStyleForm
            element={selectedElement}
            onUpdate={(updates) => onUpdateElement(selectedElement.id, updates)}
          />
        )
      case "paragraph":
        return (
          <ParagraphStyleForm
            element={selectedElement}
            onUpdate={(updates) => onUpdateElement(selectedElement.id, updates)}
          />
        )
      case "variant-selector":
        return (
          <VariantSelectorStyleForm
            element={selectedElement}
            onUpdate={(updates) => onUpdateElement(selectedElement.id, updates)}
          />
        )
      case "order-form":
        return (
          <OrderFormStyleForm
            element={selectedElement}
            onUpdate={(updates) => onUpdateElement(selectedElement.id, updates)}
          />
        )
      case "reviews":
        return (
          <ReviewsStyleForm
            element={selectedElement}
            onUpdate={(updates) => onUpdateElement(selectedElement.id, updates)}
          />
        )
      case "contact-form":
        return (
          <ContactFormStyleForm
            element={selectedElement}
            onUpdate={(updates) => onUpdateElement(selectedElement.id, updates)}
          />
        )
      case "features":
        return (
          <FeaturesStyleForm
            element={selectedElement}
            onUpdate={(updates) => onUpdateElement(selectedElement.id, updates)}
          />
        )
      case "faq":
        return (
          <FAQStyleForm
            element={selectedElement}
            onUpdate={(updates) => onUpdateElement(selectedElement.id, updates)}
          />
        )
      case "cta":
        return (
          <CTAStyleForm
            element={selectedElement}
            onUpdate={(updates) => onUpdateElement(selectedElement.id, updates)}
          />
        )
      case "specifications":
        return (
          <SpecificationsStyleForm
            element={selectedElement}
            onUpdate={(updates) => onUpdateElement(selectedElement.id, updates)}
          />
        )
      case "related-products":
        return (
          <div className="p-4 text-center text-muted-foreground">
            <p>Style options for Related Products element are coming soon.</p>
            <p className="mt-2">Please use the Content tab to customize this element.</p>
          </div>
        )
      case "newsletter":
        return (
          <div className="p-4 text-center text-muted-foreground">
            <p>Style options for Newsletter element are coming soon.</p>
            <p className="mt-2">Please use the Content tab to customize this element.</p>
          </div>
        )
      case "hero":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={selectedElement.content.title || ""}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    content: {
                      ...selectedElement.content,
                      title: e.target.value,
                    },
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Subtitle</Label>
              <Input
                value={selectedElement.content.subtitle || ""}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    content: {
                      ...selectedElement.content,
                      subtitle: e.target.value,
                    },
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Primary Button Text</Label>
              <Input
                value={selectedElement.content.buttonText || ""}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    content: {
                      ...selectedElement.content,
                      buttonText: e.target.value,
                    },
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Primary Button Link</Label>
              <Input
                value={selectedElement.content.buttonLink || ""}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    content: {
                      ...selectedElement.content,
                      buttonLink: e.target.value,
                    },
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Secondary Button Text</Label>
              <Input
                value={selectedElement.content.secondaryButtonText || ""}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    content: {
                      ...selectedElement.content,
                      secondaryButtonText: e.target.value,
                    },
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Secondary Button Link</Label>
              <Input
                value={selectedElement.content.secondaryButtonLink || ""}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    content: {
                      ...selectedElement.content,
                      secondaryButtonLink: e.target.value,
                    },
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Background Image</Label>
              <FilesystemExplorer
                callback={(url) =>
                  onUpdateElement(selectedElement.id, {
                    content: {
                      ...selectedElement.content,
                      backgroundImage: url,
                    },
                  })
                }
              >
                <Button variant="outline" className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  Choose Image
                </Button>
              </FilesystemExplorer>
            </div>

            <div className="space-y-2">
              <Label>Overlay Opacity</Label>
              <Slider
                value={[selectedElement.style.overlayOpacity || 0.5]}
                min={0}
                max={1}
                step={0.1}
                onValueChange={(value) =>
                  onUpdateElement(selectedElement.id, {
                    style: {
                      ...selectedElement.style,
                      overlayOpacity: value[0],
                    },
                  })
                }
              />
              <div className="text-right text-sm text-muted-foreground">
                {Math.round((selectedElement.style.overlayOpacity || 0.5) * 100)}%
              </div>
            </div>

            <HeroStyleForm 
              element={selectedElement} 
              onUpdate={(updates) => onUpdateElement(selectedElement.id, updates)} 
            />
          </div>
        )
      default:
        return null
    }
  }

  const renderContentForm = () => {
    switch (selectedElement.type) {
      case "image":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image-src">Image URL</Label>
              <Input
                id="image-src"
                type="text"
                value={selectedElement.content.src || ""}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    content: { ...selectedElement.content, src: e.target.value },
                  })
                }
                placeholder="Enter image URL"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image-alt">Alt Text</Label>
              <Input
                id="image-alt"
                type="text"
                value={selectedElement.content.alt || ""}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    content: { ...selectedElement.content, alt: e.target.value },
                  })
                }
                placeholder="Enter alt text"
              />
            </div>
          </div>
        )

      case "header":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="header-text">Header Text</Label>
              <Input
                id="header-text"
                type="text"
                value={selectedElement.content.text || ""}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    content: { ...selectedElement.content, text: e.target.value },
                  })
                }
                placeholder="Enter header text"
              />
            </div>
          </div>
        )

      case "paragraph":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="paragraph-text">Paragraph Text</Label>
              <Textarea
                id="paragraph-text"
                value={selectedElement.content.text || ""}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    content: { ...selectedElement.content, text: e.target.value },
                  })
                }
                placeholder="Enter paragraph text"
                className="min-h-[150px]"
              />
            </div>
          </div>
        )

      case "variant-selector":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="variant-title">Custom Product Title (leave empty to use product title)</Label>
              <Input
                id="variant-title"
                type="text"
                value={selectedElement.content.customTitle || ""}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    content: { ...selectedElement.content, customTitle: e.target.value },
                  })
                }
                placeholder="Enter custom product title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="option-name">Custom Option Name (leave empty to use product option name)</Label>
              <Input
                id="option-name"
                type="text"
                value={selectedElement.content.customOptionName || ""}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    content: { ...selectedElement.content, customOptionName: e.target.value },
                  })
                }
                placeholder="Enter custom option name"
              />
            </div>
          </div>
        )

      case "order-form":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="form-title">Form Title</Label>
              <Input
                id="form-title"
                type="text"
                value={selectedElement.content.customTitle || ""}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    content: { ...selectedElement.content, customTitle: e.target.value },
                  })
                }
                placeholder="Enter form title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="button-text">Button Text</Label>
              <Input
                id="button-text"
                type="text"
                value={selectedElement.content.customButtonText || ""}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    content: { ...selectedElement.content, customButtonText: e.target.value },
                  })
                }
                placeholder="Enter button text"
              />
            </div>
          </div>
        )

      case "reviews":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reviews-title">Section Title</Label>
              <Input
                id="reviews-title"
                type="text"
                value={selectedElement.content.sectionTitle || "Customer Reviews"}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    content: { ...selectedElement.content, sectionTitle: e.target.value },
                  })
                }
                placeholder="Enter section title"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-photos">Show Product Photos</Label>
                <Switch
                  id="show-photos"
                  checked={selectedElement.style.showPhotos !== false}
                  onCheckedChange={(checked) =>
                    onUpdateElement(selectedElement.id, {
                      style: { ...selectedElement.style, showPhotos: checked },
                    })
                  }
                />
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Reviews</h3>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-1"
                  onClick={() => {
                    setShowAddReview(true)
                    setEditingReviewId(null)
                  }}
                >
                  <Plus className="h-4 w-4" /> Add Review
                </Button>
              </div>

              {showAddReview && !editingReviewId && (
                <div className="mb-6 border rounded-md p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">Add New Review</h4>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setShowAddReview(false)}>
                      <X className="h-4 w-4" />
                      <span className="sr-only">Cancel</span>
                    </Button>
                  </div>

                  <ReviewForm
                    onSubmit={(review) => {
                      const updatedReviews = [
                        ...(selectedElement.content.reviews || []),
                        {
                          ...review,
                          id: uuidv4(),
                        },
                      ]

                      onUpdateElement(selectedElement.id, {
                        content: { ...selectedElement.content, reviews: updatedReviews },
                      })

                      setShowAddReview(false)
                    }}
                    onCancel={() => setShowAddReview(false)}
                  />
                </div>
              )}

              <div className="space-y-6">
                {selectedElement.content.reviews?.map((review: Review, index: number) => (
                  <div key={review.id} className="border rounded-md p-4 space-y-3">
                    {editingReviewId === review.id ? (
                      <>
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium">Edit Review</h4>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => setEditingReviewId(null)}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Cancel</span>
                          </Button>
                        </div>

                        <ReviewForm
                          initialData={review}
                          onSubmit={(updatedReview) => {
                            const updatedReviews = selectedElement.content.reviews.map((r: Review) =>
                              r.id === review.id ? { ...updatedReview, id: review.id } : r,
                            )

                            onUpdateElement(selectedElement.id, {
                              content: { ...selectedElement.content, reviews: updatedReviews },
                            })

                            setEditingReviewId(null)
                          }}
                          onCancel={() => setEditingReviewId(null)}
                        />
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Review #{index + 1}</h4>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={() => setEditingReviewId(review.id)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-pencil"
                              >
                                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                <path d="m15 5 4 4" />
                              </svg>
                              <span className="sr-only">Edit review</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-destructive"
                              onClick={() => {
                                const updatedReviews = selectedElement.content.reviews.filter(
                                  (r: Review) => r.id !== review.id,
                                )
                                onUpdateElement(selectedElement.id, {
                                  content: { ...selectedElement.content, reviews: updatedReviews },
                                })
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete review</span>
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                          <div className="font-medium">Name:</div>
                          <div>{review.name}</div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="font-medium">Rating:</div>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <div className="font-medium">Review:</div>
                          <div className="text-sm">{review.text}</div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="font-medium">Date:</div>
                          <div>{review.date}</div>
                        </div>

                        {review.photoUrl && (
                          <div className="space-y-1">
                            <div className="font-medium">Product Photo:</div>
                            <div className="relative h-32 w-32 rounded-md overflow-hidden border">
                              <img
                                src={review.photoUrl || "/placeholder.svg"}
                                alt="Product photo"
                                className="object-cover h-full w-full"
                              />
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case "contact-form":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contact-title">Section Title</Label>
              <Input
                id="contact-title"
                type="text"
                value={selectedElement.content.sectionTitle || "Contact Us"}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    content: { ...selectedElement.content, sectionTitle: e.target.value },
                  })
                }
                placeholder="Enter section title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-subtitle">Subtitle</Label>
              <Input
                id="contact-subtitle"
                type="text"
                value={selectedElement.content.subtitle || "Have questions? We're here to help!"}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    content: { ...selectedElement.content, subtitle: e.target.value },
                  })
                }
                placeholder="Enter subtitle text"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-button">Button Text</Label>
              <Input
                id="contact-button"
                type="text"
                value={selectedElement.content.buttonText || "Send Message"}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    content: { ...selectedElement.content, buttonText: e.target.value },
                  })
                }
                placeholder="Enter button text"
              />
            </div>
          </div>
        )

      case "features":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="features-title">Section Title</Label>
              <Input
                id="features-title"
                type="text"
                value={selectedElement.content.sectionTitle || "Product Features"}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    content: { ...selectedElement.content, sectionTitle: e.target.value },
                  })
                }
                placeholder="Enter section title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="features-subtitle">Subtitle</Label>
              <Input
                id="features-subtitle"
                type="text"
                value={selectedElement.content.subtitle || "Why our product stands out from the rest"}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    content: { ...selectedElement.content, subtitle: e.target.value },
                  })
                }
                placeholder="Enter subtitle text"
              />
            </div>
            <p className="text-sm text-muted-foreground mt-4">Feature editing will be available in the next update.</p>
          </div>
        )

      case "faq":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="faq-title">Section Title</Label>
              <Input
                id="faq-title"
                type="text"
                value={selectedElement.content.sectionTitle || "Frequently Asked Questions"}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    content: { ...selectedElement.content, sectionTitle: e.target.value },
                  })
                }
                placeholder="Enter section title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="faq-subtitle">Subtitle</Label>
              <Input
                id="faq-subtitle"
                type="text"
                value={selectedElement.content.subtitle || "Find answers to common questions about our product"}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    content: { ...selectedElement.content, subtitle: e.target.value },
                  })
                }
                placeholder="Enter subtitle text"
              />
            </div>
            <p className="text-sm text-muted-foreground mt-4">FAQ item editing will be available in the next update.</p>
          </div>
        )

      case "cta":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cta-title">Title</Label>
              <Input
                id="cta-title"
                type="text"
                value={selectedElement.content.title || "Ready to Experience the Difference?"}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    content: { ...selectedElement.content, title: e.target.value },
                  })
                }
                placeholder="Enter title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cta-subtitle">Subtitle</Label>
              <Input
                id="cta-subtitle"
                type="text"
                value={
                  selectedElement.content.subtitle ||
                  "Join thousands of satisfied customers who have upgraded their lifestyle."
                }
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    content: { ...selectedElement.content, subtitle: e.target.value },
                  })
                }
                placeholder="Enter subtitle text"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cta-button-text">Primary Button Text</Label>
              <Input
                id="cta-button-text"
                type="text"
                value={selectedElement.content.buttonText || "Shop Now"}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    content: { ...selectedElement.content, buttonText: e.target.value },
                  })
                }
                placeholder="Enter button text"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cta-button-link">Primary Button Link</Label>
              <Input
                id="cta-button-link"
                type="text"
                value={selectedElement.content.buttonLink || "#"}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    content: { ...selectedElement.content, buttonLink: e.target.value },
                  })
                }
                placeholder="Enter button link"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cta-secondary-button-text">Secondary Button Text (optional)</Label>
              <Input
                id="cta-secondary-button-text"
                type="text"
                value={selectedElement.content.secondaryButtonText || "Learn More"}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    content: { ...selectedElement.content, secondaryButtonText: e.target.value },
                  })
                }
                placeholder="Enter secondary button text"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cta-secondary-button-link">Secondary Button Link</Label>
              <Input
                id="cta-secondary-button-link"
                type="text"
                value={selectedElement.content.secondaryButtonLink || "#"}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    content: { ...selectedElement.content, secondaryButtonLink: e.target.value },
                  })
                }
                placeholder="Enter secondary button link"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cta-bg-image">Background Image URL (optional)</Label>
              <Input
                id="cta-bg-image"
                type="text"
                value={selectedElement.content.backgroundImage || ""}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    content: { ...selectedElement.content, backgroundImage: e.target.value },
                  })
                }
                placeholder="Enter background image URL"
              />
            </div>
          </div>
        )

      case "specifications":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="specs-title">Section Title</Label>
              <Input
                id="specs-title"
                type="text"
                value={selectedElement.content.sectionTitle || "Product Specifications"}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    content: { ...selectedElement.content, sectionTitle: e.target.value },
                  })
                }
                placeholder="Enter section title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specs-subtitle">Subtitle</Label>
              <Input
                id="specs-subtitle"
                type="text"
                value={selectedElement.content.subtitle || "Technical details and dimensions"}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    content: { ...selectedElement.content, subtitle: e.target.value },
                  })
                }
                placeholder="Enter subtitle text"
              />
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Specification item editing will be available in the next update.
            </p>
          </div>
        )

      case "related-products":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="related-title">Section Title</Label>
              <Input
                id="related-title"
                type="text"
                value={selectedElement.content.sectionTitle || "You May Also Like"}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    content: { ...selectedElement.content, sectionTitle: e.target.value },
                  })
                }
                placeholder="Enter section title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="related-subtitle">Subtitle</Label>
              <Input
                id="related-subtitle"
                type="text"
                value={selectedElement.content.subtitle || "Customers who bought this item also purchased"}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    content: { ...selectedElement.content, subtitle: e.target.value },
                  })
                }
                placeholder="Enter subtitle text"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="related-button-text">Button Text</Label>
              <Input
                id="related-button-text"
                type="text"
                value={selectedElement.content.buttonText || "View Product"}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    content: { ...selectedElement.content, buttonText: e.target.value },
                  })
                }
                placeholder="Enter button text"
              />
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Related product editing will be available in the next update.
            </p>
          </div>
        )

      case "newsletter":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newsletter-title">Section Title</Label>
              <Input
                id="newsletter-title"
                type="text"
                value={selectedElement.content.sectionTitle || "Stay Updated"}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    content: { ...selectedElement.content, sectionTitle: e.target.value },
                  })
                }
                placeholder="Enter section title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newsletter-subtitle">Subtitle</Label>
              <Input
                id="newsletter-subtitle"
                type="text"
                value={
                  selectedElement.content.subtitle || "Subscribe to our newsletter for exclusive offers and updates"
                }
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    content: { ...selectedElement.content, subtitle: e.target.value },
                  })
                }
                placeholder="Enter subtitle text"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newsletter-button-text">Button Text</Label>
              <Input
                id="newsletter-button-text"
                type="text"
                value={selectedElement.content.buttonText || "Subscribe"}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    content: { ...selectedElement.content, buttonText: e.target.value },
                  })
                }
                placeholder="Enter button text"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newsletter-placeholder">Input Placeholder</Label>
              <Input
                id="newsletter-placeholder"
                type="text"
                value={selectedElement.content.placeholderText || "Enter your email"}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    content: { ...selectedElement.content, placeholderText: e.target.value },
                  })
                }
                placeholder="Enter placeholder text"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newsletter-success">Success Message</Label>
              <Input
                id="newsletter-success"
                type="text"
                value={selectedElement.content.successMessage || "Thank you for subscribing!"}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    content: { ...selectedElement.content, successMessage: e.target.value },
                  })
                }
                placeholder="Enter success message"
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="border-l bg-white h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Element Properties</h2>
        <p className="text-sm text-muted-foreground">Customize the selected element</p>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="style"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Style
            </TabsTrigger>
            <TabsTrigger
              value="content"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Content
            </TabsTrigger>
          </TabsList>
        </div>
        <ScrollArea className="flex-1 max-h-[80vh]">
          <TabsContent value="style" className="p-4 m-0">
            {renderStyleForm()}
          </TabsContent>
          <TabsContent value="content" className="p-4 m-0">
            {renderContentForm()}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  )
}
