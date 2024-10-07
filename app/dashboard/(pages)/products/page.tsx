"use client";

import React, { useEffect } from "react";

import { useRouter } from "next/navigation";

import Image from "next/image";
import { File, ListFilter, MoreHorizontal, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Photo from "@/public/images/svgs/icons/photo.svg";
import Link from "next/link";
import {
  addDoc,
  and,
  collection,
  doc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { useProducts } from "@/store/products";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/firebase";
import { Product } from "@/types/product";
import { useStore } from "@/store/storeInfos";
// Sample product data

export default function Page() {
  const { setCurrentProduct, products = [], setProducts } = useProducts();
  const { storeId } = useStore();
  const { data, error, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const q = query(
        collection(db, "products"),
        and(where("storeId", "==", "test"), where("status", "!=", "deleted")),
      );
      const response = await getDocs(q);
      const data = response.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return data;
    },
    // staleTime: 20000, // Data stays fresh for 10 seconds
  });
  const router = useRouter();
  useEffect(() => {
    setCurrentProduct(null);
    if (Array.isArray(data)) {
      setProducts(data as Product[]);
      console.log(data);
    }
  }, [data, setProducts, setCurrentProduct]);

  if (isLoading)
    return (
      <div className="w-full h-[50vh] flex justify-center items-center">
        Loading...
      </div>
    );
  if (error) return <div>Error: {error.message}</div>;

  const addProduct = () => {
    const productName = "new product " + Math.random().toString().slice(3, 9);
    const newProduct = {
      title: productName,
      status: "draft",
      createdAt: Timestamp.now(),
      images: [],
      price: 100,
      description: "description of the product",
      tags: [],
      vendor: "",
      category: "",
      variants: [],
      options: [],
      updatedAt: Timestamp.now(),
      storeId,
      stockQuantity: 0,
    }
    addDoc(collection(db, "products"), newProduct).then((docRef) => {
      setCurrentProduct({...newProduct, id: docRef.id} as Product);
      setProducts([...products, {...newProduct, id: docRef.id} as Product]);
      router.push(`/dashboard/products/${productName.replaceAll(" ", "_")}`);
    });
  };

  return (
    data && (
      <Tabs defaultValue="all" className="">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="archived" className="hidden sm:flex">
              Archived
            </TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Filter
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>
                  Active
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Export
              </span>
            </Button>
            <Button onClick={addProduct} size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Product
              </span>
            </Button>
          </div>
        </div>
        <TabsContent value="all">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Products</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="hidden w-[100px] sm:table-cell">
                      <span className="sr-only">Image</span>
                    </TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Variants</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Price
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Total Sales
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Created at
                    </TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products &&
                    products.map((product) => (
                      <TableRow key={product.id} className="group">
                        <TableCell className="hidden sm:table-cell">
                          {Array.isArray(product.images) &&
                          product.images.length > 0 &&
                          product.images[0] ? (
                            <Image
                              src={product.images[0]} // Directly use the first image
                              alt={product.title || "Product Image"} // Provide a default alt text if title is undefined
                              width={100}
                              height={100}
                              className="w-16 h-16 object-contain border rounded-md p-[5px] group-hover:p-[3px] duration-300"
                            />
                          ) : (
                            <div className="w-[70px] rounded-xl border bg-slate-50 h-[70px] flex justify-center items-center">
                              <Image
                                src={Photo} // Ensure Photo is a valid imported image
                                alt={product.title || "Placeholder Image"} // Provide a default alt text
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
                          >
                            <b>{product.title}</b>
                          </Link>
                        </TableCell>
                        <TableCell>
                          {product.variants?.length || 1} Variants
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{product.status}</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {product.variants && product.variants.length > 0
                            ? // get the mini and max price of the variants
                              Math.min(
                                ...product.variants.map((v) => v.price),
                              ) +
                              " - " +
                              Math.max(...product.variants.map((v) => v.price))
                            : product.price}{" "}
                          Dh
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          0
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
                                  router.push(
                                    `/dashboard/products/${product.title.replaceAll(" ", "_")}`,
                                  );
                                }}
                              >
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  console.log("Archive", product);
                                  updateDoc(doc(db, "products", product.id), {
                                    ...product,
                                    status: "archived",
                                  });
                                  setProducts(
                                    products.map((p) =>
                                      p.id === product.id
                                        ? { ...product, status: "archived" }
                                        : p,
                                    ),
                                  );
                                }}
                              >
                                Archive
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  console.log("Delete", product);
                                  setProducts(
                                    products.filter((p) => p.id !== product.id),
                                  );
                                  updateDoc(doc(db, "products", product.id), {
                                    ...product,
                                    status: "deleted",
                                  });
                                }}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing <strong>1-10</strong> of{" "}
                <strong>{products.length}</strong> products
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    )
  );
}
