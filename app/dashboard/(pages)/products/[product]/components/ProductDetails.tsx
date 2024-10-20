import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProducts } from "@/store/products";
import { Product } from "@/types/product";
import { Copy } from "lucide-react";

const ProductDetailsCard = () => {
  const { setCurrentProduct, currentProduct } = useProducts();
  return currentProduct ? (
    <Card>
      <CardHeader>
        <CardTitle>Product Details</CardTitle>
        <CardDescription>
          Product Id : {currentProduct.id}
          <Button
            onClick={() =>
              navigator.clipboard.writeText(
                currentProduct.id + " " + currentProduct.title || "",
              )
            }
            variant={"ghost"}
            className="p-1 w-6 h-6"
          >
            <Copy className="w-3 h-3" />
          </Button>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="name">Name</Label>
            <Input
              id="title"
              type="text"
              className="w-full "
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCurrentProduct({
                  ...currentProduct,
                  title: e.target.value ?? "",
                } as Product)
              }
              value={currentProduct.title}
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={currentProduct.canBeSaled}
              onCheckedChange={(value) =>
                setCurrentProduct({
                  ...currentProduct,
                  canBeSaled: value,
                } as Product)
              }
              id="canBeSaled"
            />
            <Label htmlFor="canBeSaled">This product can be saled</Label>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              className="min-h-32"
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setCurrentProduct({
                  ...currentProduct,
                  description: e.target.value ?? "",
                } as Product)
              }
              value={currentProduct.description}
            />
            {((currentProduct.options && currentProduct.options.length == 0) ||
              currentProduct.variantsAreOneProduct == true) && (
              <>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  className="w-full max-w-[300px] mb-4 mt-2"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCurrentProduct({
                      ...currentProduct,
                      price: parseFloat(e.target.value) ?? 0,
                    } as Product)
                  }
                  value={currentProduct.price}
                />
                <div className="flex gap-2 items-center">
                  <Checkbox
                    id="hasInfiniteStock"
                    checked={currentProduct?.hasInfiniteStock}
                    onCheckedChange={(value) =>
                      setCurrentProduct({
                        ...currentProduct,
                        hasInfiniteStock: value,
                      } as Product)
                    }
                  ></Checkbox>
                  <Label htmlFor="hasInfiniteStock" className="ml-2">
                    has Infinite Stock ?
                  </Label>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  ) : null;
};

export default ProductDetailsCard;
