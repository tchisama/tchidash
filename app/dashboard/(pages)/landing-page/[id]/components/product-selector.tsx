"use client";

import { useProduct } from "../context/product-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Package } from "lucide-react";

export function ProductSelector() {
  const { products, selectedProduct, setSelectedProduct } = useProduct();

  // Ensure products is an array before using array methods
  const productsList = Array.isArray(products) ? products : [];

  if (productsList.length === 0) {
    return (
      <div className="flex items-center text-sm text-muted-foreground">
        <Package className="mr-2 h-4 w-4" />
        No products available
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Package className="h-4 w-4 text-muted-foreground" />
      <Select
        value={selectedProduct?.id || ""}
        onValueChange={(value) => {
          const product = productsList.find((p) => p.id === value);
          if (product) {
            setSelectedProduct(product);
          }
        }}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select a product" />
        </SelectTrigger>
        <SelectContent>
          {productsList.map((product) => (
            <SelectItem key={product.id} value={product.id}>
              {product.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
