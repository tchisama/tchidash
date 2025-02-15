"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { File, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { useProducts } from "@/store/products";
import { db } from "@/firebase";
import { Product } from "@/types/product";
import { useStore } from "@/store/storeInfos";
import { ProductLine } from "./components/ProductLine";
import { usePermission } from "@/hooks/use-permission";
import { exportJson } from "./components/exportJson";
import ImportProducts from "./components/ImportProductsButton";
import FilteringComponent from "@/components/global/filter";
import { cleanupObject } from "@/lib/utils/convertDatesToTimestamps";
// Sample product data

export default function Page() {
  const { setCurrentProduct, products = [], setProducts } = useProducts();
  const { storeId } = useStore();
  // const { data, error, isLoading } = useQuery({
  //   queryKey: ["products", storeId],
  //   queryFn: async () => {
  //     const q = query(
  //       collection(db, "products"),
  //       and(where("storeId", "==", storeId), where("status", "!=", "deleted")),
  //     );
  //     if (!storeId) return;
  //     const response = await dbGetDocs(q, storeId, "");
  //     const data = response.docs.map((doc) => ({
  //       ...doc.data(),
  //       id: doc.id,
  //     }));
  //     return data;
  //   },
  //   refetchOnWindowFocus: false,
  //   // staleTime: 20000, // Data stays fresh for 10 seconds
  // });
  const router = useRouter();
  // useEffect(() => {
  //   setCurrentProduct(null);
  //   if (Array.isArray(data)) {
  //     setProducts(data as Product[]);
  //     console.log(data);
  //   }
  // }, [data, setProducts, setCurrentProduct]);

  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // Check if the user has view permission
  const hasViewPermission = usePermission();

  if (!hasViewPermission("products", "view")) {
    return <div>You dont have permission to view this page</div>;
  }

  // if (isLoading)
  //   return (
  //     <div className="w-full h-[50vh] flex justify-center items-center">
  //       Loading...
  //     </div>
  //   );
  // if (error) return <div>Error: {error.message}</div>;

  const addProduct = () => {
    const productName = "new product " + Math.random().toString().slice(3, 9);
    alert(productName);
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
      hasDiscount: false,
      hasBundle: false,
      canBeSaled: true,
      variantsAreOneProduct: false,
    };
    if (!storeId) return;
    addDoc(collection(db, "products"), newProduct)
      .then((docRef) => {
        setCurrentProduct({ ...newProduct, id: docRef.id } as Product);
        setProducts([...products, { ...newProduct, id: docRef.id } as Product]);
        router.push(`/dashboard/products/${productName.replaceAll(" ", "_")}`);
      })
      .catch((error) => {
        alert("Error adding document: " + error.message);
      });
  };

  return (
    products && (
      <div>
        <div className="flex mb-2 items-center">
          <div>
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
        </div>
        <div>
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader className="flex flex-row items-start">
              <h1>Products</h1>
              <div className="ml-auto flex items-center gap-2">
                <ImportProducts />
                {selectedProducts && selectedProducts.length > 0 && (
                  <Button
                    onClick={() => {
                      // export json file
                      console.log("export json file");
                      exportJson(
                        products.filter((p) => selectedProducts.includes(p.id)),
                        "products",
                      );
                    }}
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1"
                  >
                    <File className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Export
                    </span>
                  </Button>
                )}
                <Button onClick={addProduct} size="sm" className="h-8 gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Product
                  </span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Select</TableHead>
                    <TableHead className="hidden w-[100px] sm:table-cell">
                      <span className="sr-only">Image</span>
                    </TableHead>
                    <TableHead>Title</TableHead>
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
    )
  );
}
