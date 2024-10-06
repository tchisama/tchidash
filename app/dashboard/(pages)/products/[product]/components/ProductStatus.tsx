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

const ProductStatusCard = () => {
  const { setCurrentProduct, currentProduct } = useProducts();
  return currentProduct ? (
    <Card>
      <CardHeader>
        <CardTitle>Product Status</CardTitle>
      </CardHeader>
      <CardContent>
        <Label htmlFor="status">Status</Label>
        <Select
          onValueChange={(value) => {
            setCurrentProduct({
              ...currentProduct,
              status: value as
                | "draft"
                | "active"
                | "archived"
                | "deleted"
                | "out_of_stock",
            } as Product);
          }}
          value={currentProduct.status}
        >
          <SelectTrigger id="status" aria-label="Select status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {["draft", "active", "archived"].map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  ) : null;
};

export default ProductStatusCard;
