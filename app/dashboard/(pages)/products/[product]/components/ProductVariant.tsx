"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useProducts } from "@/store/products";
import { Option, Product, Variant, VariantValue } from "@/types/product";
import { Check, Copy, Edit, MoreVertical, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import FilesystemExplorer from "@/components/FilesystemExplorer";

const ProductVariantsCard = ({}: { saveProduct: () => void }) => {
  const { currentProduct, setCurrentProduct } = useProducts();
  const [productVariants, setProductVariants] = useState<Variant[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<string[]>([]);
  const router = useRouter();

  // Helper function to generate all combinations of options
  const generateVariants = (options: Option[]): VariantValue[][] => {
    const combine = (optionValues: string[][]): string[][] => {
      if (optionValues.length === 0) return [[]];
      const firstOptionValues = optionValues[0];
      const remainingOptions = combine(optionValues.slice(1));

      return firstOptionValues.flatMap((value) =>
        remainingOptions.map((combination) => [value, ...combination]),
      );
    };

    const optionValues = options.map((option) => option.values);
    return combine(optionValues).map((values) => {
      return options.map((option, idx) => ({
        option: option.name,
        value: values[idx],
      }));
    });
  };

  // Function to create variants based on options
  const createProductVariants = (product: Product): Variant[] => {
    if (!product.options || product.options.length === 0) {
      return [];
    }

    const variantValuesCombinations = generateVariants(product.options);

    // Map variant combinations into actual Variant objects
    return variantValuesCombinations.map((variantValues, index) => ({
      id: `${product.id}-variant-${index}`,
      title: variantValues.map((v) => v.value).join(" / "),
      sku: `SKU-${index}`,
      price: product.price, // Default product price (you can modify per variant)
      weight: 0, // Default weight (can be modified)
      inventoryQuantity: 100, // Default inventory (modifiable)
      variantValues: variantValues,
      taxable: true, // Default taxability (modifiable)
    })) as Variant[];
  };

  const correctVariantImages = () => {
    // // set the first image in variant.images as the main image
    // const variants = productVariants.map((variant) => {
    //   return {
    //     ...variant,
    //     images: [variant.image],
    //   };
    // });
    // setProductVariants(variants);
    // setCurrentProduct({
    //   ...currentProduct,
    //   variants: variants,
    // });
  };

  // Using useMemo to avoid unnecessary updates
  const generateAction = () => {
    if (currentProduct) {
      const variants = createProductVariants(currentProduct);
      setProductVariants(variants);
      setCurrentProduct({
        ...currentProduct,
        variants: variants,
      });
    }
  };
  useEffect(() => {
    if (currentProduct) {
      setProductVariants(currentProduct.variants as Variant[]);
    }
  }, [currentProduct]);

  const [editMode, setEditMode] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-1 justify-between">
            Product Variants
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to generate variants?",
                    )
                  ) {
                    generateAction();
                  }
                }}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-3 w-3" />
                Generate Variants
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  correctVariantImages();
                }}
              >
                Correct Variant images
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (editMode) {
                    // Save the product
                    console.log("Save the product");
                    if (!currentProduct) return;
                    setCurrentProduct({
                      ...currentProduct,
                      variants: productVariants,
                    });
                  }
                  setEditMode((p) => !p);
                }}
              >
                {editMode ? (
                  <>
                    <Check className="w-4 h-4 mr-2" /> Save
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4 mr-2" /> Edit
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardTitle>
        <CardDescription>
          Copy the list Of ids of all the variants of this product
          <Button
            variant="ghost"
            size="icon"
            className="p-1 w-6 h-6"
            onClick={() => {
              navigator.clipboard.writeText(
                currentProduct?.variants
                  ?.map((v) => v.id + " " + v.title)
                  .join(" \n ") ?? "",
              );
            }}
          >
            <Copy className="w-3 h-3" />
          </Button>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Select</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead
                className={
                  currentProduct?.variantsAreOneProduct ? "hidden" : ""
                }
              >
                Price
              </TableHead>
              <TableHead>SKU</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Map variants data */}
            {productVariants.map((variant) => (
              <TableRow
                key={variant.id}
                style={{
                  opacity: variant.inventoryQuantity == 0 ? 0.8 : 1,
                  background: variant.inventoryQuantity == 0 ? "#ff00008" : "",
                }}
              >
                <TableCell>
                  <div className="w-4 h-4 flex justify-between items-center">
                    <Checkbox
                      checked={selectedVariants.includes(variant.id)}
                      onCheckedChange={(value: boolean) => {
                        setSelectedVariants((prev) =>
                          value
                            ? [...prev, variant.id]
                            : prev.filter((id) => id !== variant.id),
                        );
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  {editMode ? (
                    //<UploadImageProvider
                    //  folder="products"
                    //  name={variant.id}
                    //  callback={(url) => {
                    //    setProductVariants((prev) =>
                    //      prev.map((v) =>
                    //        // if the id is the same as the variant id or if its selected
                    //        v.id === variant.id ||
                    //        selectedVariants.includes(v.id)
                    //          ? { ...v, image: url }
                    //          : v,
                    //      ),
                    //    );
                    //  }}
                    //>
                    <FilesystemExplorer
                      callback={(url) => {
                        setProductVariants((prev) =>
                          prev.map((v) =>
                            // if the id is the same as the variant id or if its selected
                            v.id === variant.id ||
                            selectedVariants.includes(v.id)
                              ? { ...v, images: [...(v?.images ?? []), url] }
                              : v,
                          ),
                        );
                      }}
                    >
                      <Image
                        src={variant?.images ? variant?.images[0] : ""}
                        alt={""}
                        width={60}
                        height={60}
                        className="rounded-md w-14 object-cover h-14 p-1 bg-slate-50 border"
                      />
                    </FilesystemExplorer>
                  ) : (
                    //</UploadImageProvider>
                    <Image
                      src={variant?.images ? variant?.images[0] : ""}
                      alt={""}
                      width={60}
                      height={60}
                      className="rounded-md w-14 object-cover p-[1px] h-14 bg-slate-50 border"
                    />
                  )}
                </TableCell>
                <TableCell>{variant.title}</TableCell>
                <TableCell
                  className={
                    currentProduct?.variantsAreOneProduct ? "hidden" : ""
                  }
                >
                  {editMode ? (
                    <Input
                      type="text"
                      defaultValue={variant.price}
                      value={variant.price}
                      onChange={(e) => {
                        const newPrice = parseFloat(e.target.value);
                        setProductVariants((prev) =>
                          prev.map((v) =>
                            v.id === variant.id ? { ...v, price: newPrice } : v,
                          ),
                        );
                      }}
                      onBlur={(e) => {
                        const newPrice = parseFloat(e.target.value);
                        const vrnts = productVariants.map((v) =>
                          selectedVariants.includes(v.id)
                            ? { ...v, price: newPrice }
                            : v,
                        );

                        setProductVariants(vrnts);
                        setCurrentProduct({
                          ...currentProduct,
                          variants: vrnts as Variant[],
                        } as Product);
                      }}
                    />
                  ) : (
                    <div>
                      <b>{variant.price}</b> Dh
                    </div>
                  )}
                </TableCell>
                <TableCell>{variant.sku}</TableCell>
                <TableCell className="flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => {
                          console.log("Edit variant", variant);
                          if (!currentProduct) return;
                          if (!currentProduct.title) return;
                          router.push(
                            `/dashboard/products/${currentProduct.title.replaceAll(" ", "_")}/${variant.sku}`,
                          );
                        }}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          console.log("Delete variant", variant);
                          setProductVariants((prev) =>
                            prev.filter((v) => v.id !== variant.id),
                          );
                          if (!currentProduct) return;
                          setCurrentProduct({
                            ...currentProduct,
                            variants: currentProduct.variants?.filter(
                              (v) => v.id !== variant.id,
                            ) as Variant[],
                          } as Product);
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
    </Card>
  );
};

export default ProductVariantsCard;
