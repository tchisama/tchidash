"use client";
import React from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ProductDetailsCard from "./components/ProductDetails";
import ProductCategoryCard from "./components/ProductCategory";
import ProductOptionsCard from "./components/ProductOptions";
import ProductVariantsCard from "./components/ProductVariant";
import ProductStatusCard from "./components/ProductStatus";
import ProductImagesCard from "./components/ProductImage";
// import ProductBundle from "./components/ProductBundle";
import { useEffect } from "react";
import { useProducts } from "@/store/products";
import {
  and,
  collection,
  doc,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "@/firebase";
import { Product } from "@/types/product";
import { useStore } from "@/store/storeInfos";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { isEqual } from "lodash";
import { useNavbar } from "@/store/navbar";
import { toast } from "@/hooks/use-toast";
import ProductDynamicVariantsImages from "./components/ProductDynamicVariantsImages";
import ProductDiscount from "./components/ProductDiscount";
import { dbGetDocs, dbUpdateDoc } from "@/lib/dbFuntions/fbFuns";

function Page({ params }: { params: { product: string } }) {
  const {
    products,
    setProducts,
    currentProduct,
    setCurrentProduct,
    lastUploadedProduct,
    setLastUploadedProduct,
  } = useProducts();
  const { storeId } = useStore();
  const { setActions } = useNavbar();
  const productId = params.product;

  const { data, isLoading, error } = useQuery({
    queryKey: [productId],
    queryFn: async () => {
      if (productId === "new") {
        const newProductRef = doc(collection(db, "products"));
        const newProduct: Product = {
          id: newProductRef.id,
          title: "New Product",
          price: 0,
          status: "draft",
          storeId: storeId || "",
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          options: [],
          variants: [],
          images: [],
          description: "",
          category: "",
          hasBundle: false,
          hasDiscount: false,
          stockQuantity: 0,
          variantsAreOneProduct: false,
          canBeSaled: true,
          discount: {
            amount: 0,
            type: "fixed",
            startDate: Timestamp.now(),
          },
        };
        
        // Create the product immediately
        if (storeId) {
          await dbUpdateDoc(
            newProductRef,
            newProduct,
            storeId,
            "",
          );
          setProducts([...products, newProduct]);
          setLastUploadedProduct(newProduct);
          setCurrentProduct(newProduct);
          
          // Redirect to the new product
          window.location.href = `/dashboard/products/${newProduct.title.replaceAll(" ", "_")}`;
        }
        
        return newProduct;
      }
      const q = query(
        collection(db, "products"),
        and(
          where("storeId", "==", storeId),
          where("title", "==", productId.replaceAll("_", " ")),
        ),
      );
      if (!storeId) return;
      const response = await dbGetDocs(q, storeId, "");
      console.log(response.docs[0].data());
      if (response.docs.length === 0) return null;
      const productData = {
        ...(response.docs[0].data() as Product),
        id: response.docs[0].id,
      };
      return productData;
    },
    staleTime: 1000 * 10,
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
      if (!storeId) return;
      
      if (productId === "new") {
        // Create a new product
        const newProductRef = doc(collection(db, "products"));
        dbUpdateDoc(
          newProductRef,
          {
            ...currentProduct,
            id: newProductRef.id,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          },
          storeId,
          "",
        );
        setLastUploadedProduct({ ...currentProduct, id: newProductRef.id });
        setProducts([...products, { ...currentProduct, id: newProductRef.id }]);
      } else {
        // Update an existing product
        dbUpdateDoc(
          doc(db, "products", currentProduct.id),
          {
            ...currentProduct,
            updatedAt: Timestamp.now(),
          },
          storeId,
          "",
        );
        setLastUploadedProduct(currentProduct);
        setProducts(
          products.map((p) => (p.id === currentProduct.id ? currentProduct : p)),
        );
      }
      setActions([]);
      toast({
        title: productId === "new" ? "Product created" : "Product updated",
        description: productId === "new" 
          ? "Product has been created successfully" 
          : "Product has been updated successfully",
      });
    } else {
      // Handle missing fields (e.g., show an error or notification)
      console.error("Missing required product fields");
    }
  };

  const areProductsEqual = isEqual(lastUploadedProduct, currentProduct);

  useEffect(() => {
    if (!lastUploadedProduct && currentProduct) {
      setLastUploadedProduct(currentProduct);
    }
    // Only update URL if we're not in the "new" product case
    if (productId !== "new") {
      window.history.pushState(
        null,
        "",
        `/dashboard/products/${currentProduct?.title.replaceAll(" ", "_")}`,
      );
    }
  }, [lastUploadedProduct, currentProduct, setLastUploadedProduct, productId]);

  const [preProduct, setPreProduct] = React.useState<Product | null>(null);
  const [nextProduct, setNextProduct] = React.useState<Product | null>(null);

  useEffect(() => {
    if (!products) return;
    // Skip navigation setup for new product
    if (productId === "new") return;
    
    const index = products.findIndex((p) => p.title == currentProduct?.title);
    if (index > 0) {
      setPreProduct(products[index - 1]);
    } else {
      setPreProduct(products[products.length - 1]);
    }
    if (index < products.length - 1) {
      setNextProduct(products[index + 1]);
    } else {
      setNextProduct(products[0]);
    }
  }, [products, currentProduct, productId]);

  if (isLoading)
    return (
      <div className="w-full h-[50vh] flex justify-center items-center">
        Loading...
      </div>
    );
  if (error) return <div>Error: {error.message}</div>;

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
          {!areProductsEqual && (
            <Button size="sm" onClick={saveProduct}>
              Save Product
            </Button>
          )}
        </div>
        {products && products.length > 1 && (
          <div className="flex gap-2 ">
            <Button
              size="sm"
              variant={"outline"}
              disabled={preProduct == null}
              onClick={() => {
                setCurrentProduct(preProduct);
                setLastUploadedProduct(preProduct);
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={"outline"}
              disabled={nextProduct == null}
              onClick={() => {
                setCurrentProduct(nextProduct);
                setLastUploadedProduct(nextProduct);
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <ProductDetailsCard />

          <ProductCategoryCard />
          {!currentProduct?.hasBundle && (
            <>
              <ProductOptionsCard />
              {currentProduct &&
                currentProduct?.options &&
                currentProduct.options.length > 0 && (
                  <ProductVariantsCard saveProduct={saveProduct} />
                )}
            </>
          )}
          {/* <ProductBundle /> */}
        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <ProductImagesCard />
          <ProductStatusCard />
          <ProductDiscount />
          <ProductDynamicVariantsImages />
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 md:hidden">
        {!areProductsEqual && (
          <Button size="sm" onClick={saveProduct}>
            Save Product
          </Button>
        )}
      </div>
    </div>
  );
}

export default Page;
