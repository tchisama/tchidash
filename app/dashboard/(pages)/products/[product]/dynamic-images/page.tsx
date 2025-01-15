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
import {
  and,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useStore } from "@/store/storeInfos";
import { db } from "@/firebase";
import { Product } from "@/types/product";
import { useEffect } from "react";
import Image from "next/image";
import UploadImageProvider from "@/components/UploadImageProvider";
import { v4 } from "uuid";
import { ArrowDownToLine, ArrowUpToLine, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useDynamicVariantsImages } from "@/store/dynamicVariantsImages";
import { Slider } from "@/components/ui/slider";
import OneVariant from "./components/OneVariant";

function Page({ params }: { params: { product: string } }) {
  const { currentProduct, setCurrentProduct } = useProducts();
  const { storeId } = useStore();

  const { savefunctions } = useDynamicVariantsImages();

  useEffect(() => {
    console.log(savefunctions);
  }, [savefunctions]);

  const { data: product } = useQuery({
    queryKey: ["product", params.product],
    queryFn: () => {
      if (!storeId) return;
      const q = query(
        collection(db, "products"),
        and(
          where("storeId", "==", storeId),
          where("title", "==", params.product.replaceAll("_", " ")),
        ),
      );
      const response = getDocs(q).then((response) =>
        response.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as Product),
      );
      return response;
    },
    staleTime: 0,
  });
  useEffect(() => {
    if (!product) return;
    if (!product?.length) return;
    setCurrentProduct(product[0]);
  }, [product, setCurrentProduct]);

  useEffect(() => {
    console.log(currentProduct);
    if (!currentProduct) return;
    //updateDoc(doc(db, "products", currentProduct.id), currentProduct)
  }, [currentProduct]);

  const handleSave = async () => {
    if (!currentProduct) return;

    if (!currentProduct?.dynamicVariantsOptionsImages) {
      // Create the dynamic variant options images
      const allOptions: Product["dynamicVariantsOptionsImages"] = [];
      currentProduct?.options?.forEach((option) => {
        option.values.forEach((v) => {
          allOptions.push({
            option: option.name,
            value: v,
            image: "",
            selected: false,
            x: 0,
            y: 0,
            scaleX: 30,
            scaleY: 30,
          });
        });
      });
      setCurrentProduct({
        ...currentProduct,
        dynamicVariantsOptionsImages: allOptions,
      });
    }
    const ids: Array<{ [key: string]: string }> = [];

    // Use for...of loop for async operations with Object.keys()
    for (const key of Object.keys(savefunctions)) {
      await new Promise((resolve) => {
        setTimeout(async () => {
          const id = savefunctions[key]();
          ids.push({ [key]: id });
          resolve(true); // Resolves the promise after savefunction is called
        }, 100); // Delay each function call by i * 1000ms
      });
    }

    // Update the product with the new dynamic variant options images
    setCurrentProduct({
      ...currentProduct,
      variants: currentProduct.variants?.map((v) => ({
        ...v,
        image:
          `https://firebasestorage.googleapis.com/v0/b/tchidash-fd7aa.appspot.com/o/${ids
            .find((i) => i[v.id])
            ?.[v.id].replace(
              /\//g,
              "%2F",
            )}?alt=media&token=7a7fea2e-50bb-44b1-a887-b8411a96e862` || "", // Ensure image update from ids
      })),
    });

    //if (!currentProduct) return;
    //if (!currentProduct.variants) return;
    //setCurrentProduct({
    //  ...currentProduct,
    //  variants: currentProduct.variants.map((v) => {
    //    if (v.id === currentProductVariant.id) {
    //      return {
    //        ...v,
    //        image: `https://firebasestorage.googleapis.com/v0/b/tchidash-fd7aa.appspot.com/o/${iamgeId
    //          .replace(/\//g, "%2F")
    //          .replace(/\./g, "%2E")
    //          .replace(/\?/g, "%3F")
    //          .replace(
    //            /=/g,
    //            "%3D",
    //          )}?alt=media&token=7a7fea2e-50bb-44b1-a887-b8411a96e862`,
    //      };
    //    }
    //    return v;
    //  }),
    //});

    updateDoc(doc(db, "products", currentProduct.id), {
      ...currentProduct,
      variants: currentProduct.variants?.map((v) => ({
        ...v,
        image:
          `https://firebasestorage.googleapis.com/v0/b/tchidash-fd7aa.appspot.com/o/${ids
            .find((i) => i[v.id])
            ?.[v.id].replace(
              /\//g,
              "%2F",
            )}?alt=media&token=${Math.random().toString().replace(".", "")}` ||
          "",
      })),
    });
  };

  const { selectedOption } = useDynamicVariantsImages();

  return (
    currentProduct &&
    currentProduct.options &&
    currentProduct.options.length > 0 && (
      <div className="relative">
        <Card className="">
          <CardHeader>
            <CardTitle>Dynamic Variants Images Generator</CardTitle>
            <CardDescription>
              Create dynamic variants images for your products by selecting the
              variants and the images you want to use.
            </CardDescription>
            <div className="flex absolute top-4 right-4 gap-2">
              <Button className="w-fit" onClick={handleSave}>
                Save
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="flex flex-col">
                <StageComponent />
                <div className="flex gap-2 py-2">
                  <Button
                    onClick={() => {
                      if (!currentProduct) return;
                      if (!selectedOption) return;
                      if (!currentProduct.dynamicVariantsOptionsImages) return;
                      // Find the index of the selected image
                      const getIt =
                        currentProduct.dynamicVariantsOptionsImages.find(
                          (o) => o.image === selectedOption,
                        );

                      // Ensure the index is valid and not the first item

                      // Create a copy of the dynamicVariantsOptionsImages
                      const updatedImages = [
                        ...currentProduct.dynamicVariantsOptionsImages,
                      ];

                      // remove the selected image from the array
                      const removeSelected = updatedImages.filter(
                        (o) => o.option !== getIt?.option,
                      );
                      const selected = updatedImages.filter(
                        (o) => o.option === getIt?.option,
                      );
                      // add it back in the correct position (last place)

                      // Update the currentProduct with the new order
                      setCurrentProduct({
                        ...currentProduct,
                        dynamicVariantsOptionsImages: [
                          ...removeSelected,
                          ...selected,
                        ],
                      });
                    }}
                    size={"icon"}
                    variant={"outline"}
                    className=""
                  >
                    <ArrowUpToLine className="h-4 w-4" />
                  </Button>

                  <Button
                    onClick={() => {
                      if (!currentProduct) return;
                      if (!selectedOption) return;
                      if (!currentProduct.dynamicVariantsOptionsImages) return;
                      // Find the index of the selected image

                      const getIt =
                        currentProduct?.dynamicVariantsOptionsImages?.find(
                          (o) => o.image === selectedOption,
                        );
                      if (!getIt) return;
                      // Ensure the index is valid and not the first item
                      if (
                        getIt?.option ===
                        currentProduct?.dynamicVariantsOptionsImages[0].option
                      )
                        return;
                      // Create a copy of the dynamicVariantsOptionsImages
                      const updatedImages = [
                        ...currentProduct?.dynamicVariantsOptionsImages,
                      ];
                      // remove the selected image from the array
                      const removeSelected = updatedImages.filter(
                        (o) => o.option !== getIt?.option,
                      );
                      // add it back in the correct position (last place)
                      const selected = updatedImages.filter(
                        (o) => o.option === getIt?.option,
                      );
                      // Update the currentProduct with the new order

                      setCurrentProduct({
                        ...currentProduct,
                        dynamicVariantsOptionsImages: [
                          ...selected,
                          ...removeSelected,
                        ],
                      });
                    }}
                    size={"icon"}
                    variant={"outline"}
                    className=""
                  >
                    <ArrowDownToLine className="h-4 w-4" />
                  </Button>
                  <Slider
                    min={2}
                    max={60}
                    value={[
                      currentProduct?.dynamicVariantsOptionsImages?.find(
                        (o) => o.image === selectedOption,
                      )?.scaleX ?? 0,
                    ]}
                    onValueChange={(v) => {
                      if (!currentProduct) return;
                      if (!selectedOption) return;
                      if (!currentProduct.dynamicVariantsOptionsImages) return;
                      const getIt =
                        currentProduct?.dynamicVariantsOptionsImages?.find(
                          (o) => o.image === selectedOption,
                        );
                      setCurrentProduct({
                        ...currentProduct,
                        dynamicVariantsOptionsImages:
                          currentProduct?.dynamicVariantsOptionsImages?.map(
                            (o) => {
                              if (getIt?.option == o.option) {
                                return {
                                  ...o,
                                  scaleX: v[0],
                                  scaleY: v[0],
                                };
                              }
                              return o;
                            },
                          ),
                      });
                    }}
                  />
                </div>
              </div>
              <div className="flex-1  overflow-x-auto max-w-[1000px]">
                {currentProduct.options.map((option) => (
                  <div key={option.id} className="flex  flex-col">
                    <div className="text-lg font-semibold">{option.name}</div>
                    <div className="flex space-x-4  overflow-x-auto">
                      {option.values.map((v, i) => {
                        return (
                          <div
                            onClick={() => {
                              if (!currentProduct) return;
                              if (!currentProduct?.dynamicVariantsOptionsImages)
                                return;
                              setCurrentProduct({
                                ...currentProduct,
                                dynamicVariantsOptionsImages:
                                  currentProduct?.dynamicVariantsOptionsImages?.map(
                                    (o) => {
                                      if (o.option === option.name) {
                                        if (o.value === v) {
                                          return {
                                            ...o,
                                            selected: true,
                                          };
                                        } else {
                                          return {
                                            ...o,
                                            selected: false,
                                          };
                                        }
                                      }
                                      return o;
                                    },
                                  ),
                              });
                            }}
                            key={v + option.name + i}
                          >
                            <div
                              className={cn(
                                "flex w-[130px] relative aspect-square bg-slate-50 border rounded-xl items-center space-x-2",
                                currentProduct?.dynamicVariantsOptionsImages?.find(
                                  (o) =>
                                    o.option === option.name && o.value === v,
                                )?.selected
                                  ? "border-primary border-2"
                                  : "",
                              )}
                            >
                              <div className="absolute top-0 right-0">
                                <UploadImageProvider
                                  key={v + option.name + i}
                                  folder={"products/dynamicvariants"}
                                  name={v4()}
                                  callback={(url) => {
                                    if (!currentProduct) return;

                                    const dynamicOptions =
                                      currentProduct?.dynamicVariantsOptionsImages ??
                                      [];

                                    // Find the existing entry for the current option and value, or create one
                                    const existingEntry = dynamicOptions.find(
                                      (o) =>
                                        o.option === option.name &&
                                        o.value === v,
                                    );

                                    let updatedDynamicOptions;
                                    if (existingEntry) {
                                      // If entry exists, update its image
                                      updatedDynamicOptions =
                                        dynamicOptions.map((o) =>
                                          o.option === option.name &&
                                          o.value === v
                                            ? { ...o, image: url }
                                            : o,
                                        );
                                    } else {
                                      // If entry doesn't exist, add a new one
                                      updatedDynamicOptions = [
                                        ...dynamicOptions,
                                        {
                                          option: option.name,
                                          value: v,
                                          image: url,
                                          selected: false,
                                          x: 0,
                                          y: 0,
                                          scaleX: 1,
                                          scaleY: 1,
                                        },
                                      ];
                                    }

                                    // Update the product with the new image
                                    setCurrentProduct({
                                      ...currentProduct,
                                      dynamicVariantsOptionsImages:
                                        updatedDynamicOptions,
                                    });
                                  }}
                                >
                                  <div
                                    className="bg-white border p-2 rounded-xl"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                    }}
                                  >
                                    <Upload className="w-4 h-4" />
                                  </div>
                                </UploadImageProvider>
                              </div>
                              <Image
                                src={
                                  currentProduct?.dynamicVariantsOptionsImages?.find(
                                    (o) =>
                                      o.option === option.name && o.value === v,
                                  )?.image ?? "/placeholder.png"
                                }
                                className="border-none mr-2 p-3 w-full h-full object-contain"
                                alt=""
                                width={100}
                                height={100}
                              />
                            </div>
                            <span className="text-xs">{v}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className=" gap-2 flex max-w-[1300px] overflow-x-scroll">
              {currentProduct.variants?.map((variant) => (
                <div className="bg-slate-50 border rounded-xl" key={variant.id}>
                  <OneVariant currentProductVariant={variant} />
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
