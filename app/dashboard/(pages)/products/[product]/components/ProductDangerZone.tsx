import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useProducts } from "@/store/products";
import { Button } from "@/components/ui/button";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";

const ProductDangerZone = () => {
  const { products,setProducts, setCurrentProduct, currentProduct } = useProducts();
  const router = useRouter();
  return currentProduct ? (
    <Card className="border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle>Danger Zone</CardTitle>
        <CardDescription>Are you sure you want to delete this product?</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={()=>{
            deleteDoc(
              doc(db, "products", currentProduct.id)
            )
            setCurrentProduct(null)
            setProducts(products.filter((p) => p.id !== currentProduct.id))
            router.push("/dashboard/products")
          }}
          variant="destructive"
        >Delete Product</Button>
      </CardContent>
    </Card>
  ) : null;
};

export default ProductDangerZone;
