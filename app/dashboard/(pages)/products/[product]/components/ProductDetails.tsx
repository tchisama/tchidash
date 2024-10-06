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
import { useProducts } from "@/store/products";
import { Product } from "@/types/product";

const ProductDetailsCard = () => {
  const { setCurrentProduct, currentProduct } = useProducts();
  return currentProduct ? (
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
                setCurrentProduct({
                  ...currentProduct,
                  title: e.target.value ?? "",
                } as Product)
              }
              value={currentProduct.title}
            />
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
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              className="w-full max-w-[300px]"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCurrentProduct({
                  ...currentProduct,
                  price: parseFloat(e.target.value) ?? 0,
                } as Product)
              }
              value={currentProduct.price}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  ) : null;
};

export default ProductDetailsCard;
