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
import { MoreVertical, Image as ImageIcon, Grid, Coffee, Pizza, Shirt, Book, Music, Heart, Star, Gift, Home, Car, Plane, Train, Bus, Bike, Phone, Laptop, Camera, Headphones, Watch, Utensils, Beer, Wine, Cookie, IceCream, Apple, Carrot, Fish, Beef, Egg, Milk, Cake, Candy, GlassWater, Trash2 } from "lucide-react";
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
import FilesystemExplorer from "@/components/FilesystemExplorer";
import Image from "next/image";

 const ProductCategoryCard = () => {
  const { storeId } = useStore();
  const [addCategory, setAddCategory] = useState(false);
  const [editCategory, setEditCategory] = useState<ProductCategory | null>(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);
  const { categories, setCategories } = useCategories();
  const { currentProduct, setCurrentProduct } = useProducts();

  const [categoryInputName, setCategoryInputName] = useState<string>("");
  const [selectedMotherCategory, setSelectedMotherCategory] = useState<string>("");
  const [categoryImage, setCategoryImage] = useState<string>("");
  const [categoryImagePath, setCategoryImagePath] = useState<string>("");
  const [selectedIcon, setSelectedIcon] = useState<string>("Grid");

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
    // Create a Set to track visited category IDs to prevent infinite recursion
    const visited = new Set<string>();
    
    const getPath = (id: string): string => {
      // If we've already visited this category, return empty to break the cycle
      if (visited.has(id)) return "";
      
      const category = categories.find((cat) => cat.id === id);
      if (!category) return "";
      
      // Mark this category as visited
      visited.add(id);
      
      if (category.motherCategory) {
        const motherPath = getPath(category.motherCategory);
        return motherPath ? `${motherPath} / ${category.name}` : category.name;
      }
      
      return category.name;
    };
    
    return getPath(categoryId);
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
      image: categoryImage,
      imagePath: categoryImagePath,
      icon: selectedIcon,
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
    setCategoryImage("");
    setCategoryImagePath("");
  };

  const handleDeleteCategory = async () => {
    if (!deleteCategoryId || !storeId) return;
    await deleteDoc(doc(db, "categories", deleteCategoryId));
    setCategories(categories.filter((cat) => cat.id !== deleteCategoryId));
    setDeleteCategoryId(null);
  };

  const handleImageUpload = (
    url: string,
    size: number,
    width: number,
    height: number,
    format: string,
    path: string,
  ) => {
    setCategoryImage(url);
    setCategoryImagePath(path);
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Grid": return Grid;
      case "Coffee": return Coffee;
      case "Pizza": return Pizza;
      case "Shirt": return Shirt;
      case "Book": return Book;
      case "Music": return Music;
      case "Heart": return Heart;
      case "Star": return Star;
      case "Gift": return Gift;
      case "Home": return Home;
      case "Car": return Car;
      case "Plane": return Plane;
      case "Train": return Train;
      case "Bus": return Bus;
      case "Bike": return Bike;
      case "Phone": return Phone;
      case "Laptop": return Laptop;
      case "Camera": return Camera;
      case "Headphones": return Headphones;
      case "Watch": return Watch;
      case "Utensils": return Utensils;
      case "Beer": return Beer;
      case "Wine": return Wine;
      case "Cookie": return Cookie;
      case "IceCream": return IceCream;
      case "Apple": return Apple;
      case "Carrot": return Carrot;
      case "Fish": return Fish;
      case "Beef": return Beef;
      case "Egg": return Egg;
      case "Milk": return Milk;
      case "Cake": return Cake;
      case "Candy": return Candy;
      case "GlassWater": return GlassWater;
      default: return Grid;
    }
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
              setCategoryImage("");
              setCategoryImagePath("");
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
              
              <div className="flex flex-col gap-2">
                <Label>Icon</Label>
                <div className="grid grid-cols-6 gap-2">
                  {[
                    "Grid", "Coffee", "Pizza", "Shirt", "Book", "Music", 
                    "Heart", "Star", "Gift", "Home", "Car", "Plane", 
                    "Train", "Bus", "Bike", "Phone", "Laptop", "Camera", 
                    "Headphones", "Watch", "Utensils", "Beer", "Wine", 
                    "Cookie", "IceCream", "Apple", "Carrot", "Fish", 
                    "Beef", "Egg", "Milk", "Cake", "Candy", "GlassWater"
                  ].map((iconName) => {
                    const IconComponent = getIconComponent(iconName);
                    return (
                      <Button
                        key={iconName}
                        variant={selectedIcon === iconName ? "default" : "outline"}
                        size="icon"
                        className="h-10 w-10"
                        onClick={() => setSelectedIcon(iconName)}
                      >
                        <IconComponent className="h-5 w-5" />
                      </Button>
                    );
                  })}
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <Label>Image</Label>
                <div className="flex items-center gap-2">
                  <FilesystemExplorer
                    callback={(url) => {
                      setCategoryImage(url);
                      setCategoryImagePath(url);
                    }}
                  >
                    <Button variant="outline" className="">
                      {categoryImage ? "Change Image" : "Select Image"}
                    </Button>
                  </FilesystemExplorer>
                  
                  {categoryImage && (
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => {
                        setCategoryImage("");
                        setCategoryImagePath("");
                      }}
                      className="h-10 w-10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {categoryImage && (
                  <div className="relative w-32 h-32">
                    <Image
                      src={categoryImage}
                      alt="Category"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
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
                          <div className="flex items-center gap-2">
                            {category.image ? (
                              <div className="relative w-6 h-6 rounded-full overflow-hidden">
                                <Image 
                                  src={category.image} 
                                  alt={category.name} 
                                  fill 
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                                {(() => {
                                  const IconComponent = getIconComponent(category.icon || "Grid");
                                  return <IconComponent className="h-3 w-3 text-slate-400" />;
                                })()}
                              </div>
                            )}
                            <span>{getCategoryPath(category.id, categories)}</span>
                          </div>
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
                                setSelectedMotherCategory(category.motherCategory);
                                setCategoryImage(category.image || "");
                                setCategoryImagePath(category?.imagePath || "");
                                setSelectedIcon(category.icon || "Grid");
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
