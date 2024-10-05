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

const ProductImagesCard = () => {
  return (
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
            <Image
              alt="Product image"
              height="300"
              src={Photo}
              width="300"
              className="opacity-50 w-10"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button>
              <div className="aspect-square border w-full rounded-md flex items-center justify-center bg-slate-50">
                <Image
                  alt="Product image"
                  height="84"
                  src={Photo}
                  width="84"
                  className="opacity-50 w-8"
                />
              </div>
            </button>
            <button>
              <div className="aspect-square border w-full rounded-md flex items-center justify-center bg-slate-50">
                <Image
                  alt="Product image"
                  height="84"
                  src={Photo}
                  width="84"
                  className="opacity-50 w-8"
                />
              </div>
            </button>
            <button className="flex aspect-square items-center justify-center rounded-md border border-dashed">
              <Upload className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductImagesCard;
