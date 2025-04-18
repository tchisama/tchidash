import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useProducts } from "@/store/products";
import { Button } from "@/components/ui/button";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/storeInfos";

const ProductDangerZone = () => {
  const { products, setProducts, setCurrentProduct, currentProduct } =
    useProducts();
  const { storeId } = useStore();
  const router = useRouter();
  return currentProduct ? (
    <Card className="border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle>Danger Zone</CardTitle>
        <CardDescription>
          Are you sure you want to delete this product?
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={() => {
            if (!storeId) return;
            deleteDoc(
              doc(db, "products", currentProduct.id)
            ).then(() => {
              setCurrentProduct(null);
              router.push("/dashboard/products");
              setProducts(products.filter((p) => p.id !== currentProduct.id));
            });
          }}
          variant="destructive"
        >
          Delete Product
        </Button>
      </CardContent>
    </Card>
  ) : null;
};

export default ProductDangerZone;
