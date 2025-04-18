export type ElementType =
  | "image"
  | "header"
  | "paragraph"
  | "variant-selector"
  | "order-form"
  | "reviews"
  | "contact-form"
  | "features"
  | "faq"
  | "cta"
  | "specifications"
  | "related-products"
  | "newsletter"
  | "hero"

export interface PageElement {
  id: string
  type: ElementType
  content: {
    [key: string]: unknown
  }
  style: {
    [key: string]: unknown
  }
}

export interface Review {
  id: string
  name: string
  rating: number
  text: string
  date?: string
  photoUrl?: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
}

export interface Feature {
  id: string
  title: string
  description: string
  iconName?: string
}

export interface Specification {
  id: string
  name: string
  value: string
}

export interface ScreenSize {
  id: string
  name: string
  width: number
  icon: string
}
