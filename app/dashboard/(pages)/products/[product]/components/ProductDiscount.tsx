import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Product } from "@/types/product";
import { useProducts } from "@/store/products";

function ProductDiscount() {
  const { setCurrentProduct, currentProduct } = useProducts();

  return (
    currentProduct && (
      <Card x-chunk="dashboard-07-chunk-3">
        <CardHeader>
          <CardTitle>Product Discount</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="discount">Discount</Label>
              <div className="grid gap-3 md:grid-cols-1">
                <Select
                  value={
                    currentProduct?.discount && currentProduct?.discount.type
                  }
                  onValueChange={(value) =>
                    setCurrentProduct({
                      ...currentProduct,
                      discount: {
                        ...currentProduct.discount,
                        type: value as "percentage" | "fixed",
                      },
                    } as Product)
                  }
                >
                  <SelectTrigger
                    id="discount"
                    aria-label="Select type discount"
                  >
                    <SelectValue placeholder="discount type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed</SelectItem>
                    <SelectItem value="percentage">Percentage</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                  <Input
                    id="discount"
                    type="number"
                    className="w-full"
                    defaultValue="10"
                    value={
                      currentProduct?.discount && currentProduct.discount.amount
                    }
                    onChange={(e) =>
                      setCurrentProduct({
                        ...currentProduct,
                        discount: {
                          ...currentProduct.discount,
                          amount: Number(e.target.value),
                        },
                      } as Product)
                    }
                  />
                  <div className="w-10">
                    {currentProduct?.discount?.type === "percentage"
                      ? ` %`
                      : ` Dh`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  );
}

export default ProductDiscount;
