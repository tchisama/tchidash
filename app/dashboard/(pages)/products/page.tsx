"use client";
import React, { useEffect } from "react";

import Image from "next/image";
import { File, ListFilter, MoreHorizontal, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { useProducts } from "@/store/products";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/firebase";
import { Product } from "@/types/product";
// Sample product data

export default function Page() {
  const { setCurrentProduct, products = [], setProducts } = useProducts();
  const { data, error, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await getDocs(collection(db, "products"));
      const data = response.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return data;
    },
  });

  useEffect(() => {
    setCurrentProduct(null);
    if (Array.isArray(data)) {
      setProducts(data as Product[]);
      console.log(data);
    }
  }, [data, setProducts, setCurrentProduct]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const addProduct = () => {
    setCurrentProduct({
      id: "new product",
      title: "new product",
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
      stockQuantity: 0,
      storeId: "test",
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
            <Link href={"/dashboard/products/new"}>
              <Button onClick={addProduct} size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Product
                </span>
              </Button>
            </Link>
          </div>
        </div>
        <TabsContent value="all">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>
                Manage your products and view their sales performance.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="hidden w-[100px] sm:table-cell">
                      <span className="sr-only">Image</span>
                    </TableHead>
                    <TableHead>Title</TableHead>
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
                      <TableRow key={product.id}>
                        <TableCell className="hidden sm:table-cell">
                          {Array.isArray(product.images) &&
                          product.images.length > 0 &&
                          product.images[0] ? (
                            <Image
                              src={product.images[0]} // Directly use the first image
                              alt={product.title || "Product Image"} // Provide a default alt text if title is undefined
                              width={100}
                              height={100}
                              className="w-16 h-16"
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
                            {product.title}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{product.status}</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {product.price} Dh
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
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem>Archive</DropdownMenuItem>
                              <DropdownMenuItem>Delete</DropdownMenuItem>
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
