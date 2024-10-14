"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import StageComponent from "./components/StageComponent";
import { useProducts } from "@/store/products";
import { useQuery } from "@tanstack/react-query";
import { and, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { useStore } from "@/store/storeInfos";
import { db } from "@/firebase";
import { Product } from "@/types/product";
import { useEffect, useState } from "react";
import Image from "next/image";
import UploadImageProvider from "@/components/UploadImageProvider";
import { v4 } from "uuid";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function Page({ params }: { params: { product: string } }) {
  const { currentProduct, setCurrentProduct } = useProducts();
  const { storeId } = useStore()
  const { data: product } = useQuery({
    queryKey: ["product", params.product],
    queryFn: () => {
      if (!storeId) return
      const q = query(
        collection(db, "products"), and(where("storeId", "==", storeId)
          , where("title", "==", params.product.replaceAll("_", " ")))
      )
      const response = getDocs(q).then((response) =>
        response.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Product))
      );
      return response
    },
    staleTime:0,
  })
  useEffect(() => {
    if (!product) return
    if (!product?.length) return
    setCurrentProduct(product[0])
  }, [product, setCurrentProduct])

  useEffect(() => {
    if (!currentProduct) return
    updateDoc(doc(db, "products", currentProduct.id), currentProduct)
  }, [currentProduct])

const handleSave = ()=>{
    if (!currentProduct) return
    if (!currentProduct?.dynamicVariantsOptionsImages) {
      const allOptions: Product["dynamicVariantsOptionsImages"] = []
      currentProduct?.options?.forEach((option) => {
        option.values.forEach((v) => {
          allOptions.push({
            option: option.name,
            value: v,
            image: "",
            selected: false,
            x: 0,
            y: 0
          })
        })
      })
      setCurrentProduct({
        ...currentProduct,
        dynamicVariantsOptionsImages: allOptions
      })
    }
  }


  const [selectedOptionsValues, setSelectedOptionsValues] = useState<{
    option: string;
    value: string;
    image: string;
  }[]>()

  return (
    currentProduct &&
    currentProduct.options &&
    currentProduct.options.length > 0 && (
      <div>
        <Card className="">
          <CardHeader>
            <CardTitle>Dynamic Variants Images Generator</CardTitle>
            <CardDescription>
              Create dynamic variants images for your products by selecting the
              variants and the images you want to use.
            </CardDescription>
            <Button className="w-fit" onClick={handleSave}>Save</Button>
          </CardHeader>
          <CardContent className="flex gap-4">
            <StageComponent />
            <div>
              {currentProduct.options.map((option) => (
                <div key={option.id} className="flex flex-col">
                  <div className="text-lg font-semibold">{option.name}</div>
                  <div className="flex space-x-4">
                    {option.values.map((v, i) => {
                      return (
                        <div

                          onClick={
                            () => {
                              if (!currentProduct) return;
                              if (!currentProduct?.dynamicVariantsOptionsImages) return;
                              setCurrentProduct({
                                ...currentProduct,
                                dynamicVariantsOptionsImages: currentProduct?.dynamicVariantsOptionsImages?.map((o) => {
                                  if (o.option === option.name ) {
                                    if(o.value === v){
                                    return {
                                      ...o,
                                      selected: true
                                    };
                                    }else{
                                      return {
                                        ...o,
                                        selected: false
                                      };
                                    }
                                  }
                                  return o;
                                }),
                              })
                            }
                          }
                          key={v + option.name + i}>
                          <div className={
                            cn(
                              "flex w-[130px] relative aspect-square bg-slate-50 border rounded-xl items-center space-x-2"
                              ,
                              currentProduct?.dynamicVariantsOptionsImages?.find((o) => o.option === option.name && o.value === v)?.selected ? "border-primary border-2" : ""
                            )}>
                            <div
                              className="absolute top-0 right-0"
                            >
                              <UploadImageProvider
                                key={v + option.name + i}
                                folder={"products/dynamicvariants"}
                                name={v4()}
                                callback={(url) => {
                                  if (!currentProduct) return;

                                  const dynamicOptions = currentProduct?.dynamicVariantsOptionsImages ?? [];

                                  // Find the existing entry for the current option and value, or create one
                                  const existingEntry = dynamicOptions.find(
                                    (o) => o.option === option.name && o.value === v
                                  );

                                  let updatedDynamicOptions;
                                  if (existingEntry) {
                                    // If entry exists, update its image
                                    updatedDynamicOptions = dynamicOptions.map((o) =>
                                      o.option === option.name && o.value === v
                                        ? { ...o, image: url }
                                        : o
                                    );
                                  } else {
                                    // If entry doesn't exist, add a new one
                                    updatedDynamicOptions = [
                                      ...dynamicOptions,
                                      { option: option.name, value: v, image: url, selected: false, x: 0, y: 0 },
                                    ];
                                  }

                                  // Update the product with the new image
                                  setCurrentProduct({
                                    ...currentProduct,
                                    dynamicVariantsOptionsImages: updatedDynamicOptions,
                                  });
                                }}
                              >
                                <div
                                  className="bg-white border p-2 rounded-xl"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                  }}
                                ><Upload className="w-4 h-4" /></div>
                              </UploadImageProvider>

                            </div>
                            <Image
                              src={
                                currentProduct?.dynamicVariantsOptionsImages?.find(
                                  (o) => o.option === option.name && o.value === v
                                )?.image ?? "/placeholder.png"
                              }
                              className="border-none mr-2 p-3 w-full h-full object-contain"
                              alt=""
                              width={100}
                              height={100}
                            />
                          </div>
                          <span>{v}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

            </div>
          </CardContent>
        </Card>
      </div>
    )
  );
}

export default Page;
