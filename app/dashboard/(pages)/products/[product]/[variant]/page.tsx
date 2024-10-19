"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import React, { useEffect } from "react";
import ProductDetailsCard from "./components/ProductDetails";
import ProductImagesCard from "./components/ProductImage";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useProducts } from "@/store/products";
import { Product, Variant } from "@/types/product";
import { db } from "@/firebase";
import {
  and,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import ProductVariantsCard from "./components/ProductVariants";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "@/store/storeInfos";

function Page({ params }: { params: { product: string; variant: string } }) {
  const { currentProduct, setCurrentProduct } = useProducts();
  const router = useRouter();
  const productId = params.product;
  const variantId = params.variant;
  const { storeId } = useStore();

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
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
    if (currentProduct) return;
    if (product) {
      setCurrentProduct(product);
    }
  }, [product, setCurrentProduct, productId, storeId]);

  const saveVariant = () => {
    if (variantProduct == null) return;
    const newProduct = {
      ...currentProduct,
      variants: currentProduct?.variants?.map((v) =>
        v.id === variantProduct.id ? variantProduct : v,
      ) as Variant[],
    } as Product;
    setCurrentProduct(newProduct);
    updateDoc(doc(db, "products", newProduct.id), newProduct).then(() => {});
  };
  const [variantProduct, setVariantProduct] = React.useState<Variant | null>(
    null,
  );
  useEffect(() => {
    saveVariant();
  }, [variantProduct]);

  const discard = () => {
    setCurrentProduct(null);
    router.push("/dashboard/products");
  };
  useEffect(() => {
    if (currentProduct) {
      if (!currentProduct.variants) return;
      const variant = currentProduct.variants.find((v) => v.sku === variantId);
      if (variant) {
        setVariantProduct(variant);
      }
    }
  }, [currentProduct, variantId, setVariantProduct]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return productId ? (
    <div className="mx-auto grid max-w-[90rem]  flex-1 auto-rows-max gap-4">
      <div className="flex items-center gap-4">
        <Link href={"/dashboard/products/" + productId}>
          <Button variant="outline" size="icon" className="h-7 w-7">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          {variantProduct?.title ?? "Problem loading product"}
        </h1>
        <Badge variant="outline" className="ml-auto sm:ml-0">
          {currentProduct?.status ?? "draft"}
        </Badge>
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-2 lg:gap-8">
        <ProductVariantsCard sku={variantId} />
        <div className="grid sticky top-2 auto-rows-max items-start gap-4  lg:gap-8">
          <ProductImagesCard
            variant={variantId}
            variantState={{ variantProduct, setVariantProduct }}
          />
          <ProductDetailsCard
            variant={variantId}
            variantState={{ variantProduct, setVariantProduct }}
          />
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 md:hidden">
        <Button variant="outline" size="sm">
          Discard
        </Button>
        <Button size="sm" onClick={saveVariant}>
          Save and Back
        </Button>
      </div>
    </div>
  ) : null;
}

export default Page;
