import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProducts } from "@/store/products";
import Image from "next/image";
import Photo from "@/public/images/svgs/icons/photo.svg";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const ProductVariantsCard = ({ sku }: { sku: string }) => {
  const { currentProduct: product } = useProducts();
  const router = useRouter();
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Product Variants Navigator</CardTitle>
      </CardHeader>
      <CardContent className="h-fit">
        <Table className="">
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Variant Title</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {product?.variants &&
              product?.variants.map((variant, index) => (
                <TableRow
                  onClick={() => {
                    router.push(
                      `/dashboard/products/${product?.title.replaceAll(" ", "_")}/${variant.sku}`,
                    );
                  }}
                  key={index}
                  className={cn(
                    "cursor-pointer",
                    sku === variant.sku && "bg-slate-100",
                  )}
                >
                  <TableCell>
                    {variant?.images ? (
                      <Image
                        src={variant.images[0] ?? ""}
                        alt={variant.title || "Variant Image"}
                        width={60}
                        height={60}
                        className="w-12 aspect-square object-cover border rounded-md p-[2px]"
                      />
                    ) : (
                      <div className="w-12 aspect-square rounded-xl border bg-slate-50 flex justify-center items-center">
                        <Image
                          src={Photo}
                          alt="No image available"
                          width={30}
                          height={30}
                          className="w-6 h-6 opacity-50"
                        />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{variant.title || "Untitled Variant"}</TableCell>
                  <TableCell>{variant.price} Dh</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ProductVariantsCard;

