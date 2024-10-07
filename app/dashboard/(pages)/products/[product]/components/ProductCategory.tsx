"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/storeInfos";
import {
  addDoc,
  and,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { ProductCategory } from "@/types/categories";
import { useCategories } from "@/store/categories";
import { useProducts } from "@/store/products";

const ProductCategoryCard = () => {
  const { storeId } = useStore();
  const [addCategory, setAddCategory] = useState(false);
  const { categories, setCategories } = useCategories();
  const { currentProduct, setCurrentProduct } = useProducts();

  const { data, isLoading, error } = useQuery({
    queryKey: ["categories", storeId],
    queryFn: async () => {
      const response = await getDocs(
        query(
          collection(db, "categories"),
          and(
            where("storeId", "==", storeId),
            where("motherCategory", "==", ""),
          ),
        ),
      );
      return response.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as ProductCategory,
      );
    },
  });

  useEffect(() => {
    if (data) {
      setCategories(data);
    }
  }, [data, setCategories]);

  const [categoryInputName, setCategoryInputName] = useState<string>("");
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Product Category</CardTitle>
          <Button
            variant="outline"
            size={"sm"}
            onClick={() => setAddCategory((p) => !p)}
          >
            {addCategory ? "Cancel" : "Add Category"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {addCategory && (
            <div className="bg-slate-50 space-y-2 p-2 border rounded-md">
              <div className="flex justify-between items-center">
                <Label htmlFor="category">Category</Label>
                <Button
                  onClick={() => {
                    addDoc(collection(db, "categories"), {
                      name: categoryInputName,
                      storeId,
                      motherCategory: "",
                    }).then((r) => {
                      if (!categories) return;
                      if (!storeId) return;
                      console.log({
                        name: categoryInputName,
                        id: r.id,
                        storeId,
                        motherCategory: "",
                      });
                      setCategories([
                        ...categories,
                        {
                          name: categoryInputName,
                          id: r.id,
                          storeId,
                          motherCategory: "",
                        },
                      ]);
                      setAddCategory(false);
                      setCategoryInputName("");
                    });
                    // Save category
                  }}
                  size="sm"
                  variant={"outline"}
                >
                  Save
                </Button>
              </div>
              <Input
                className="bg-white"
                type="text"
                id="category"
                value={categoryInputName}
                onChange={(e) => setCategoryInputName(e.target.value)}
              />
            </div>
          )}
          {categories && categories.length > 0 ? (
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={currentProduct?.category}
                onValueChange={(value) => {
                  if (!currentProduct) return;
                  setCurrentProduct({
                    ...currentProduct,
                    category: value,
                  });
                }}
              >
                <SelectTrigger id="category" aria-label="Select category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories &&
                    categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div>No category found</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCategoryCard;
