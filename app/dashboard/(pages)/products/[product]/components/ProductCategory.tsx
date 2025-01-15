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
  collection,
  query,
  where,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { ProductCategory } from "@/types/categories";
import { useCategories } from "@/store/categories";
import { useProducts } from "@/store/products";
import { dbAddDoc, dbGetDocs } from "@/lib/dbFuntions/fbFuns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

 const ProductCategoryCard = () => {
  const { storeId } = useStore();
  const [addCategory, setAddCategory] = useState(false);
  const [editCategory, setEditCategory] = useState<ProductCategory | null>(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);
  const { categories, setCategories } = useCategories();
  const { currentProduct, setCurrentProduct } = useProducts();

  const [categoryInputName, setCategoryInputName] = useState<string>("");
  const [selectedMotherCategory, setSelectedMotherCategory] = useState<string>("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["categories", storeId],
    queryFn: async () => {
      if (!storeId) return;
      const response = await dbGetDocs(
        query(collection(db, "categories"), where("storeId", "==", storeId)),
        storeId,
        "",
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

  const getCategoryPath = (categoryId: string, categories: ProductCategory[]): string => {
    const category = categories.find((cat) => cat.id === categoryId);
    if (!category) return "";

    if (category.motherCategory) {
      return `${getCategoryPath(category.motherCategory, categories)} / ${category.name}`;
    }

    return category.name;
  };

  const isLeafCategory = (categoryId: string, categories: ProductCategory[]): boolean => {
    return !categories.some((cat) => cat.motherCategory === categoryId);
  };

  const handleSaveCategory = async () => {
    if (!storeId) return;
    const categoryData = {
      name: categoryInputName,
      storeId,
      motherCategory: selectedMotherCategory,
    };

    if (editCategory) {
      // Update existing category
      await updateDoc(doc(db, "categories", editCategory.id), categoryData);
      setCategories(
        categories.map((cat) =>
          cat.id === editCategory.id ? { ...cat, ...categoryData } : cat,
        ),
      );
      setEditCategory(null);
    } else {
      // Add new category
      const newCategoryRef = await dbAddDoc(
        collection(db, "categories"),
        categoryData,
        storeId,
        "",
      );
      setCategories([
        ...categories,
        { id: newCategoryRef.id, ...categoryData },
      ]);
    }

    setAddCategory(false);
    setCategoryInputName("");
    setSelectedMotherCategory("");
  };

  const handleDeleteCategory = async () => {
    if (!deleteCategoryId || !storeId) return;
    await deleteDoc(doc(db, "categories", deleteCategoryId));
    setCategories(categories.filter((cat) => cat.id !== deleteCategoryId));
    setDeleteCategoryId(null);
  };

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
            onClick={() => {
              setAddCategory((p) => !p);
              setEditCategory(null);
            }}
          >
            {addCategory ? "Cancel" : "Add Category"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {(addCategory || editCategory) && (
            <div className="bg-slate-50 space-y-2 p-2 border rounded-md">
              <div className="flex justify-between items-center">
                <Label htmlFor="category">
                  {editCategory ? "Edit Category" : "Add Category"}
                </Label>
                <Button
                  onClick={handleSaveCategory}
                  size="sm"
                  variant={"outline"}
                >
                  {editCategory ? "Update" : "Save"}
                </Button>
              </div>
              <Input
                className="bg-white"
                type="text"
                id="category"
                value={categoryInputName}
                onChange={(e) => setCategoryInputName(e.target.value)}
                placeholder="Enter category name"
              />
              <Select
                value={selectedMotherCategory}
                onValueChange={(value) => setSelectedMotherCategory(value)}
              >
                <SelectTrigger
                  id="motherCategory"
                  aria-label="Select mother category"
                >
                  <SelectValue placeholder="Select mother category (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {categories &&
                    categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {getCategoryPath(category.id, categories)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
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
                  {categories
                    .filter((category) => isLeafCategory(category.id, categories))
                    .map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center justify-between"
                      >
                        <SelectItem value={category.id}>
                          {getCategoryPath(category.id, categories)}
                        </SelectItem>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="w-6 mx-2">
                            <MoreVertical className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() => {
                                setEditCategory(category);
                                setCategoryInputName(category.name);
                                setSelectedMotherCategory(
                                  category.motherCategory,
                                );
                                setAddCategory(true);
                              }}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleteCategoryId(category.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div>No category found</div>
          )}
        </div>
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteCategoryId}
        onOpenChange={(open) => !open && setDeleteCategoryId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              category.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCategory}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default ProductCategoryCard;
