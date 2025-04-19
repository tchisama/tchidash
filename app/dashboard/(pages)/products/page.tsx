"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {  PlusCircle, FolderTree } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {  collection, Timestamp } from "firebase/firestore";
import { useProducts } from "@/store/products";
import { db } from "@/firebase";
import { Product } from "@/types/product";
import { useStore } from "@/store/storeInfos";
import { ProductLine } from "./components/ProductLine";
import { usePermission } from "@/hooks/use-permission";
import FilteringComponent from "@/components/global/filter";
import { cleanupObject } from "@/lib/utils/convertDatesToTimestamps";
import { dbAddDoc } from "@/lib/dbFuntions/fbFuns";
import { toast } from "@/hooks/use-toast";
import { useCategories } from "@/store/categories";
import { useQuery } from "@tanstack/react-query";
import { query, where } from "firebase/firestore";
import { dbGetDocs } from "@/lib/dbFuntions/fbFuns";
import { ProductCategory } from "@/types/categories";

export default function Page() {
  const { setCurrentProduct, products = [], setProducts, setLastUploadedProduct } = useProducts();
  const { storeId } = useStore();
  const router = useRouter();
  const { setCategories } = useCategories();

  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // Fetch categories when the page loads
  const { data: categoriesData } = useQuery({
    queryKey: ["categories", storeId],
    queryFn: async () => {
      if (!storeId) return [];
      const response = await dbGetDocs(
        query(collection(db, "categories"), where("storeId", "==", storeId)),
        storeId,
        "",
      );
      return response.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ProductCategory[];
    },
    enabled: !!storeId,
  });

  // Update categories in the store when data is fetched
  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData);
    }
  }, [categoriesData, setCategories]);

  // Check if the user has view permission
  const hasViewPermission = usePermission();

  if (!hasViewPermission("products", "view")) {
    return <div>You dont have permission to view this page</div>;
  }


  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Products</h1>
            <p className="text-muted-foreground">
              Manage your products and their variants
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/categories")}
              className="flex items-center gap-2"
            >
              <FolderTree className="h-4 w-4" />
              Manage Categories
            </Button>
            <Button
              onClick={async () => {
                if (!storeId) return;
                const productsCollection = collection(db, "products");
                
                // Create a new product without an ID first
                const newProduct: Omit<Product, 'id'> = {
                  title: "New Product",
                  price: 0,
                  status: "draft" as const,
                  storeId: storeId,
                  createdAt: Timestamp.now(),
                  updatedAt: Timestamp.now(),
                  options: [],
                  variants: [],
                  images: [],
                  description: "",
                  category: "",
                  hasBundle: false,
                  hasDiscount: false,
                  stockQuantity: 0,
                  variantsAreOneProduct: false,
                  canBeSaled: true,
                  discount: {
                    amount: 0,
                    type: "fixed",
                    startDate: Timestamp.now(),
                  },
                };
                
                try {
                  // Add the document to Firestore and get the reference
                  const docRef = await dbAddDoc(
                    productsCollection,
                    newProduct,
                    storeId,
                    "",
                  );
                  
                  // Create a complete product with the ID from Firestore
                  const completeProduct: Product = {
                    ...newProduct,
                    id: docRef.id,
                  };
                  
                  // Update the local state
                  setProducts([...products, completeProduct]);
                  setCurrentProduct(completeProduct);
                  setLastUploadedProduct(completeProduct);
                  
                  // Navigate to the new product
                  router.push(`/dashboard/products/${completeProduct.title.replaceAll(" ", "_")}`);
                } catch (error) {
                  console.error("Error creating product:", error);
                  toast({
                    title: "Error",
                    description: "Failed to create product. Please try again.",
                    variant: "destructive",
                  });
                }
              }}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Add Product
            </Button>
          </div>
        </div>

        <div className="flex mb-2 items-center">
          <FilteringComponent
            collectionName="products"
            defaultFilters={[
              { field: "status", operator: "!=", value: "deleted" },
            ]}
            docStructure={{
              status: "string",
              createdAt: "date",
            }}
            searchField="title"
            callback={(data) => {
              if (!data) return;
              console.log(data);
              const cleanData = cleanupObject(data);
              setProducts(cleanData as Product[]);
            }}
          />
        </div>

        <Card>
          <CardContent className="p-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Select</TableHead>
                  <TableHead className="hidden w-[100px] sm:table-cell">
                    <span className="sr-only">Image</span>
                  </TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Price
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Stock
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Total Sales
                  </TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products &&
                  products.map((product) => (
                    <ProductLine
                      selected={{ selectedProducts, setSelectedProducts }}
                      key={product.id}
                      product={product}
                    />
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
      </div>
    </div>
  );
}
