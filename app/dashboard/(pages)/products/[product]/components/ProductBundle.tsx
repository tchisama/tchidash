import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useProducts } from "@/store/products";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { useStore } from "@/store/storeInfos";
import { collection, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { useQuery } from "@tanstack/react-query";
import { dbGetDocs } from "@/lib/dbFuntions/fbFuns";

const ProductBundle = () => {
  const { currentProduct, setCurrentProduct } = useProducts();
  const { storeId } = useStore();

  const { data: allProducts } = useQuery({
    queryKey: ["products", storeId],
    queryFn: async () => {
      if (!storeId) return [];
      const q = query(
        collection(db, "products"),
        where("storeId", "==", storeId)
      );
      const response = await dbGetDocs(q, storeId, "");
      return response.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Product[];
    },
  });

  const handleBundleToggle = (checked: boolean) => {
    if (!currentProduct) return;
    setCurrentProduct({
      ...currentProduct,
      hasBundle: checked,
      bundles: checked ? currentProduct.bundles || [] : [],
    });
  };

  const addBundleProduct = (product: Product) => {
    if (!currentProduct) return;
    const newBundle = {
      id: product.id,
      title: product.title,
    };
    setCurrentProduct({
      ...currentProduct,
      bundles: [...(currentProduct.bundles || []), newBundle],
    });
  };

  const removeBundleProduct = (bundleId: string) => {
    if (!currentProduct) return;
    setCurrentProduct({
      ...currentProduct,
      bundles: currentProduct.bundles?.filter((b) => b.id !== bundleId) || [],
    });
  };

  if (!currentProduct) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Bundle</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="bundle-toggle"
            checked={currentProduct.hasBundle}
            onCheckedChange={handleBundleToggle}
          />
          <Label htmlFor="bundle-toggle">Enable Product Bundle</Label>
        </div>

        {currentProduct.hasBundle && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Bundle Products</Label>
              <div className="grid gap-2">
                {currentProduct.bundles?.map((bundle) => (
                  <div
                    key={bundle.id}
                    className="flex items-center justify-between p-2 border rounded-md"
                  >
                    <span>{bundle.title}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeBundleProduct(bundle.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Add Products to Bundle</Label>
              <div className="grid gap-2">
                {allProducts
                  ?.filter(
                    (p) =>
                      p.id !== currentProduct.id &&
                      !currentProduct.bundles?.some((b) => b.id === p.id)
                  )
                  .map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-2 border rounded-md"
                    >
                      <span>{product.title}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addBundleProduct(product)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductBundle;
