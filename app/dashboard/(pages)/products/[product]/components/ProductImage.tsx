"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Photo from "@/public/images/svgs/icons/photo.svg";
import { Upload } from "lucide-react";
import UploadImageProvider from "@/components/UploadImageProvider";
import { useProducts } from "@/store/products";
import { Product } from "@/types/product";

const ProductImagesCard = () => {
  const { setCurrentProduct, currentProduct } = useProducts();
  return (
    currentProduct && (
      <Card>
        <CardHeader>
          <CardTitle>Product Images</CardTitle>
          <CardDescription>
            Lipsum dolor sit amet, consectetur adipiscing elit
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <div className="aspect-square w-full border rounded-md flex items-center justify-center bg-slate-50">
              {currentProduct?.images && currentProduct?.images.length > 0 ? (
                <Image
                  alt="Product image"
                  height="84"
                  src={currentProduct.images[0]}
                  width="84"
                  className="w-full h-full object-contain p-3 border rounded-md"
                />
              ) : (
                <PlasholderImage />
              )}
            </div>
            <div className="grid grid-cols-3 gap-2 overflow-hidden ">
              <div className="aspect-square border w-full rounded-md flex items-center justify-center bg-slate-50">
                {currentProduct?.images && currentProduct?.images.length > 1 ? (
                  <Image
                    alt="Product image"
                    height="84"
                    src={currentProduct.images[1]}
                    width="84"
                    className="w-full h-full object-contain border rounded-md p-2"
                  />
                ) : (
                  <PlasholderImage />
                )}
              </div>
              <div className="aspect-square border w-full rounded-md flex items-center justify-center bg-slate-50">
                {currentProduct?.images && currentProduct?.images.length > 2 ? (
                  <Image
                    alt="Product image"
                    height="84"
                    src={currentProduct.images[2]}
                    width="84"
                    className="w-full h-full object-contain border rounded-md p-2"
                  />
                ) : (
                  <PlasholderImage />
                )}
              </div>
              <UploadImageProvider
                folder="products"
                name="product-image-1"
                callback={(url) => {
                  if (!currentProduct) return;
                  setCurrentProduct({
                    ...currentProduct,
                    images: [...(currentProduct.images ?? []), url],
                  } as Product);
                }}
              >
                <div className="w-full h-full flex justify-center items-center bg-slate-50 border border-dashed rounded-md">
                  <Upload className="h-4 w-4 text-muted-foreground" />
                </div>
              </UploadImageProvider>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  );
};
const PlasholderImage = () => {
  return (
    <div className="flex items-center justify-center">
      <Image
        alt="Product image"
        height="84"
        src={Photo}
        width="84"
        className="opacity-50 w-8"
      />
    </div>
  );
};

export default ProductImagesCard;
