import type { PageElement } from "./../types/elements"
import { db } from "../../../../../firebase"
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
} from "firebase/firestore"

// Define types for our data structures
export interface LandingPage {
  id: string
  name: string
  storeId: string
  createdAt: string
  updatedAt: string
  elements: PageElement[]
  productId?: string
  productName?: string
  productImage?: string
  published: boolean
}

/**
 * Get all landing pages for a store
 * @param storeId The store ID
 * @returns Promise with array of landing pages
 */
export async function getLandingPages(storeId: string): Promise<LandingPage[]> {
  try {
    const landingPagesRef = collection(db, "landingPages")
    const q = query(landingPagesRef, where("storeId", "==", storeId))
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as LandingPage[]
  } catch (error) {
    console.error("Error getting landing pages:", error)
    throw new Error("Failed to get landing pages")
  }
}

/**
 * Get a landing page by ID
 * @param id The landing page ID
 * @returns Promise with the landing page or null if not found
 */
export async function getLandingPageById( id: string): Promise<LandingPage | null> {
  try {
    const docRef = doc(db, "landingPages", id)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as LandingPage
    }
    return null
  } catch (error) {
    console.error("Error getting landing page:", error)
    throw new Error("Failed to get landing page")
  }
}

/**
 * Save a landing page
 * @param storeId The store ID
 * @param id The landing page ID
 * @param page The landing page data to save
 * @returns Promise with the saved landing page
 */
export async function saveLandingPage(storeId: string, id: string, page: Partial<LandingPage>): Promise<LandingPage> {
  try {
    const docRef = doc(db, "landingPages", id)
    const docSnap = await getDoc(docRef)
    
    if (!docSnap.exists()) {
      throw new Error("Landing page not found")
    }
    
    const currentData = docSnap.data()
    if (currentData.storeId !== storeId) {
      throw new Error("Landing page does not belong to this store")
    }
    
    const updatedPage = {
      ...currentData,
      ...page,
      storeId,
      updatedAt: new Date().toISOString(),
    }
    
    await updateDoc(docRef, updatedPage)
    
    return {
      id,
      ...updatedPage
    } as LandingPage
  } catch (error) {
    console.error("Error saving landing page:", error)
    throw new Error("Failed to save landing page")
  }
}

/**
 * Create a new landing page
 * @param storeId The store ID
 * @param name The name of the new landing page
 * @returns Promise with the created landing page
 */
export async function createLandingPage(storeId: string, name: string): Promise<LandingPage> {
  try {
    const landingPagesRef = collection(db, "landingPages")
    const newDocRef = doc(landingPagesRef)
    const id = newDocRef.id
    
    const newPage: LandingPage = {
      id,
      name,
      storeId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      elements: [],
      published: false,
    }
    
    await setDoc(newDocRef, newPage)
    
    return newPage
  } catch (error) {
    console.error("Error creating landing page:", error)
    throw new Error("Failed to create landing page")
  }
}

/**
 * Delete a landing page
 * @param storeId The store ID
 * @param id The landing page ID
 * @returns Promise that resolves when the page is deleted
 */
export async function deleteLandingPage(storeId: string, id: string): Promise<void> {
  try {
    const docRef = doc(db, "landingPages", id)
    const docSnap = await getDoc(docRef)
    
    if (!docSnap.exists()) {
      throw new Error("Landing page not found")
    }
    
    if (docSnap.data().storeId !== storeId) {
      throw new Error("Landing page does not belong to this store")
    }
    
    await deleteDoc(docRef)
  } catch (error) {
    console.error("Error deleting landing page:", error)
    throw new Error("Failed to delete landing page")
  }
}

/**
 * Publish or unpublish a landing page
 * @param storeId The store ID
 * @param id The landing page ID
 * @param published Whether the page should be published
 * @returns Promise with the updated landing page
 */
export async function setLandingPagePublishStatus(
  storeId: string,
  id: string,
  published: boolean,
): Promise<LandingPage> {
  return saveLandingPage(storeId, id, { published })
}
