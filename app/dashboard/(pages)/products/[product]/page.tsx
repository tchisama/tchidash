"use client";
import React from "react";

import { ChevronLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ProductDetailsCard from "./components/ProductDetails";
import ProductCategoryCard from "./components/ProductCategory";
import ProductOptionsCard from "./components/ProductOptions";
import ProductVariantsCard from "./components/ProductVariant";
import ProductStatusCard from "./components/ProductStatus";
import ProductImagesCard from "./components/ProductImage";
import ProductDiscount from "./components/ProductDiscount";
import { useEffect } from "react";
import { useProducts } from "@/store/products";
import { addDoc, collection, doc } from "firebase/firestore";
import { db } from "@/firebase";

function Page({}: { params: { product: string } }) {
  const { currentProduct } = useProducts();
  useEffect(() => {
    console.log(currentProduct);
  }, [currentProduct]);

  const saveProduct = () => {
    console.log(currentProduct);
    // Ensure currentProduct exists
    if (!currentProduct) return;

    // Destructure necessary fields from the currentProduct object
    const { title, description, price, status } = currentProduct;
    console.log(currentProduct);
    // Check if all the required fields are present
    if (title && description && price && status) {
      // Save the product using setDoc
      addDoc(collection(db, "products"), currentProduct);
    } else {
      // Handle missing fields (e.g., show an error or notification)
      console.error("Missing required product fields");
    }
  };
  return (
    <div className="mx-auto grid max-w-[90rem]  flex-1 auto-rows-max gap-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7">
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Pro Controller
        </h1>
        <Badge variant="outline" className="ml-auto sm:ml-0">
          In stock
        </Badge>
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          <Button variant="outline" size="sm">
            Discard
          </Button>
          <Button size="sm" onClick={saveProduct}>
            Save Product
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <ProductDetailsCard />

          <ProductCategoryCard />

          <ProductOptionsCard />

          <ProductVariantsCard />
        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <ProductImagesCard />
          <ProductStatusCard />
          <ProductDiscount />

          <Card x-chunk="dashboard-07-chunk-5">
            <CardHeader>
              <CardTitle>Archive Product</CardTitle>
              <CardDescription>
                Lipsum dolor sit amet, consectetur adipiscing elit.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div></div>
              <Button size="sm" variant="secondary">
                Archive Product
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 md:hidden">
        <Button variant="outline" size="sm">
          Discard
        </Button>
        <Button size="sm" onClick={saveProduct}>
          Save Product
        </Button>
      </div>
    </div>
  );
}

export default Page;
