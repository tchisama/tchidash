"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useProducts } from "@/store/products";
import { Option, Product, Variant, VariantValue } from "@/types/product";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProductVariantsCard = () => {
  const { currentProduct, setCurrentProduct } = useProducts();
  const [productVariants, setProductVariants] = useState<Variant[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<string[]>([]);

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
    }));
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
      setProductVariants(currentProduct.variants || []);
    }
  }, [currentProduct]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-1 justify-between">
            Product Variants
            <Button
              variant="ghost"
              size="sm"
              onClick={generateAction}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-3 w-3" />
              Generate Variants
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Select</TableHead>
              <TableHead>Variant</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>SKU</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Map variants data */}
            {productVariants.map((variant) => (
              <TableRow key={variant.id}>
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
                <TableCell>{variant.title}</TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>
                  <Input
                    defaultValue={variant.inventoryQuantity}
                    value={variant.inventoryQuantity}
                    onChange={(e) => {
                      const newQuantity = parseInt(e.target.value);
                      setProductVariants((prev) =>
                        prev.map((v) =>
                          v.id === variant.id
                            ? { ...v, inventoryQuantity: newQuantity }
                            : v,
                        ),
                      );
                    }}
                    type="text"
                    onBlur={(e) => {
                      const newQuantity = parseInt(e.target.value);
                      const vrnts = productVariants.map((v) =>
                        selectedVariants.includes(v.id)
                          ? { ...v, inventoryQuantity: newQuantity }
                          : v,
                      );
                      setProductVariants(vrnts);
                      setCurrentProduct({
                        ...currentProduct,
                        variants: vrnts as Variant[],
                      } as Product);
                    }}
                  />
                </TableCell>
                <TableCell>{variant.sku}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ProductVariantsCard;
