import { Product, ProductVariant } from "@/types/products"

/**
 * Get all active variants for a product
 * @param product The product to get active variants for
 * @returns Array of active variants
 */
export const getActiveVariants = (product: Product | null): ProductVariant[] => {
  if (!product) return []
  
  return product.variants.filter(v => v.status === "active")
}

/**
 * Get all available values for a specific option based on current selections
 * @param product The product
 * @param optionName The name of the option to get available values for
 * @param currentSelections Current selections for all options
 * @returns Array of available values for the option
 */
export const getAvailableValuesForOption = (
  product: Product | null,
  optionName: string,
  currentSelections: Record<string, string>
): string[] => {
  if (!product) return []
  
  // Get all active variants
  const activeVariants = getActiveVariants(product)
  if (activeVariants.length === 0) return []
  
  // Find all values for this option that are compatible with current selections
  const availableValues = new Set<string>()
  
  activeVariants.forEach(variant => {
    // Check if this variant matches all other selected options
    const matchesOtherOptions = product.options.every(option => {
      // Skip the option we're checking
      if (option.name === optionName) return true
      
      // Skip if this option hasn't been selected yet
      if (!currentSelections[option.name]) return true
      
      // Check if variant has the selected value for this option
      return variant.variantValues.some(vv => 
        vv.option === option.name && 
        vv.value === currentSelections[option.name]
      )
    })
    
    // If this variant matches other options, add its value for the current option
    if (matchesOtherOptions) {
      const optionValue = variant.variantValues.find(vv => vv.option === optionName)?.value
      if (optionValue) {
        availableValues.add(optionValue)
      }
    }
  })
  
  return Array.from(availableValues)
}

/**
 * Check if a specific option value is available
 * @param product The product
 * @param optionName The name of the option
 * @param optionValue The value to check
 * @param currentSelections Current selections for all options
 * @returns Whether the option value is available
 */
export const isOptionValueAvailable = (
  product: Product | null,
  optionName: string,
  optionValue: string,
  currentSelections: Record<string, string>
): boolean => {
  const availableValues = getAvailableValuesForOption(product, optionName, currentSelections)
  return availableValues.includes(optionValue)
}

/**
 * Find a valid variant based on current selections
 * @param product The product
 * @param selections Current selections for all options
 * @returns The matching variant or null if none found
 */
export const findValidVariant = (
  product: Product | null,
  selections: Record<string, string>
): ProductVariant | null => {
  if (!product) return null
  
  const activeVariants = getActiveVariants(product)
  if (activeVariants.length === 0) return null
  
  // Find a variant that matches all selections
  return activeVariants.find(variant => 
    Object.entries(selections).every(([optionName, optionValue]) => 
      variant.variantValues.some(vv => 
        vv.option === optionName && 
        vv.value === optionValue
      )
    )
  ) || null
} 