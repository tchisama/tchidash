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
import { Variant } from "@/types/product";
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

  const handleAddImage = (newUrl: string) => {
    if (!variantState.variantProduct) return;
    const updatedImages = [
      ...(variantState.variantProduct?.images ?? []),
      newUrl,
    ];
    variantState.setVariantProduct({
      ...variantState.variantProduct,
      images: updatedImages,
    });
  };

  const handleRemoveImage = (index: number) => {
    if (!variantState.variantProduct) return;
    const updatedImages = [...(variantState.variantProduct?.images ?? [])];
    updatedImages.splice(index, 1); // Remove the image at the specified index
    variantState.setVariantProduct({
      ...variantState.variantProduct,
      images: updatedImages,
    });
  };

  return (
    currentProduct && (
      <Card className="w-fit">
        <CardHeader>
          <CardTitle>Product Images</CardTitle>
          <CardDescription>
            Lipsum dolor sit amet, consectetur adipiscing elit
          </CardDescription>
        </CardHeader>
        <CardContent className="w-fit">
          <div className="grid grid-cols-2 w-full gap-2">
            {/* Render all images in the variant.images array */}
            {variantState.variantProduct?.images?.map((url, index) => (
              <ImageView
                key={index}
                url={url}
                onRemove={() => handleRemoveImage(index)}
              />
            ))}
            {/* Add a placeholder for uploading new images */}
            <ImageView url="" onAdd={handleAddImage} />
          </div>
        </CardContent>
      </Card>
    )
  );
};

const ImageView = ({
  url,
  onRemove,
  onAdd,
}: {
  url: string;
  onRemove?: () => void;
  onAdd?: (url: string) => void;
}) => {
  return (
    <div className="min-h-[150px] border relative overflow-hidden w-full group rounded-md flex items-center justify-center bg-slate-50">
      <div className="absolute -top-20 group-hover:top-2 right-2 duration-200">
        {url ? (
          <Button variant="outline" size="icon" onClick={onRemove}>
            <X className="h-4 w-4" />
          </Button>
        ) : (
          <UploadImageProvider
            folder="products"
            name={"product-image-" + Math.random()}
            callback={(newUrl) => {
              if (onAdd) onAdd(newUrl);
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
          className="w-full p-2 object-contain"
        />
      ) : (
        <PlasholderImage />
      )}
    </div>
  );
};

const PlasholderImage = () => {
  return (
    <div className="flex w-full items-center justify-center">
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
