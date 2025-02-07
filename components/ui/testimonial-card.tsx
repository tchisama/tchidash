"use client"

import * as React from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ReviewActions from "@/app/dashboard/(pages)/reviews/components/ReviewActions"
import Avvvatars from "avvvatars-react"
import MessageActions from "@/app/dashboard/(pages)/contacts/components/MessageActions"

export interface TestimonialProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  role: string
  company?: string
  testimonial: string
  rating?: number
  image?: string
  id: string
  type?: "message" | "review"
}

const Testimonial = React.forwardRef<HTMLDivElement, TestimonialProps>(
  ({ name, role, company ,type = "review",id, testimonial, rating = 5, image, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-2xl border border-primary/10 bg-background p-6 transition-all hover:shadow-lg dark:hover:shadow-primary/5 md:p-8",
          className
        )}
        {...props}
      >
        <div className="absolute right-2 bottom-2 ">
          {
            type === "message" ?
            <MessageActions id={id} />:
            <ReviewActions id={id} />
          }
        </div>
        <div className="absolute right-6 top-2 text-6xl font-serif text-muted-foreground/20">
          {'"'}
        </div>

        <div className="flex flex-col gap-4 justify-between h-full">
          {rating > 0 && type === "review" && (
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  size={16}
                  className={cn(
                    index < rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-muted text-muted"
                  )}
                />
              ))}
            </div>
          )}

          <p className="text-pretty text-base text-muted-foreground">
            {testimonial}
          </p>

          <div className="flex items-center gap-4 justify-start">
            <div className="flex items-center gap-4">
              {image ? (
                <Avatar>
                  <AvatarImage src={image} alt={name} height={48} width={48} />
                  <AvatarFallback>{name[0]}</AvatarFallback>
                </Avatar>
              ) : (
                <Avvvatars size={48} value={name} style="shape">
                </Avvvatars>
              )}

              <div className="flex flex-col">
                <h3 className="font-semibold text-foreground">{name}</h3>
                <p className="text-sm text-muted-foreground">
                  {role}
                  {company && ` @ ${company}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
)
Testimonial.displayName = "Testimonial"

export { Testimonial }