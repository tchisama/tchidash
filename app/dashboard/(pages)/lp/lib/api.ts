export async function fetchProducts() {
  try {
    const response = await fetch(
      "https://dash.tchisama.com/api/v1/products?status=active&limit=4&storeid=EzD98LeGHX7Rh9buv3y1",
    )

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()

    // Check if data is an array or if it contains a products array
    if (Array.isArray(data)) {
      return data
    } else if (data && typeof data === "object") {
      // If data is an object, check if it has a products property that's an array
      if (Array.isArray(data.products)) {
        return data.products
      } else if (Array.isArray(data.data)) {
        // Some APIs nest data in a data property
        return data.data
      } else {
        // If we can't find an array, convert the object to an array if possible
        console.warn("API response format unexpected, attempting to convert to array")
        return Object.values(data).filter((item) => typeof item === "object" && item !== null)
      }
    }

    // If all else fails, return an empty array
    console.warn("Could not extract products array from API response")
    return []
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}
