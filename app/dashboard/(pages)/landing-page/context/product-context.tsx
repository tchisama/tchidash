"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { fetchProducts } from "../lib/api"
import { useStore } from "@/store/storeInfos"

export interface ProductVariant {
  id: string
  title: string
  price: number
  images: string[]
  inventoryQuantity: number
  sku: string
  variantValues: Array<{
    option: string
    value: string
  }>
  [key: string]: any
}

export interface Product {
  id: string
  title: string
  description: string
  price: number
  images: string[]
  options: Array<{
    name: string
    values: string[]
  }>
  variants: ProductVariant[]
  [key: string]: any
}

interface ProductContextType {
  products: Product[]
  selectedProduct: Product | null
  setSelectedProduct: (product: Product | null) => void
  selectedVariant: ProductVariant | null
  setSelectedVariant: (variant: ProductVariant | null) => void
  quantity: number
  setQuantity: (quantity: number) => void
  loading: boolean
  error: string | null
  getTotalPrice: () => number
  getFullProductTitle: () => string
}

const ProductContext = createContext<ProductContextType>({
  products: [],
  selectedProduct: null,
  setSelectedProduct: () => {},
  selectedVariant: null,
  setSelectedVariant: () => {},
  quantity: 1,
  setQuantity: () => {},
  loading: false,
  error: null,
  getTotalPrice: () => 0,
  getFullProductTitle: () => "",
})

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Update selected variant when product changes
  useEffect(() => {
    if (selectedProduct && selectedProduct.variants && selectedProduct.variants.length > 0) {
      setSelectedVariant(selectedProduct.variants[0])
    } else {
      setSelectedVariant(null)
    }
    // Reset quantity when product changes
    setQuantity(1)
  }, [selectedProduct])

  // Calculate total price based on selected variant and quantity
  const getTotalPrice = () => {
    if (!selectedVariant) return 0
    return selectedVariant.price * quantity
  }

  // Get full product title with variant
  const getFullProductTitle = () => {
    if (!selectedProduct) return ""
    if (!selectedVariant) return selectedProduct.title
    return `${selectedProduct.title} - ${selectedVariant.title}`
  }

  const {storeId} = useStore()

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true)
        const data = await fetchProducts({storeId: storeId??""})

        // Ensure data is an array before setting it
        const productsArray = Array.isArray(data) ? data : []
        setProducts(productsArray)

        // Set the first product as selected by default if available
        if (productsArray.length > 0) {
          setSelectedProduct(productsArray[0])
          // Also set the first variant if available
          if (productsArray[0].variants && productsArray[0].variants.length > 0) {
            setSelectedVariant(productsArray[0].variants[0])
          }
        }
      } catch (err) {
        setError("Failed to load products")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  return (
    <ProductContext.Provider
      value={{
        products,
        selectedProduct,
        setSelectedProduct,
        selectedVariant,
        setSelectedVariant,
        quantity,
        setQuantity,
        loading,
        error,
        getTotalPrice,
        getFullProductTitle,
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

export function useProduct() {
  return useContext(ProductContext)
}
