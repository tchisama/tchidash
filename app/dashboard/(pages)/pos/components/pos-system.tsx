"use client";

import type React from "react";

import { useEffect, useState } from "react";
import {
  ShoppingCart,
  Package,
  Search,
  ShoppingBag,
  Trash2,
  Grid,
  Coffee,
  Pizza,
  Shirt,
  Book,
  Music,
  Heart,
  Star,
  Gift,
  Home,
  Car,
  Plane,
  Train,
  Bus,
  Bike,
  Phone,
  Laptop,
  Camera,
  Headphones,
  Watch,
  Utensils,
  Beer,
  Wine,
  Cookie,
  IceCream,
  Apple,
  Carrot,
  Fish,
  Beef,
  Egg,
  Milk,
  Cake,
  Candy,
  GlassWater,
  ArrowLeft,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/store/storeInfos";
import { createOrder, OrderDetails } from "@/lib/orders/createOrder";
import { useCategories } from "@/store/categories";
import { ProductCategory } from "@/types/categories";
import { collection, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { dbGetDocs } from "@/lib/dbFuntions/fbFuns";

// Product Types
interface ProductVariant {
  id: string;
  title: string;
  price: number;
  images: string[];
  inventoryQuantity: number;
  sku: string;
  variantValues: {
    option: string;
    value: string;
  }[];
}

interface ProductOption {
  name: string;
  values: string[];
}

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  options: ProductOption[];
  variants: ProductVariant[];
  hasDiscount: boolean;
  status: string;
  category?: string;
}

interface CartItem {
  productId: string;
  variantId: string;
  productTitle: string;
  variantTitle: string;
  price: number;
  quantity: number;
  image: string;
}

export default function PosSystem() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null,
  );
  const [, setQuantity] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isVariantDialogOpen, setIsVariantDialogOpen] = useState(false);
  const [numpadValue, setNumpadValue] = useState("");
  const [selectedCartItemIndex, setSelectedCartItemIndex] = useState<
    number | null
  >(null);
  const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { storeId: STORE_ID } = useStore();
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { setCategories: setGlobalCategories } = useCategories();
  const [userSelectionType, setUserSelectionType] = useState<
    "default" | "specific"
  >("default");

  // Checkout form state
  const [checkoutForm, setCheckoutForm] = useState({
    firstName: "",
    lastName: "",
    number: "",
    address: "",
    city: "",
    note: "",
  });

  // Default user information
  const defaultUser = {
    firstName: "POS",
    lastName: "User",
    number: "",
    address: "",
    city: "",
  };

  // Track product quantities in cart
  const [productQuantities, setProductQuantities] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "/api/v1/products?status=active&limit=100&storeid=" + STORE_ID,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();

        // Check if data is an array, otherwise handle accordingly
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (data && typeof data === "object") {
          // If data is an object with products inside, extract the array
          // This handles cases where API returns {products: [...]} or similar structure
          const productsArray =
            data.products || data.data || Object.values(data);
          if (Array.isArray(productsArray)) {
            setProducts(productsArray);
          } else {
            console.error("Unexpected data format:", data);
            setProducts([]);
          }
        } else {
          console.error("Unexpected data format:", data);
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({
          title: "Error",
          description: "Failed to load products. Please try again.",
          variant: "destructive",
        });
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Update product quantities whenever cart changes
  useEffect(() => {
    const quantities: Record<string, number> = {};

    cart.forEach((item) => {
      // For products without variants, use productId as key
      // For products with variants, use productId as key to show total quantity per product
      if (quantities[item.productId]) {
        quantities[item.productId] += item.quantity;
      } else {
        quantities[item.productId] = item.quantity;
      }
    });

    setProductQuantities(quantities);
  }, [cart]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      if (!STORE_ID) return;

      try {
        const response = await dbGetDocs(
          query(collection(db, "categories"), where("storeId", "==", STORE_ID)),
          STORE_ID,
          "",
        );

        const categoriesData = response.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            }) as ProductCategory,
        );

        setCategories(categoriesData);
        setGlobalCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast({
          title: "Error",
          description: "Failed to load categories. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchCategories();
  }, [STORE_ID, setGlobalCategories]);

  const filteredProducts = Array.isArray(products)
    ? products.filter((product) => {
        // Filter by search query
        const matchesSearch = product.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

        // Filter by category if selected
        const matchesCategory = selectedCategory
          ? product.category === selectedCategory
          : true;

        return matchesSearch && matchesCategory;
      })
    : [];

  const handleProductSelect = (product: Product) => {
    // If product has no variants or only one variant, add directly to cart
    if (!product.variants || product.variants.length === 0) {
      addToCart(product, null);
      return;
    } else if (product.variants.length === 1) {
      addToCart(product, product.variants[0]);
      return;
    }

    // Otherwise, show variant selection dialog
    setSelectedProduct(product);
    setSelectedVariant(product.variants[0]);
    setQuantity(1);
    setIsVariantDialogOpen(true);
  };

  const addToCart = (product: Product, variant: ProductVariant | null) => {
    const itemToAdd = {
      productId: product.id,
      variantId: variant ? variant.id : "default",
      productTitle: product.title,
      variantTitle: variant ? variant.title : "",
      price: variant ? variant.price : product.price,
      quantity: numpadValue ? Number.parseInt(numpadValue) : 1,
      image: variant?.images?.[0] || product.images?.[0] || "",
    };

    const existingItemIndex = cart.findIndex(
      (item) =>
        item.productId === itemToAdd.productId &&
        item.variantId === itemToAdd.variantId,
    );

    if (existingItemIndex >= 0) {
      // Update quantity if item already in cart
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += itemToAdd.quantity;
      setCart(updatedCart);
    } else {
      // Add new item to cart
      setCart([...cart, itemToAdd]);
    }

    toast({
      title: "Added to cart",
      description: `${itemToAdd.quantity} × ${product.title}${variant ? ` (${variant.title})` : ""}`,
    });

    setIsVariantDialogOpen(false);
    setNumpadValue("");
  };

  const handleVariantSelect = () => {
    if (selectedProduct && selectedVariant) {
      addToCart(selectedProduct, selectedVariant);
    }
  };

  const updateCartItemQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    const updatedCart = [...cart];
    updatedCart[index].quantity = newQuantity;
    setCart(updatedCart);
  };

  const removeCartItem = (index: number) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
    setSelectedCartItemIndex(null);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleNumpadClick = (value: string) => {
    if (value === "C") {
      setNumpadValue("");
    } else if (value === "←") {
      setNumpadValue((prev) => prev.slice(0, -1));
    } else if (value === "Apply") {
      if (selectedCartItemIndex !== null && numpadValue) {
        const newQuantity = Number.parseInt(numpadValue);
        if (newQuantity > 0) {
          updateCartItemQuantity(selectedCartItemIndex, newQuantity);
          setNumpadValue("");
          setSelectedCartItemIndex(null);
        }
      }
    } else {
      setNumpadValue((prev) => prev + value);
    }
  };

  const selectCartItem = (index: number) => {
    setSelectedCartItemIndex(index);
    setNumpadValue(cart[index].quantity.toString());
  };

  const handleCheckoutOpen = () => {
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checkout",
        variant: "destructive",
      });
      return;
    }
    setIsCheckoutDialogOpen(true);
    // Reset to default user selection when opening checkout
    setUserSelectionType("default");
    setCheckoutForm({
      ...defaultUser,
      note: "",
    });
  };

  const handleUserSelectionChange = (type: "default" | "specific") => {
    setUserSelectionType(type);
    if (type === "default") {
      setCheckoutForm({
        ...defaultUser,
        note: checkoutForm.note,
      });
    } else {
      // Clear form for specific user
      setCheckoutForm({
        firstName: "",
        lastName: "",
        number: "",
        address: "",
        city: "",
        note: checkoutForm.note,
      });
    }
  };

  const handleCheckoutFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setCheckoutForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckout = async () => {
    // Validate form based on user selection type
    if (userSelectionType === "specific") {
      if (
        !checkoutForm.firstName ||
        !checkoutForm.lastName ||
        !checkoutForm.number ||
        !checkoutForm.address ||
        !checkoutForm.city
      ) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }
    } else {
      // For default user, only validate that we have a phone number
      if (!checkoutForm.number) {
        toast({
          title: "Missing information",
          description: "Please enter a phone number",
          variant: "destructive",
        });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Prepare order details
      const orderDetails: OrderDetails = {
        ...checkoutForm,
        userType: userSelectionType,
        cartItems: cart.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          name: item.productTitle,
          variantInfo: item.variantTitle,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        cartTotal: calculateTotal(),
      };

      // Create order
      await createOrder(orderDetails, STORE_ID ?? "");

      toast({
        title: "Order placed successfully",
        description: `Total: ${calculateTotal()} dh`,
      });

      // Reset cart and close dialog
      setCart([]);
      setSelectedCartItemIndex(null);
      setIsCheckoutDialogOpen(false);

      // Reset checkout form
      setCheckoutForm({
        firstName: "",
        lastName: "",
        number: "",
        address: "",
        city: "",
        note: "",
      });
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout failed",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to get an icon component based on the category's icon
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Grid":
        return Grid;
      case "Coffee":
        return Coffee;
      case "Pizza":
        return Pizza;
      case "Shirt":
        return Shirt;
      case "Book":
        return Book;
      case "Music":
        return Music;
      case "Heart":
        return Heart;
      case "Star":
        return Star;
      case "Gift":
        return Gift;
      case "Home":
        return Home;
      case "Car":
        return Car;
      case "Plane":
        return Plane;
      case "Train":
        return Train;
      case "Bus":
        return Bus;
      case "Bike":
        return Bike;
      case "Phone":
        return Phone;
      case "Laptop":
        return Laptop;
      case "Camera":
        return Camera;
      case "Headphones":
        return Headphones;
      case "Watch":
        return Watch;
      case "Utensils":
        return Utensils;
      case "Beer":
        return Beer;
      case "Wine":
        return Wine;
      case "Cookie":
        return Cookie;
      case "IceCream":
        return IceCream;
      case "Apple":
        return Apple;
      case "Carrot":
        return Carrot;
      case "Fish":
        return Fish;
      case "Beef":
        return Beef;
      case "Egg":
        return Egg;
      case "Milk":
        return Milk;
      case "Cake":
        return Cake;
      case "Candy":
        return Candy;
      case "GlassWater":
        return GlassWater;
      default:
        return Grid;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Package className="h-8 w-8 animate-pulse text-primary" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 min-h-screen">
      <div className="lg:col-span-3 p-4 md:p-6 overflow-auto relative">
        <header className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="w-full">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  // go to /dashboard
                  window.location.href = "/dashboard";
                }}
                className="flex items-center gap-2 flex-col w-24 h-20 "
              >
                <ArrowLeft className="h-8 w-8" strokeWidth={1} />
                Dashboard
              </Button>
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className="flex items-center gap-2 flex-col w-24 h-20"
              >
                <Grid className="h-8 w-8" strokeWidth={1} />
                All
              </Button>
              {categories.map((category) => {
                const IconComponent = getIconComponent(category.icon || "Grid");
                return (
                  <Button
                    key={category.id}
                    variant={
                      selectedCategory === category.id ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className={"flex items-center gap-2 flex-col w-24 h-20"}
                  >
                    {category.image ? (
                      <div className="relative w-4 h-4 rounded-full overflow-hidden">
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <IconComponent className="h-8 w-8" strokeWidth={1} />
                    )}
                    {category.name}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search products..."
              className="pl-10 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow relative flex flex-col"
                onClick={() => handleProductSelect(product)}
              >
                <div className="relative aspect-square w-full">
                  <Image
                    src={
                      product.images[0] ||
                      "/placeholder.svg?height=300&width=300"
                    }
                    alt={product.title}
                    fill
                    className="object-cover bg-slate-50  border-b"
                  />
                  {product.hasDiscount && (
                    <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">
                      Sale
                    </Badge>
                  )}

                  {/* Show quantity badge if product is in cart */}
                  {productQuantities[product.id] && (
                    <div className="absolute bottom-2 right-2 bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center font-bold text-sm">
                      {productQuantities[product.id]}
                    </div>
                  )}
                </div>
                <CardContent className="p-4 flex flex-col gap-1">
                  <h3 className="font-medium truncate text-center">
                    {product.title}
                  </h3>
                  <div className="flex justify-between items-center">
                    <p className="font-bold">{product.price} dh</p>
                    {product.variants.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {product.variants.length} variants
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No products found</p>
            </div>
          )}
        </div>
      </div>

      <div className="lg:col-span-1 border-l flex flex-col sticky top-[0] h-[calc(100vh)] bg-white">
        <div className="p-4 border-b">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Cart
            {cart.length > 0 && (
              <Badge className="ml-2">
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </Badge>
            )}
          </h2>
        </div>

        <ScrollArea className="flex-1">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 py-12">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4 p-4">
              {cart.map((item, index) => (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  className={`flex items-center gap-4 p-2 rounded-md cursor-pointer ${selectedCartItemIndex === index ? "bg-muted" : ""}`}
                  onClick={() => selectCartItem(index)}
                >
                  <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image || "/placeholder.svg?height=64&width=64"}
                      alt={item.productTitle}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">
                      {item.productTitle}
                    </h4>
                    {item.variantTitle && (
                      <p className="text-muted-foreground text-xs">
                        {item.variantTitle}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm font-medium">
                        {item.price} dh
                      </span>
                      <span className="text-sm">×{item.quantity}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeCartItem(index);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>{calculateTotal()} dh</span>
          </div>
          <div className="flex justify-between font-medium text-lg mb-4">
            <span>Total</span>
            <span>{calculateTotal()} dh</span>
          </div>
          <Button
            className="w-full"
            size="lg"
            onClick={handleCheckoutOpen}
            disabled={cart.length === 0}
          >
            Checkout
          </Button>
        </div>

        {/* Numpad */}
        <div className="p-4 border-t">
          <div className="mb-4">
            <Input
              value={numpadValue}
              onChange={(e) =>
                setNumpadValue(e.target.value.replace(/[^0-9]/g, ""))
              }
              className="text-right text-lg font-bold"
              placeholder="Quantity"
              type="number"
              min="1"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {["7", "8", "9", "4", "5", "6", "1", "2", "3", "C", "0", "←"].map(
              (key) => (
                <Button
                  key={key}
                  variant={key === "C" ? "destructive" : "outline"}
                  className="h-12 text-lg font-medium"
                  onClick={() => handleNumpadClick(key)}
                >
                  {key}
                </Button>
              ),
            )}
            <Button
              className="col-span-3 h-12 mt-2"
              onClick={() => handleNumpadClick("Apply")}
              disabled={!numpadValue || selectedCartItemIndex === null}
            >
              Apply
            </Button>
          </div>
        </div>
      </div>

      {/* Variant Selection Dialog */}
      <Dialog open={isVariantDialogOpen} onOpenChange={setIsVariantDialogOpen}>
        <DialogContent className="sm:max-w-md min-w-[50vw]">
          <DialogHeader>
            <DialogTitle>Select Variant</DialogTitle>
          </DialogHeader>

          {selectedProduct && selectedVariant && (
            <div className="space-y-6">
              <div className="relative aspect-square w-full max-w-xs border rounded-2xl">
                <Image
                  src={
                    selectedVariant.images?.[0] ||
                    selectedProduct.images[0] ||
                    "/placeholder.svg?height=400&width=400"
                  }
                  alt={selectedProduct.title}
                  fill
                  className="object-cover rounded-md"
                />
              </div>

              <div>
                <h2 className="text-xl font-bold">{selectedProduct.title}</h2>
                <p className="text-2xl font-bold mt-2">
                  {selectedVariant.price} dh
                </p>

                {selectedProduct.options.length > 0 && (
                  <div className="mt-4 space-y-4">
                    {selectedProduct.options.map((option) => (
                      <div key={option.name}>
                        <h4 className="text-sm font-medium mb-2 capitalize">
                          {option.name}
                        </h4>
                        <RadioGroup
                          value={
                            selectedVariant.variantValues.find(
                              (v) => v.option === option.name,
                            )?.value || ""
                          }
                          onValueChange={(value) => {
                            // Find variant that matches this option value and current selected values for other options
                            const currentValues = {
                              ...Object.fromEntries(
                                selectedVariant.variantValues.map((v) => [
                                  v.option,
                                  v.value,
                                ]),
                              ),
                            };
                            currentValues[option.name] = value;

                            // Find a variant that matches all these values
                            const matchingVariant =
                              selectedProduct.variants.find((variant) => {
                                const variantOptionMap = Object.fromEntries(
                                  variant.variantValues.map((v) => [
                                    v.option,
                                    v.value,
                                  ]),
                                );

                                // Check if all current values match this variant
                                return Object.entries(currentValues).every(
                                  ([opt, val]) => variantOptionMap[opt] === val,
                                );
                              });

                            if (matchingVariant) {
                              setSelectedVariant(matchingVariant);
                            }
                          }}
                          className="flex flex-wrap gap-2"
                        >
                          {option.values.map((value) => (
                            <div key={value} className="flex items-center">
                              <RadioGroupItem
                                value={value}
                                id={`${option.name}-${value}`}
                                className="peer sr-only"
                              />
                              <Label
                                htmlFor={`${option.name}-${value}`}
                                className="px-3 py-1.5 border rounded-md text-sm cursor-pointer peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground peer-data-[state=checked]:border-primary"
                              >
                                {value}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsVariantDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleVariantSelect}>Add to Cart</Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Checkout Dialog */}
      <Dialog
        open={isCheckoutDialogOpen}
        onOpenChange={setIsCheckoutDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Your Order</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* User Selection */}
            <div className="space-y-2">
              <Label>Customer Type</Label>
              <div className="flex gap-2">
                <Button
                  variant={
                    userSelectionType === "default" ? "default" : "outline"
                  }
                  className="flex-1"
                  onClick={() => handleUserSelectionChange("default")}
                >
                  Default User
                </Button>
                <Button
                  variant={
                    userSelectionType === "specific" ? "default" : "outline"
                  }
                  className="flex-1"
                  onClick={() => handleUserSelectionChange("specific")}
                >
                  Specific User
                </Button>
              </div>
            </div>

            {userSelectionType === "specific" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={checkoutForm.firstName}
                      onChange={handleCheckoutFormChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={checkoutForm.lastName}
                      onChange={handleCheckoutFormChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    name="address"
                    value={checkoutForm.address}
                    onChange={handleCheckoutFormChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={checkoutForm.city}
                    onChange={handleCheckoutFormChange}
                    required
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="number">Phone Number *</Label>
              <Input
                id="number"
                name="number"
                value={checkoutForm.number}
                onChange={handleCheckoutFormChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Order Notes</Label>
              <Textarea
                id="note"
                name="note"
                value={checkoutForm.note}
                onChange={handleCheckoutFormChange}
                placeholder="Special instructions for your order"
              />
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="font-medium mb-2">Order Summary</h3>
              <div className="space-y-2">
                {cart.map((item) => (
                  <div
                    key={`${item.productId}-${item.variantId}`}
                    className="flex justify-between text-sm"
                  >
                    <span>
                      {item.quantity} × {item.productTitle}
                      {item.variantTitle && (
                        <span className="text-muted-foreground">
                          {" "}
                          ({item.variantTitle})
                        </span>
                      )}
                    </span>
                    <span>{item.price * item.quantity} dh</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between font-medium text-lg mt-4 pt-4 border-t">
                <span>Total</span>
                <span>{calculateTotal()} dh</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCheckoutDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCheckout} disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Place Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
