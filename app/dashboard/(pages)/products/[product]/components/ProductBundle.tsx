import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Product } from "@/types/product";
import { useProducts } from "@/store/products";
import { Checkbox } from "@/components/ui/checkbox";
import { and, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "@/store/storeInfos";
import { Button } from "@/components/ui/button";

function ProductBundel() {
  const { setCurrentProduct, currentProduct } = useProducts();
  const { storeId } = useStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products with out bundel", storeId],
    queryFn: async () => {
      if (!storeId) return null;
      const q = query(
        collection(db, "products"),
        and(
          where("storeId", "==", storeId),
          where("status", "==", "active"),
          where("hasBundle", "!=", true),
        ),
      );
      const products = getDocs(q).then((res) => ({
        docs: res.docs.map(
          (doc) =>
            ({
              ...doc.data(),
              id: doc.id,
            }) as Product,
        ),
      }));
      return products;
    },
    refetchOnWindowFocus: false,
  });
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error...{error.message}</div>;
  return (
    currentProduct && (
      <Card x-chunk="dashboard-07-chunk-3">
        <CardHeader>
          <CardTitle>Product Bundel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-3">
              <div className="flex gap-2 mb-2 items-center">
                <Checkbox
                  id="hasBundle"
                  checked={currentProduct.hasBundle}
                  onCheckedChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      hasBundle: e,
                    } as Product)
                  }
                />
                <Label htmlFor="hasBundle">Has Bundel</Label>
              </div>
              <div>
                <Label htmlFor="bundleProducts">Select Bundel Products</Label>
                <div className="flex gap-2 mt-2">
                  <Select
                    value={selectedProduct?.id}
                    onValueChange={(value) =>
                      setSelectedProduct(
                        products?.docs.find(
                          (product) => product.id === value,
                        ) ?? null,
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue>
                        {selectedProduct?.title ?? "Select Product"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {products?.docs.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button>Add Product</Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  );
}

export default ProductBundel;
