import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useProducts } from "@/store/products";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "@/store/storeInfos";
import { fetchStore } from "@/lib/queries/store";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function ProductDynamicVariantsImages() {
  const { setCurrentProduct, currentProduct } = useProducts();
  const { storeId } = useStore();

  const { data: store } = useQuery({
    queryKey: ["store", storeId],
    queryFn: () => {
      if (!storeId) return null;
      return fetchStore({ storeId });
    },
    refetchOnWindowFocus: false,
  });

  const [dynamicVariantsImages, setDynamicVariantsImages] = useState(false);
  useEffect(() => {
    if (!currentProduct) return;
    setDynamicVariantsImages(currentProduct.dynamicVariantsImages ?? false);
  }, [currentProduct, setDynamicVariantsImages]);

  return (
    store &&
    store?.settings?.dynamicVariantsImages &&
    currentProduct && (
      <Card x-chunk="dashboard-07-chunk-3">
        <CardHeader>
          <CardTitle>Dynamic Variants Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Checkbox
              checked={dynamicVariantsImages}
              onCheckedChange={(checked: boolean) => {
                setDynamicVariantsImages(checked ?? false);
                setCurrentProduct({
                  ...currentProduct,
                  dynamicVariantsImages: checked,
                });
              }}
              id="dynamicVariantsImages"
            />
            <Label htmlFor="dynamicVariantsImages">
              Enable dynamic variants images in this Product
            </Label>
          </div>
          {dynamicVariantsImages && (
            <div className="mt-4">
              <Link
                className="mt-4"
                href={`/dashboard/products/${currentProduct.title.replaceAll(" ", "_")}/dynamic-images`}
              >
                <Button>Manage Dynamic Variants Images</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    )
  );
}

export default ProductDynamicVariantsImages;
