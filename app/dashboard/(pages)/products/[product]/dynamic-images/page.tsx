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

function Page() {
  const { setCurrentProduct, currentProduct } = useProducts();
  const q;
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
          </CardHeader>
          <CardContent className="flex gap-4">
            <StageComponent />
            <div>
              {currentProduct.options.map((option) => (
                <div key={option.id} className="flex flex-col">
                  <div className="text-lg font-semibold">{option.name}</div>
                  <div className="flex space-x-4">
                    {option.values.map((v) => {
                      return (
                        <div key={v} className="flex items-center space-x-2">
                          <input type="checkbox" className="form-checkbox" />
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
