import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Variant } from "@/types/product";

const ProductDetailsCard = ({
  variantState,
}: {
  variant?: string;
  variantState: {
    variantProduct: Variant | null;
    setVariantProduct: (variant: Variant) => void;
  };
}) => {
  return variantState.variantProduct ? (
    <Card>
      <CardHeader>
        <CardTitle>Product Details</CardTitle>
        <CardDescription>
          Lipsum dolor sit amet, consectetur adipiscing elit
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
                variantState.setVariantProduct({
                  ...variantState.variantProduct,
                  title: e.target.value ?? "",
                } as Variant)
              }
              value={variantState.variantProduct.title}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              className="min-h-32"
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                variantState.setVariantProduct({
                  ...variantState.variantProduct,
                  description: e.target.value ?? "",
                } as Variant)
              }
              value={variantState.variantProduct.description}
            />
            <div className="flex gap-2">
              <div>
                <Label className="mb-2" htmlFor="price">
                  Price
                </Label>
                <Input
                  id="price"
                  type="number"
                  className="w-full "
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    variantState.setVariantProduct({
                      ...variantState.variantProduct,
                      price: parseFloat(e.target.value) ?? 0,
                    } as Variant)
                  }
                  value={variantState.variantProduct.price}
                />
              </div>
              <div>
                <Label className="mb-2" htmlFor="inventoryQuantity">
                  Inventory Quantity
                </Label>
                <Input
                  id="inventoryQuantity"
                  type="number"
                  className="w-full "
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    variantState.setVariantProduct({
                      ...variantState.variantProduct,
                      inventoryQuantity: parseInt(e.target.value) ?? 0,
                    } as Variant)
                  }
                  value={variantState.variantProduct.inventoryQuantity}
                />
              </div>
            </div>
          </div>
          <div></div>
        </div>
      </CardContent>
    </Card>
  ) : null;
};

export default ProductDetailsCard;
