import { 
  Grid, Coffee, Pizza, Shirt, Book, Music, 
  Heart, Star, Gift, Home, Car, Plane, 
  Train, Bus, Bike, Phone, Laptop, Camera, 
  Headphones, Watch, Utensils, Beer, Wine, 
  Cookie, IceCream, Apple, Carrot, Fish, 
  Beef, Egg, Milk, Cake, Candy, GlassWater 
} from "lucide-react"

export const AVAILABLE_ICONS = [
  "Grid", "Coffee", "Pizza", "Shirt", "Book", "Music", 
  "Heart", "Star", "Gift", "Home", "Car", "Plane", 
  "Train", "Bus", "Bike", "Phone", "Laptop", "Camera", 
  "Headphones", "Watch", "Utensils", "Beer", "Wine", 
  "Cookie", "IceCream", "Apple", "Carrot", "Fish", 
  "Beef", "Egg", "Milk", "Cake", "Candy", "GlassWater"
] as const

export type IconName = typeof AVAILABLE_ICONS[number]

export const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "Grid": return Grid
    case "Coffee": return Coffee
    case "Pizza": return Pizza
    case "Shirt": return Shirt
    case "Book": return Book
    case "Music": return Music
    case "Heart": return Heart
    case "Star": return Star
    case "Gift": return Gift
    case "Home": return Home
    case "Car": return Car
    case "Plane": return Plane
    case "Train": return Train
    case "Bus": return Bus
    case "Bike": return Bike
    case "Phone": return Phone
    case "Laptop": return Laptop
    case "Camera": return Camera
    case "Headphones": return Headphones
    case "Watch": return Watch
    case "Utensils": return Utensils
    case "Beer": return Beer
    case "Wine": return Wine
    case "Cookie": return Cookie
    case "IceCream": return IceCream
    case "Apple": return Apple
    case "Carrot": return Carrot
    case "Fish": return Fish
    case "Beef": return Beef
    case "Egg": return Egg
    case "Milk": return Milk
    case "Cake": return Cake
    case "Candy": return Candy
    case "GlassWater": return GlassWater
    default: return Grid
  }
} 