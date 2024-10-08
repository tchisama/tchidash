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
import { Upload, X } from "lucide-react";
import UploadImageProvider from "@/components/UploadImageProvider";
import { useProducts } from "@/store/products";
import {  Variant } from "@/types/product";
import { Button } from "@/components/ui/button";

const ProductImagesCard = ({
  variantState,
}: {
  variant?: string;
  variantState: {
    variantProduct: Variant | null;
    setVariantProduct: (variant: Variant) => void;
  };
}) => {
  const { currentProduct } = useProducts();
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
            <ImageView
              variantState={variantState}
              url={
                variantState.variantProduct && variantState.variantProduct.image
                  ? variantState.variantProduct.image
                  : ""
              }
            />
          </div>
        </CardContent>
      </Card>
    )
  );
};

const ImageView = ({
  url,
  variantState,
}: {
  url: string;
  variantState: {
    variantProduct: Variant | null;
    setVariantProduct: (variant: Variant) => void;
  };
}) => {
  return (
    <div className="aspect-square border relative overflow-hidden w-full group rounded-md flex items-center justify-center bg-slate-50">
      <div className="absolute -top-20 group-hover:top-2 right-2  duration-200">
        {url ? (
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              console.log("Remove image");
              if (!variantState.variantProduct) return;
              variantState.setVariantProduct({
                ...variantState.variantProduct as Variant,
                image: "",
              } as Variant);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        ) : (
          <UploadImageProvider
            folder="products"
            name={
              "product-" +
              variantState.variantProduct?.id +
              "-image-" +
              Math.random()
            }
            callback={(url) => {
              if (!variantState.variantProduct) return;
              variantState.setVariantProduct({
                ...variantState.variantProduct,
                image: url,
              } as Variant);
            }}
          >
            <div className="h-8 w-8 border rounded-md bg-white flex items-center justify-center">
              <Upload className="h-4 w-4" />
            </div>
          </UploadImageProvider>
        )}
      </div>
      {url ? (
        <Image
          alt="Product image"
          height="84"
          src={url}
          width={600}
          className="w-full aspect-square p-2 object-contain"
        />
      ) : (
        <PlasholderImage />
      )}
    </div>
  );
};
const PlasholderImage = () => {
  return (
    <div className="flex items-center justify-center">
      <Image
        alt="Product image"
        height="84"
        src={Photo}
        width={60}
        className="opacity-50 w-8"
      />
    </div>
  );
};

export default ProductImagesCard;
