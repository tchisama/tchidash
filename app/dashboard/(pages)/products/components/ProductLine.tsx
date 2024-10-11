"use client";

import React, {  useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Photo from "@/public/images/svgs/icons/photo.svg";
import Link from "next/link";
import {
  addDoc,
  collection,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useProducts } from "@/store/products";
import { db } from "@/firebase";
import { Product } from "@/types/product";
import { uniqueId } from "lodash";

const ProductLine = ({ product }: { product: Product }) => {
  const [showVariants, setShowVariants] = useState(false);
  const { setCurrentProduct, setLastUploadedProduct, setProducts, products } =
    useProducts();
  const router = useRouter();

  const toggleVariants = () => {
    setShowVariants(!showVariants);
  };

  const duplicateProduct = () => {
    const newProduct = {
      ...product,
      title: product.title + " copy",
      id: uniqueId(),
    };
    setProducts([...products, newProduct]);
    addDoc(collection(db, "products"), newProduct);
  };

  const archiveProduct = () => {
    updateDoc(doc(db, "products", product.id), {
      ...product,
      status: "archived",
    });
    setProducts(
      products.map((p) =>
        p.id === product.id ? { ...product, status: "archived" } : p,
      ),
    );
  };

  const deleteProduct = () => {
    updateDoc(doc(db, "products", product.id), {
      ...product,
      status: "deleted",
    });
    setProducts(products.filter((p) => p.id !== product.id));
  };
  // const stock = (product.variants && product.variants.length > 0)
  //   ? product.variants.reduce((acc, variant) => acc + variant.inventoryQuantity, 0)
  //   : product.stockQuantity;

  return (
    <>
      <TableRow key={product.id} className="group">
        <TableCell className="hidden sm:table-cell">
          {Array.isArray(product.images) &&
          (product.images[0] || product.variants?.find((v) => v.image)) ? (
            <Image
              src={
                product.images[0] ??
                product.variants?.find((v) => v.image)?.image
              }
              alt={product.title || "Product Image"}
              width={100}
              height={100}
              className="w-14 aspect-square object-contain border rounded-md p-[2px] duration-300"
            />
          ) : (
            <div className="w-14 aspect-square rounded-xl border bg-slate-50 flex justify-center items-center">
              <Image
                src={Photo}
                alt={product.title || "Placeholder Image"}
                width={40}
                height={40}
                className="w-6 h-6 opacity-50"
              />
            </div>
          )}
        </TableCell>
        <TableCell>
          <Link
            href={`/dashboard/products/${product.title.replaceAll(" ", "_")}`}
            onClick={() => {
              setCurrentProduct(product);
              setLastUploadedProduct(product);
            }}
          >
            <b>{product.title}</b>
          </Link>
        </TableCell>
        <TableCell>{product.variants?.length || 1} Variants</TableCell>
        <TableCell>
          <Badge variant="outline">{product.status}</Badge>
        </TableCell>
        <TableCell className="hidden md:table-cell">
          {product.variants && product.variants.length > 0
            ? Math.min(...product.variants.map((v) => v.price)) +
              " - " +
              Math.max(...product.variants.map((v) => v.price))
            : product.price}{" "}
          Dh
        </TableCell>
        <TableCell className="hidden md:table-cell"
        >
          <div>
          {product.variants && product.variants.length > 0
            ? Math.min(...product.variants.map((v) => v.inventoryQuantity)) +
              " ... " +
              Math.max(...product.variants.map((v) => v.inventoryQuantity))
            : product.stockQuantity}{" "}
          Items
          </div>
        </TableCell>
        <TableCell className="hidden md:table-cell">
          {product?.totalSales ?? 0} Sales
        </TableCell>
        <TableCell className="hidden md:table-cell">
          {product.createdAt.toDate().toLocaleDateString()}
        </TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setCurrentProduct(product);
                  setLastUploadedProduct(product);
                  router.push(
                    `/dashboard/products/${product.title.replaceAll(" ", "_")}`,
                  );
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={duplicateProduct}>
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={archiveProduct}>
                Archive
              </DropdownMenuItem>
              <DropdownMenuItem onClick={deleteProduct}>
                Delete
              </DropdownMenuItem>
              {
                product.variants && product.variants.length > 0 &&
              <DropdownMenuItem
                onClick={() => {
                  toggleVariants();
                }}
              >
                {showVariants ? "Hide Variants" : "Show Variants"}
              </DropdownMenuItem>
              }
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      {showVariants && product.variants && product.variants?.length > 0 && (
        <TableRow >
          <TableCell colSpan={8}>
            <div className="bg-slate-50 ml-4 border w-fit rounded-xl">
              <h1 className="text-xl font-semibold p-3">Variants</h1>
            <Table className="w-fit min-w-[600px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Variant Title</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Total Sales</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {
                  product?.variants &&
                product?.variants.map((variant, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {variant.image ? (
                        <Image
                          src={variant.image}
                          alt={variant.title || "Variant Image"}
                          width={60}
                          height={60}
                          className="w-12 aspect-square object-contain border rounded-md p-[2px]"
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
                    <TableCell>{variant.inventoryQuantity || 0}</TableCell>
                    <TableCell>{variant.totalSales || 0}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};
export {ProductLine}