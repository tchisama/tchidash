export interface ProductVariant {
  id: string
  title: string
  price: number
  images: string[]
  inventoryQuantity: number
  sku: string
  status: string
  variantValues: {
    option: string
    value: string
  }[]
}

export interface ProductOption {
  name: string
  values: string[]
}

export interface Product {
  id: string
  title: string
  description: string
  price: number
  images: string[]
  options: ProductOption[]
  variants: ProductVariant[]
  hasDiscount: boolean
  status: string
  category?: string
} 