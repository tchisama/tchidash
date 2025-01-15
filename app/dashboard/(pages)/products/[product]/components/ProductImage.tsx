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
import { useProducts } from "@/store/products";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import FilesystemExplorer from "@/components/FilesystemExplorer";

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
            <ImageView index={0} />
            <div className="grid grid-cols-3 gap-2 overflow-hidden ">
              <ImageView index={1} />
              <ImageView index={2} />
              {
                //<UploadImageProvider
                //  folder="products"
                //  name={
                //    "product-" + currentProduct.id + "-image-" + Math.random()
                //  }
                //  callback={(url) => {
                //    if (!currentProduct) return;
                //    setCurrentProduct({
                //      ...currentProduct,
                //      images: [...(currentProduct.images ?? []), url],
                //    } as Product);
                //  }}
                //>
                //  <div className="w-full h-full flex justify-center items-center bg-slate-50 border border-dashed rounded-md">
                //    <Upload className="h-4 w-4 text-muted-foreground" />
                //  </div>
                //</UploadImageProvider>
              }
              <FilesystemExplorer
                callback={(url) => {
                  if (!currentProduct) return;
                  setCurrentProduct({
                    ...currentProduct,
                    images: [...(currentProduct.images ?? []), url],
                  } as Product);
                }}
              >
                {
                  <div className="w-full h-full flex justify-center items-center bg-slate-50 border border-dashed rounded-md">
                    <Upload className="h-4 w-4 text-muted-foreground" />
                  </div>
                }
              </FilesystemExplorer>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  );
};

const ImageView = ({ index }: { index: number }) => {
  const { currentProduct, setCurrentProduct } = useProducts();

  return (
    <div className="aspect-square border relative overflow-hidden w-full group rounded-md flex items-center justify-center bg-slate-50">
      {currentProduct?.images && currentProduct?.images.length > index ? (
        <Image
          alt="Product image"
          height="84"
          src={currentProduct.images[index]}
          width={600}
          className="w-full h-full object-contain border rounded-md p-2"
        />
      ) : (
        <PlasholderImage />
      )}
      {currentProduct?.images && currentProduct?.images.length > index && (
        <div className="absolute -top-12 group-hover:top-2 duration-200 right-2 ">
          <Button
            className=""
            size="icon"
            variant={"outline"}
            onClick={() => {
              if (!currentProduct) return;
              const images = currentProduct.images?.filter(
                (_, i) => i !== index,
              );
              setCurrentProduct({ ...currentProduct, images } as Product);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
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
        width="84"
        className="opacity-50 w-8"
      />
    </div>
  );
};

export default ProductImagesCard;
