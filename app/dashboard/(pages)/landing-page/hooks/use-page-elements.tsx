"use client"

import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import type { PageElement, ElementType, Review, FAQ, Feature, Specification } from "./../types/elements"

export function usePageElements() {
  const [elements, setElements] = useState<PageElement[]>([])
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)

  const addElement = (type: ElementType) => {
    const newElement: PageElement = {
      id: uuidv4(),
      type,
      content: {},
      style: {},
    }

    // Set default content and style based on element type
    switch (type) {
      case "image":
        newElement.content = {
          src: "/placeholder.svg?height=400&width=600",
          alt: "Image",
        }
        newElement.style = {
          height: 300,
          maxWidth: 600,
          objectFit: "cover",
          imageBorderRadius: 0,
          padding: 0,
          margin: 16,
          backgroundColor: "transparent",
          borderWidth: 0,
          borderColor: "#e5e7eb",
        }
        break
      case "header":
        newElement.content = {
          text: "Header Text",
        }
        newElement.style = {
          fontSize: 24,
          fontWeight: "bold",
          textAlign: "left",
          textColor: "#000000",
          lineHeight: "1.2",
          padding: 0,
          margin: 16,
          backgroundColor: "transparent",
          borderWidth: 0,
          borderColor: "#e5e7eb",
        }
        break
      case "paragraph":
        newElement.content = {
          text: "Paragraph text goes here. Edit this text in the content panel.",
        }
        newElement.style = {
          fontSize: 16,
          fontWeight: "normal",
          textAlign: "left",
          textColor: "#000000",
          lineHeight: "1.5",
          padding: 0,
          margin: 16,
          backgroundColor: "transparent",
          borderWidth: 0,
          borderColor: "#e5e7eb",
        }
        break
      case "variant-selector":
        newElement.content = {
          customTitle: "",
          customOptionName: "",
        }
        newElement.style = {
          titleFontSize: 18,
          titleFontWeight: "bold",
          titleColor: "#000000",
          titleMarginBottom: 16,
          backgroundColor: "#f9fafb",
          padding: 16,
          margin: 16,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "#e5e7eb",
        }
        break
      case "order-form":
        newElement.content = {
          customTitle: "Your Information",
          customButtonText: "Place Order",
        }
        newElement.style = {
          title: "Your Information",
          titleFontSize: 20,
          titleFontWeight: "bold",
          titleAlign: "left",
          titleColor: "#000000",
          titleMarginBottom: 16,
          buttonText: "Place Order",
          buttonColor: "#000000",
          buttonTextColor: "#ffffff",
          backgroundColor: "#ffffff",
          padding: 16,
          margin: 16,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "#e5e7eb",
        }
        break
      case "reviews":
        newElement.content = {
          sectionTitle: "Customer Reviews",
          reviews: [
            {
              id: uuidv4(),
              name: "John Doe",
              rating: 5,
              text: "This product exceeded my expectations. The quality is outstanding and it arrived earlier than expected.",
              date: "2023-05-15",
              photoUrl: "",
            },
            {
              id: uuidv4(),
              name: "Jane Smith",
              rating: 4,
              text: "Great product for the price. Would definitely recommend to friends and family.",
              date: "2023-06-22",
              photoUrl: "/placeholder.svg?height=100&width=100",
            },
          ] as Review[],
        }
        newElement.style = {
          titleFontSize: 24,
          titleFontWeight: "bold",
          titleColor: "#000000",
          titleAlign: "center",
          backgroundColor: "#ffffff",
          padding: 24,
          margin: 16,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "#e5e7eb",
          reviewSpacing: 16,
          reviewBgColor: "#f9fafb",
          reviewBorderRadius: 8,
          reviewPadding: 16,
          showPhotos: true,
        }
        break
      case "contact-form":
        newElement.content = {
          sectionTitle: "Contact Us",
          subtitle: "Have questions? We're here to help!",
          buttonText: "Send Message",
        }
        newElement.style = {
          titleFontSize: 24,
          titleFontWeight: "bold",
          titleColor: "#000000",
          titleAlign: "center",
          subtitleFontSize: 16,
          subtitleColor: "#6b7280",
          backgroundColor: "#ffffff",
          padding: 24,
          margin: 16,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "#e5e7eb",
          buttonColor: "#000000",
          buttonTextColor: "#ffffff",
        }
        break
      case "features":
        newElement.content = {
          sectionTitle: "Product Features",
          subtitle: "Why our product stands out from the rest",
          features: [
            {
              id: uuidv4(),
              title: "Premium Quality",
              description: "Made with the finest materials for durability and performance.",
              iconName: "Shield",
            },
            {
              id: uuidv4(),
              title: "Easy to Use",
              description: "Intuitive design makes it simple for anyone to use right away.",
              iconName: "ThumbsUp",
            },
            {
              id: uuidv4(),
              title: "Versatile",
              description: "Multiple uses in various situations to meet all your needs.",
              iconName: "Layers",
            },
          ] as Feature[],
        }
        newElement.style = {
          titleFontSize: 24,
          titleFontWeight: "bold",
          titleColor: "#000000",
          titleAlign: "center",
          subtitleFontSize: 16,
          subtitleColor: "#6b7280",
          subtitleAlign: "center",
          backgroundColor: "#ffffff",
          padding: 24,
          margin: 16,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "#e5e7eb",
          featureSpacing: 16,
          featureTitleSize: 18,
          featureTitleColor: "#000000",
          featureTextSize: 14,
          featureTextColor: "#6b7280",
          iconColor: "#000000",
          columns: 3,
        }
        break
      case "faq":
        newElement.content = {
          sectionTitle: "Frequently Asked Questions",
          subtitle: "Find answers to common questions about our product",
          faqs: [
            {
              id: uuidv4(),
              question: "How long does shipping take?",
              answer:
                "Standard shipping takes 3-5 business days within the continental US. Express shipping options are available at checkout.",
            },
            {
              id: uuidv4(),
              question: "What is your return policy?",
              answer:
                "We offer a 30-day satisfaction guarantee. If you're not completely satisfied, you can return your purchase for a full refund within 30 days of delivery.",
            },
            {
              id: uuidv4(),
              question: "Is this product covered by warranty?",
              answer:
                "Yes, all our products come with a 1-year manufacturer's warranty that covers defects in materials and workmanship.",
            },
          ] as FAQ[],
        }
        newElement.style = {
          titleFontSize: 24,
          titleFontWeight: "bold",
          titleColor: "#000000",
          titleAlign: "center",
          subtitleFontSize: 16,
          subtitleColor: "#6b7280",
          subtitleAlign: "center",
          backgroundColor: "#ffffff",
          padding: 24,
          margin: 16,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "#e5e7eb",
          questionFontSize: 16,
          questionFontWeight: "medium",
          questionColor: "#000000",
          answerFontSize: 14,
          answerColor: "#6b7280",
          itemSpacing: 8,
          itemBgColor: "#f9fafb",
          itemBorderRadius: 8,
          itemPadding: 16,
        }
        break
      case "cta":
        newElement.content = {
          title: "Ready to Experience the Difference?",
          subtitle: "Join thousands of satisfied customers who have upgraded their lifestyle.",
          buttonText: "Shop Now",
          buttonLink: "#",
          secondaryButtonText: "Learn More",
          secondaryButtonLink: "#",
        }
        newElement.style = {
          titleFontSize: 28,
          titleFontWeight: "bold",
          titleColor: "#ffffff",
          titleAlign: "center",
          subtitleFontSize: 16,
          subtitleColor: "#f9fafb",
          subtitleAlign: "center",
          backgroundColor: "#000000",
          backgroundImage: "",
          backgroundOverlay: "rgba(0, 0, 0, 0.5)",
          padding: 48,
          margin: 16,
          borderRadius: 8,
          borderWidth: 0,
          borderColor: "#e5e7eb",
          buttonColor: "#ffffff",
          buttonTextColor: "#000000",
          secondaryButtonColor: "transparent",
          secondaryButtonTextColor: "#ffffff",
          secondaryButtonBorderColor: "#ffffff",
        }
        break
      case "specifications":
        newElement.content = {
          sectionTitle: "Product Specifications",
          subtitle: "Technical details and dimensions",
          specifications: [
            {
              id: uuidv4(),
              name: "Dimensions",
              value: '10" x 5" x 2"',
            },
            {
              id: uuidv4(),
              name: "Weight",
              value: "1.5 lbs",
            },
            {
              id: uuidv4(),
              name: "Material",
              value: "Premium Leather",
            },
            {
              id: uuidv4(),
              name: "Color Options",
              value: "Black, Brown, White",
            },
            {
              id: uuidv4(),
              name: "Warranty",
              value: "1 Year Limited",
            },
          ] as Specification[],
        }
        newElement.style = {
          titleFontSize: 24,
          titleFontWeight: "bold",
          titleColor: "#000000",
          titleAlign: "center",
          subtitleFontSize: 16,
          subtitleColor: "#6b7280",
          subtitleAlign: "center",
          backgroundColor: "#ffffff",
          padding: 24,
          margin: 16,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "#e5e7eb",
          rowBgColor: "#f9fafb",
          altRowBgColor: "#ffffff",
          nameFontSize: 14,
          nameFontWeight: "medium",
          nameColor: "#000000",
          valueFontSize: 14,
          valueColor: "#6b7280",
        }
        break
      case "related-products":
        newElement.content = {
          sectionTitle: "You May Also Like",
          subtitle: "Customers who bought this item also purchased",
          showProductImages: true,
          showProductPrices: true,
          showProductButtons: true,
          buttonText: "View Product",
          products: [
            {
              id: uuidv4(),
              title: "Premium Wallet",
              price: 49.99,
              image: "/placeholder.svg?height=200&width=200",
              link: "#",
            },
            {
              id: uuidv4(),
              title: "Leather Belt",
              price: 29.99,
              image: "/placeholder.svg?height=200&width=200",
              link: "#",
            },
            {
              id: uuidv4(),
              title: "Card Holder",
              price: 19.99,
              image: "/placeholder.svg?height=200&width=200",
              link: "#",
            },
          ],
        }
        newElement.style = {
          titleFontSize: 24,
          titleFontWeight: "bold",
          titleColor: "#000000",
          titleAlign: "center",
          subtitleFontSize: 16,
          subtitleColor: "#6b7280",
          subtitleAlign: "center",
          backgroundColor: "#ffffff",
          padding: 24,
          margin: 16,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "#e5e7eb",
          productBgColor: "#ffffff",
          productBorderRadius: 8,
          productBorderWidth: 1,
          productBorderColor: "#e5e7eb",
          productTitleSize: 16,
          productTitleColor: "#000000",
          productPriceSize: 14,
          productPriceColor: "#6b7280",
          buttonColor: "#000000",
          buttonTextColor: "#ffffff",
          columns: 3,
        }
        break
      case "newsletter":
        newElement.content = {
          sectionTitle: "Stay Updated",
          subtitle: "Subscribe to our newsletter for exclusive offers and updates",
          buttonText: "Subscribe",
          placeholderText: "Enter your email",
          successMessage: "Thank you for subscribing!",
        }
        newElement.style = {
          titleFontSize: 24,
          titleFontWeight: "bold",
          titleColor: "#000000",
          titleAlign: "center",
          subtitleFontSize: 16,
          subtitleColor: "#6b7280",
          subtitleAlign: "center",
          backgroundColor: "#f9fafb",
          padding: 24,
          margin: 16,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "#e5e7eb",
          inputBgColor: "#ffffff",
          inputBorderColor: "#e5e7eb",
          inputTextColor: "#000000",
          buttonColor: "#000000",
          buttonTextColor: "#ffffff",
          maxWidth: 500,
        }
        break
      case "hero":
        newElement.content = {
          title: "Premium Leather Products",
          subtitle: "Handcrafted with care for the modern lifestyle",
          buttonText: "Shop Now",
          buttonLink: "#",
          secondaryButtonText: "Learn More",
          secondaryButtonLink: "#",
          backgroundImage: "/placeholder.svg?height=600&width=1200",
          overlayOpacity: 0.3,
        }
        newElement.style = {
          titleFontSize: 48,
          titleFontWeight: "bold",
          titleColor: "#ffffff",
          titleAlign: "center",
          subtitleFontSize: 20,
          subtitleColor: "#f9fafb",
          subtitleAlign: "center",
          backgroundColor: "#000000",
          backgroundPosition: "center",
          backgroundSize: "cover",
          height: 500,
          padding: 48,
          margin: 0,
          borderRadius: 0,
          borderWidth: 0,
          borderColor: "#e5e7eb",
          buttonColor: "#ffffff",
          buttonTextColor: "#000000",
          secondaryButtonColor: "transparent",
          secondaryButtonTextColor: "#ffffff",
          secondaryButtonBorderColor: "#ffffff",
          contentWidth: 800,
        }
        break
    }

    // If there's a selected element, add the new element after it
    if (selectedElementId) {
      const selectedIndex = elements.findIndex((el) => el.id === selectedElementId)
      if (selectedIndex !== -1) {
        const newElements = [...elements]
        newElements.splice(selectedIndex + 1, 0, newElement)
        setElements(newElements)
        return
      }
    }

    // Otherwise add to the end
    setElements((prev) => [...prev, newElement])
  }

  const updateElement = (id: string, updates: Partial<PageElement>) => {
    setElements((prev) => prev.map((element) => (element.id === id ? { ...element, ...updates } : element)))
  }

  const removeElement = (id: string) => {
    setElements((prev) => prev.filter((element) => element.id !== id))
    if (selectedElementId === id) {
      setSelectedElementId(null)
    }
  }

  const moveElement = (id: string, direction: "up" | "down") => {
    const index = elements.findIndex((element) => element.id === id)
    if (index === -1) return

    const newElements = [...elements]

    if (direction === "up" && index > 0) {
      // Swap with the element above
      ;[newElements[index], newElements[index - 1]] = [newElements[index - 1], newElements[index]]
    } else if (direction === "down" && index < elements.length - 1) {
      // Swap with the element below
      ;[newElements[index], newElements[index + 1]] = [newElements[index + 1], newElements[index]]
    }

    setElements(newElements)
  }

  return {
    elements,
    setElements,
    selectedElementId,
    setSelectedElementId,
    addElement,
    updateElement,
    removeElement,
    moveElement,
  }
}
