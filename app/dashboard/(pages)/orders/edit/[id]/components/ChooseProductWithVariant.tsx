"use client";
import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "@/store/storeInfos";
import { and, collection, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { Product, Variant } from "@/types/product";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Order, OrderItem } from "@/types/order";
import { useOrderStore } from "@/store/orders";
import Image from "next/image";
import { dbGetDocs } from "@/lib/dbFuntions/fbFuns";

function ChooseProductWithVariant({ item }: { item: OrderItem }) {
  const { storeId } = useStore();
  const { setNewOrder, newOrder } = useOrderStore();
  const { data: products } = useQuery({
    queryKey: ["products", storeId],
    queryFn: () => {
      const q = query(
        collection(db, "products"),
        and(where("storeId", "==", storeId), where("status", "==", "active")),
      );
      if (!storeId) return;
      const response = dbGetDocs(q, storeId, "").then((response) =>
        response.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as Product),
      );
      return response;
    },
  });
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(
    null,
  );
  const [selectedVariant, setSelectedVariant] = React.useState<string | null>(
    null,
  );
  // useEffect(() => {
  //   setSelectedVariant(null);
  // }, [selectedProduct, setSelectedVariant]);

  // useEffect(() => {
  //   if (selectedProduct?.variants && selectedProduct.variants.length > 0) {
  //     setSelectedVariant(selectedProduct.variants[0].id);
  //   }
  // }, [selectedProduct, setSelectedVariant]);

  const price = () => {
    if (selectedProduct) {
      if (selectedProduct.variantsAreOneProduct) {
        return selectedProduct.price;
      } else {
        if (selectedVariant) {
          return selectedProduct.variants?.find(
            (variant) => variant.id === selectedVariant,
          )?.price;
        } else {
          return selectedProduct.price;
        }
      }
    }
    return 0;
  };
  useEffect(() => {
    if (item.productId) {
      setSelectedProduct(
        products?.find((product) => product.id === item.productId) as Product,
      );
      if (item.variantId) {
        setSelectedVariant(item.variantId);
      }
    }
  }, [item]);

  useEffect(() => {
    if (!selectedProduct) return;
    // if(!selectedVariant) return;
    setNewOrder({
      ...newOrder,
      items: newOrder?.items.map((itm) => {
        if (itm.id === item.id) {
          return {
            ...itm,
            productId: selectedProduct?.id,
            variantId: selectedVariant,
            price: price(),
            discount: selectedProduct?.hasDiscount
              ? selectedProduct?.discount
              : null,
            title: selectedVariant
              ? selectedProduct?.title +
                " (" +
                selectedProduct?.variants?.find(
                  (variant) => variant.id === selectedVariant,
                )?.title +
                ")"
              : selectedProduct?.title,
            imageUrl: getImage(),
          };
        } else {
          return itm;
        }
      }),
    } as Order);
    console.log(newOrder?.items);
  }, [selectedVariant, selectedProduct, setNewOrder, item.id]);

  const getImage = () => {
    if (selectedVariant) {
      const variant = selectedProduct?.variants?.find(
        (variant) => variant.id === selectedVariant,
      );
      if (variant) {
        if (variant.images && variant.images.length > 0) {
          return variant.images[0];
        } else {
          return selectedProduct?.images && selectedProduct.images.length > 0
            ? selectedProduct.images[0]
            : "";
        }
      } else {
        return selectedProduct?.images && selectedProduct.images.length > 0
          ? selectedProduct.images[0]
          : "";
      }
    } else {
      return selectedProduct?.images && selectedProduct.images.length > 0
        ? selectedProduct.images[0]
        : "";
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger className="min-w-[300px] items-center text-left flex gap-2">
        <div className="w-10 h-10 bg-slate-50 border justify-center rounded-md items-center">
          {item.imageUrl && (
            <Image
              src={item.imageUrl || ""}
              alt=""
              width={100}
              height={100}
              className="w-full h-full object-cover rounded-md"
            />
          )}
        </div>
        {item.title ?? "Choose a product"}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Choose a product</AlertDialogTitle>
          <AlertDialogDescription className="flex gap-4">
            <SelectProduct
              products={products}
              selectedProduct={selectedProduct}
              setSelectedProduct={setSelectedProduct}
            />
            {selectedProduct &&
              selectedProduct.variants &&
              selectedProduct.variants.length > 0 && (
                <SelectProductVariant
                  variants={selectedProduct.variants}
                  selectedVariant={selectedVariant}
                  setSelectedVariant={setSelectedVariant}
                />
              )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
const SelectProduct = ({
  products,
  selectedProduct,
  setSelectedProduct,
}: {
  products: Product[] | undefined;
  selectedProduct: Product | null;
  setSelectedProduct: React.Dispatch<React.SetStateAction<Product | null>>;
}) => {
  return (
    <Select
      onValueChange={(value) =>
        setSelectedProduct(
          products?.find((product) => product.id === value) as Product,
        )
      }
      value={selectedProduct?.id}
      defaultValue={selectedProduct?.id}
    >
      <SelectTrigger className="flex-1 h-16">
        <SelectValue placeholder="Product" />
      </SelectTrigger>
      <SelectContent>
        {products?.map((product: Product) => (
          <SelectItem
            key={product.id}
            value={product.id}
            onClick={() => setSelectedProduct(product)}
          >
            <div className="flex gap-2 items-center">
              <Image
                src={
                  product.images &&
                  product.images.length > 0 &&
                  product.images[0]
                    ? product.images[0]
                    : ""
                }
                alt=""
                width={30}
                height={30}
                className="w-[40px] border bg-slate-100 h-[40px] object-cover rounded-lg"
              />
              {product.title}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const SelectProductVariant = ({
  variants,
  selectedVariant,
  setSelectedVariant,
}: {
  variants: Variant[] | undefined;
  selectedVariant: string | null;
  setSelectedVariant: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  return (
    <Select
      onValueChange={(value) => setSelectedVariant(value)}
      value={selectedVariant ?? ""}
      defaultValue={selectedVariant ?? ""}
    >
      <SelectTrigger className="flex-1 h-16">
        <SelectValue placeholder="Variant" />
      </SelectTrigger>
      <SelectContent>
        {variants?.map((variant: Variant) => (
          <SelectItem
            key={variant.id}
            value={variant.id}
            onClick={() => setSelectedVariant(variant.id)}
          >
            <div className="flex gap-2 items-center">
              <Image
                src={variant?.images ? variant.images[0] : ""}
                alt=""
                width={30}
                height={30}
                className="w-[40px] border bg-slate-100 h-[40px] object-cover rounded-lg"
              />
              {variant.title}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ChooseProductWithVariant;
