"use client"

import type React from "react"
import { Star } from "lucide-react"
import type { PageElement, Review } from "@/types/elements"
import Image from "next/image"

interface ReviewsElementProps {
  element: PageElement
}

export function ReviewsElement({ element }: ReviewsElementProps) {
  const { style, content } = element
  const reviews = content.reviews || []

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
    marginBottom: "24px",
    textAlign: (style.titleAlign as React.CSSProperties["textAlign"]) || "center",
  }

  const reviewStyle = {
    backgroundColor: style.reviewBgColor || "#f9fafb",
    borderRadius: `${style.reviewBorderRadius || 8}px`,
    padding: `${style.reviewPadding || 16}px`,
    marginBottom: `${style.reviewSpacing || 16}px`,
  }

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>{content.sectionTitle || "Customer Reviews"}</h2>

      {reviews.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">
          <p>No reviews yet. Be the first to review this product!</p>
        </div>
      ) : (
        <div>
          {reviews.map((review: Review) => (
            <div key={review.id} style={reviewStyle} className="last:mb-0">
              <div className="flex flex-col md:flex-row gap-4">
                {review.photoUrl && style.showPhotos !== false && (
                  <div className="md:w-1/4 flex-shrink-0">
                    <div className="relative rounded-md overflow-hidden border">
                      <Image
                        src={review.photoUrl || "/placeholder.svg"}
                        alt="Product image"
                        width={200}
                        height={200}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </div>
                )}
                <div className={review.photoUrl && style.showPhotos !== false ? "md:w-3/4" : "w-full"}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium text-lg">{review.name}</h3>
                      {review.date && <p className="text-sm text-muted-foreground">{review.date}</p>}
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${star <= review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700">{review.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
