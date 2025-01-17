"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  AlarmClockCheck,
  Archive,
  Copy,
  Edit,
  Eye,
  EyeOff,
  MoreHorizontal,
  ShoppingCartIcon,
  Trash2,
} from "lucide-react";
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
  collection,
  doc,
  getAggregateFromServer,
  query,
  sum,
  updateDoc,
  where,
} from "firebase/firestore";
import { useProducts } from "@/store/products";
import { db } from "@/firebase";
import { Product, Variant } from "@/types/product";
import { uniqueId } from "lodash";
import { useStore } from "@/store/storeInfos";
import { getStock } from "@/lib/fetchs/stock";
import { useQuery } from "@tanstack/react-query";
import { dbAddDoc, dbUpdateDoc } from "@/lib/dbFuntions/fbFuns";

const ProductLine = ({ product }: { product: Product }) => {
  const [showVariants, setShowVariants] = useState(false);
  const { setCurrentProduct, setLastUploadedProduct, setProducts, products } =
    useProducts();
  const { store, storeId } = useStore();
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
    if (!storeId) return;
    setProducts([...products, newProduct]);
    dbAddDoc(collection(db, "products"), newProduct, storeId, "");
  };

  const archiveProduct = () => {
    if (!storeId) return;
    dbUpdateDoc(
      doc(db, "products", product.id),
      {
        ...product,
        status: "archived",
      },
      storeId,
      "",
    );
    setProducts(
      products.map((p) =>
        p.id === product.id ? { ...product, status: "archived" } : p,
      ),
    );
  };

  const deleteProduct = () => {
    if (!storeId) return;
    updateDoc(doc(db, "products", product.id), {
      ...product,
      status: "deleted",
    });
    setProducts(products.filter((p) => p.id !== product.id));
  };
  // const stock = (product.variants && product.variants.length > 0)
  //   ? product.variants.reduce((acc, variant) => acc + variant.inventoryQuantity, 0)
  //   : product.stockQuantity;
  //
  //
  //
  const { data: stockQuantity, error } = useQuery({
    queryKey: ["inventoryStock", product?.id],
    queryFn: () => getStock(store?.id ?? "", product),
  });
  console.log(stockQuantity);
  if (error) console.error(error);

  // a function to get total sales of a product
  const { data: totalSales } = useQuery({
    queryKey: ["totalSales", product.id],
    queryFn: async function totalSalesFun() {
      const coll = collection(db, "inventoryItems"); // Replace "inventory" with your collection name

      // Create a query to filter items by product name
      const q = query(
        coll,
        where("productId", "==", product.id),
        where("storeId", "==", storeId),
        where("type", "==", "OUT"),
        where("status", "==", "APPROVED"),
      );

      return getAggregateFromServer(q, {
        totalSales: sum("quantity"),
      }).then((result) => {
        return result.data().totalSales;
      });
    },
  });

  return (
    <>
      <TableRow key={product.id} className="group">
        <TableCell className="hidden sm:table-cell">
          {Array.isArray(product.images) &&
          (product.images[0] || product.variants?.find((v) => v.image)) ? (
            <Image
              src={product.images[0] ?? product.variants?.[0].images?.[0] ?? ""}
              alt={product.title || "Product Image"}
              width={100}
              height={100}
              className="w-14 aspect-square object-cover border rounded-md p-[2px] duration-300"
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
          <Badge variant={
            product.status === "active"
              ? "default"
              : product.status === "archived"
              ? "outline"
              : "secondary"
          }>{product.status}</Badge>
        </TableCell>
        <TableCell className="hidden md:table-cell">
          {product.variants &&
          product.variants.length > 0 &&
          product.variantsAreOneProduct === false
            ? Math.min(...product.variants.map((v) => v.price)) +
              " - " +
              Math.max(...product.variants.map((v) => v.price))
            : product.price}{" "}
          {store?.settings.currency.symbol}
        </TableCell>
        <TableCell className="hidden md:table-cell">
          <div>
            {stockQuantity} Items
          </div>
        </TableCell>
        <TableCell className="hidden md:table-cell">
          <div className="flex items-center">

          {
            (totalSales ?? 0) * -1
            // Math.min(
            // totalSales ??0,0
            // )
          }{" "}
          Sales
          <ShoppingCartIcon className="h-4 w-4 ml-2" />
          </div>
        </TableCell>
        <TableCell className="hidden md:table-cell">
          {product.createdAt.toDate().toLocaleDateString()}
        </TableCell>
        <TableCell className="flex justify-end items-center h-full mt-2">
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
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={duplicateProduct}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={archiveProduct}>
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </DropdownMenuItem>
              <DropdownMenuItem onClick={deleteProduct}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
              {product.variants && product.variants.length > 0 && (
                <DropdownMenuItem
                  onClick={() => {
                    toggleVariants();
                  }}
                >
                  {showVariants ? (
                    <EyeOff className="h-4 w-4 mr-2" />
                  ) : (
                    <Eye className="h-4 w-4 mr-2" />
                  )}
                  {showVariants ? "Hide Variants" : "Show Variants"}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      {showVariants && product.variants && product.variants?.length > 0 && (
        <TableRow>
          <TableCell colSpan={8}>
            <div className="px-2 ml-4 w-full border rounded-xl">
              <h1 className="text-xl font-semibold p-3">Variants</h1>
              <Table className="w-fit min-w-[600px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Variant Title</TableHead>
                    <TableHead
                      className={product.variantsAreOneProduct ? "hidden" : ""}
                    >
                      Price
                    </TableHead>
                    <TableHead
                      className={product.variantsAreOneProduct ? "hidden" : ""}
                    >
                      Stock
                    </TableHead>
                    <TableHead>Total Sales</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {product?.variants &&
                    product?.variants.map((variant, index) => (
                      <VariantLine
                        variant={variant}
                        product={product}
                        key={index}
                      />
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

const VariantLine = ({
  variant,
  product,
}: {
  variant: Variant;
  product: Product;
}) => {
  const { storeId } = useStore();
  const { data: stockQuantity, error } = useQuery({
    queryKey: ["inventoryStock", product?.id, variant?.id],
    queryFn: () => getStock(storeId ?? "", product, variant),
  });

  const { data: totalSales } = useQuery({
    queryKey: ["totalSales", variant.id],
    queryFn: async function totalSalesFun() {
      const coll = collection(db, "inventoryItems"); // Replace "inventory" with your collection name

      // Create a query to filter items by product name
      const q = query(
        coll,
        where("variantId", "==", variant.id),
        where("storeId", "==", storeId),
        where("type", "==", "OUT"),
        where("status", "==", "APPROVED"),
      );

      return getAggregateFromServer(q, {
        totalSales: sum("quantity"),
      }).then((result) => {
        return result.data().totalSales;
      });
    },
  });

  if (error) console.error(error);

  return (
    <TableRow>
      <TableCell>
        {variant.images ? (
          <Image
            src={variant?.images ? variant.images[0] : ""}
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
      <TableCell className={product.variantsAreOneProduct ? "hidden" : ""}>
        {variant.price} Dh
      </TableCell>
      <TableCell className={product.variantsAreOneProduct ? "hidden" : ""}>
        {variant.hasInfiniteStock ? "infinite" : stockQuantity || 0} Items
      </TableCell>
      <TableCell>
        <div className="flex items-center">
        {(totalSales ?? 0) * -1} Sales
        <ShoppingCartIcon className="h-4 w-4 ml-2" />
        </div>
      </TableCell>
    </TableRow>
  );
};

export { ProductLine };
