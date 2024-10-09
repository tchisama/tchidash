"use client"
import React, { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query';
import { useStore } from '@/store/storeInfos';
import { and, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebase';
import { Product, Variant } from '@/types/product';
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
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


function ChooseProductWithVariant() {
  const { storeId } = useStore();
  const { data: products } = useQuery({
    queryKey: ["products", storeId],
    queryFn: () => {
      const q = query(
        collection(db, "products"),
        and(where("storeId", "==", storeId), where("status", "!=", "deleted")),
      );
      const response = getDocs(q).then((response) =>
        response.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as Product),
      );
      return response;
    },
  });
  const [selectedProduct, setSelectedProduct] = React.useState<Product|null>(null);
  const [selectedVariant, setSelectedVariant] = React.useState<string|null>(null);
  useEffect(() => {
    setSelectedVariant(null)
  },[selectedProduct,setSelectedVariant])
  return (
  <AlertDialog>
    <AlertDialogTrigger className='w-[200px] text-left'>
      {
        selectedProduct ? selectedProduct.title : "Choose a product"
      }
      {
        selectedVariant ? ` ( ${selectedProduct?.variants?.find((variant) => variant.id === selectedVariant)?.title} )` : ""
      }
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription className='flex gap-4'>
            <SelectProduct products={products} selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct} />
            {
              selectedProduct &&
              selectedProduct.variants &&
              selectedProduct.variants.length > 0 &&
              <SelectProductVariant variants={selectedProduct.variants} selectedVariant={selectedVariant} setSelectedVariant={setSelectedVariant} />
            }
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction>Continue</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>

  )
}
const SelectProduct = ({products, selectedProduct, setSelectedProduct}:{
  products: Product[] | undefined,
  selectedProduct: Product | null,
  setSelectedProduct: React.Dispatch<React.SetStateAction<Product | null>>
}) => {
  return (
    <Select
      onValueChange={(value) => setSelectedProduct(products?.find((product) => product.id === value) as Product)}
      value={selectedProduct?.id}
      defaultValue={selectedProduct?.id}
    >
      <SelectTrigger className="flex-1">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        {products?.map((product: Product) => (
          <SelectItem
            key={product.id}
            value={product.id}
            onClick={() => setSelectedProduct(product)}
          >
            {product.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

const SelectProductVariant = ({variants, selectedVariant, setSelectedVariant}:{
  variants: Variant[] | undefined,
  selectedVariant: string | null,
  setSelectedVariant: React.Dispatch<React.SetStateAction<string | null>>
}) => {
  return (
    <Select
      onValueChange={(value) => setSelectedVariant(value)}
      value={selectedVariant??""}
      defaultValue={selectedVariant??""}
    >
      <SelectTrigger className="flex-1">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        {variants?.map((variant: Variant) => (
          <SelectItem
            key={variant.id}
            value={variant.id}
            onClick={() => setSelectedVariant(variant.id)}
          >
            {variant.title}
          </SelectItem>
        ))}
      </SelectContent>

    </Select>
  );
} 


export default ChooseProductWithVariant