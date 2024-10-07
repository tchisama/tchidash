"use client";
import React from "react";

import { ChevronLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ProductDetailsCard from "./components/ProductDetails";
import ProductCategoryCard from "./components/ProductCategory";
import ProductOptionsCard from "./components/ProductOptions";
import ProductVariantsCard from "./components/ProductVariant";
import ProductStatusCard from "./components/ProductStatus";
import ProductImagesCard from "./components/ProductImage";
import ProductDiscount from "./components/ProductDiscount";
import { useEffect } from "react";
import { useProducts } from "@/store/products";
import {
  and,
  collection,
  doc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/firebase";
import { Product } from "@/types/product";
//import { useQuery } from "@tanstack/react-query";
import { useStore } from "@/store/storeInfos";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProductDangerZone from "./components/ProductDangerZone";

function Page({ params }: { params: { product: string } }) {
  const { currentProduct, setCurrentProduct } = useProducts();
  const { storeId } = useStore();
  const productId = params.product;
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: [productId],
    queryFn: async () => {
      const q = query(
        collection(db, "products"),
        and(
          where("storeId", "==", storeId),
          where("title", "==", productId.replaceAll("_", " ")),
        ),
      );
      if (productId == "new") return null;
      const response = await getDocs(q);
      console.log(response.docs[0].data());
      if (response.docs.length === 0) return null;
      const productData = {
        ...(response.docs[0].data() as Product),
        id: response.docs[0].id,
      };
      return productData;
    },
  });

  useEffect(() => {
    if (productId == "new") return;
    if (!data) return;
    setCurrentProduct(data as Product);
  }, [data, setCurrentProduct, productId]);

  const saveProduct = () => {
    console.log(currentProduct);
    // Ensure currentProduct exists
    if (!currentProduct) return;

    // Destructure necessary fields from the currentProduct object
    const { title, price } = currentProduct;
    console.log(currentProduct);
    // Check if all the required fields are present
    if (title && price) {
      // Update an existing product
      updateDoc(doc(db, "products", currentProduct.id), {
        ...currentProduct,
        updatedAt: Timestamp.now(),
      });
    } else {
      // Handle missing fields (e.g., show an error or notification)
      console.error("Missing required product fields");
    }
  };

  //useEffect(() => {
  //  // Auto-save if the current product is changed, but the save needs to happen after 20 seconds
  //  if (!currentProduct) return;
  //
  //  const updatedAt = currentProduct.updatedAt?.toDate().getTime(); // Get the timestamp in milliseconds
  //  //saveProduct();
  //  console.log("Auto-saved product", updatedAt);
  //}, [currentProduct]);

  if (isLoading)
    return (
      <div className="w-full h-[50vh] flex justify-center items-center">
        Loading...
      </div>
    );
  if (error) return <div>Error: {error.message}</div>;

  const discard = () => {
    setCurrentProduct(null);
    router.push("/dashboard/products");
  };

  return (
    <div className="mx-auto grid max-w-[90rem]  flex-1 auto-rows-max gap-4">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/products">
          <Button variant="outline" size="icon" className="h-7 w-7">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          {currentProduct?.title ?? "New Product"}
        </h1>
        <Badge variant="outline" className="ml-auto sm:ml-0">
          {currentProduct?.status ?? "draft"}
        </Badge>
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          <Button onClick={discard} variant="outline" size="sm">
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
          {currentProduct &&
            currentProduct?.options &&
            currentProduct.options.length > 0 && (
              <ProductVariantsCard saveProduct={saveProduct} />
            )}
        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <ProductImagesCard />
          <ProductStatusCard />
          <ProductDiscount />
          <ProductDangerZone />
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
