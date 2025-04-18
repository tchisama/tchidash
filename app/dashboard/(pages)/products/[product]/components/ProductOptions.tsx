"use client";

import { useState } from "react";
import { PlusCircle, Trash2, Edit, Save, X, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useProducts } from "@/store/products";
import type { Product } from "@/types/product";

export enum OptionType {
  TEXT = "text",
  COLOR = "color",
  IMAGE = "image",
  NUMBER = "number",
}

// Type for product option (general options like size, color)
export interface Option {
  name: string; // e.g., "Size"
  values: string[]; // e.g., ["Small", "Medium", "Large"] or ["#fff","#000","#000000"]
  id: string;
  optionType: OptionType;
}

const ProductOptionsCard = () => {
  const { currentProduct, setCurrentProduct } = useProducts();

  const addNewOption = () => {
    setCurrentProduct({
      ...currentProduct,
      options: [
        ...(currentProduct?.options ?? []),
        {
          id: `option-${Date.now()}`,
          name: "",
          values: [],
          optionType: OptionType.TEXT,
        },
      ],
    } as Product);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold">Product Options</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="variantsAreOneProduct"
            checked={currentProduct?.variantsAreOneProduct}
            onCheckedChange={(value) =>
              setCurrentProduct({
                ...currentProduct,
                variantsAreOneProduct: value,
              } as Product)
            }
          />
          <Label htmlFor="variantsAreOneProduct" className="font-medium">
            Assign stock and price to the product only
          </Label>
        </div>

        {currentProduct?.variantsAreOneProduct && (
          <p className="text-sm text-muted-foreground">
            Stock and price will be assigned to the product as a whole, not to
            individual variants.
          </p>
        )}

        <div className="flex items-center justify-between pt-2">
          <h3 className="text-base font-medium">Options</h3>
          <Button
            onClick={addNewOption}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            Add Option
          </Button>
        </div>

        {currentProduct?.options && currentProduct.options.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Name</TableHead>
                  <TableHead className="w-[120px]">Type</TableHead>
                  <TableHead>Values</TableHead>
                  <TableHead className="w-[100px] text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentProduct.options.map((option, index) => (
                  <OptionRow
                    key={option.id || index}
                    option={option}
                    index={index}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex h-24 items-center justify-center rounded-md border border-dashed">
            <p className="text-sm text-muted-foreground">
              No options added. Add an option to create product variants.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const OptionRow = ({ option, index }: { option: Option; index: number }) => {
  const [editing, setEditing] = useState(false);
  const [newValue, setNewValue] = useState("");
  const { currentProduct, setCurrentProduct } = useProducts();

  const handleSave = () => {
    setEditing(false);
    setNewValue("");
  };

  const handleCancel = () => {
    setEditing(false);
    setNewValue("");
  };

  const updateOption = (field: keyof Option, value: unknown) => {
    if (!currentProduct) return;

    const newOptions = [...(currentProduct.options || [])];
    newOptions[index] = {
      ...newOptions[index],
      [field]: value,
    };

    setCurrentProduct({
      ...currentProduct,
      options: newOptions,
    } as Product);
  };

  const addValue = () => {
    if (!newValue.trim() || !currentProduct) return;

    const newOptions = [...(currentProduct.options || [])];
    const currentValues = [...(newOptions[index].values || [])];

    // Don't add duplicates
    if (!currentValues.includes(newValue.trim())) {
      newOptions[index] = {
        ...newOptions[index],
        values: [...currentValues, newValue.trim()],
      };

      setCurrentProduct({
        ...currentProduct,
        options: newOptions,
      } as Product);
    }

    setNewValue("");
  };

  const removeValue = (valueIndex: number) => {
    if (!currentProduct) return;

    const newOptions = [...(currentProduct.options || [])];
    const currentValues = [...(newOptions[index].values || [])];
    currentValues.splice(valueIndex, 1);

    newOptions[index] = {
      ...newOptions[index],
      values: currentValues,
    };

    setCurrentProduct({
      ...currentProduct,
      options: newOptions,
    } as Product);
  };

  const deleteOption = () => {
    if (!currentProduct) return;

    const newOptions = [...(currentProduct.options || [])];
    newOptions.splice(index, 1);

    setCurrentProduct({
      ...currentProduct,
      options: newOptions,
    } as Product);
  };

  const getInputType = () => {
    switch (option.optionType) {
      case OptionType.COLOR:
        return "color";
      case OptionType.NUMBER:
        return "number";
      default:
        return "text";
    }
  };

  const renderOptionValues = () => {
    if (!option.values || option.values.length === 0) {
      return <span className="text-sm text-muted-foreground">No values</span>;
    }

    return (
      <div className="flex flex-wrap gap-1.5">
        {option.values.map((value, i) => {
          if (option.optionType === OptionType.COLOR) {
            return (
              <div key={i} className="flex items-center gap-1">
                <div
                  className="h-4 w-4 rounded-full border"
                  style={{ backgroundColor: value }}
                />
                <Badge variant="outline" className="text-xs">
                  {value}
                </Badge>
              </div>
            );
          } else {
            return (
              <Badge key={i} variant="outline">
                {value}
              </Badge>
            );
          }
        })}
      </div>
    );
  };

  return (
    currentProduct && (
      <TableRow>
        <TableCell>
          {editing ? (
            <Input
              value={option.name}
              placeholder="Option name"
              onChange={(e) => updateOption("name", e.target.value)}
              className="w-full"
            />
          ) : (
            <span className="font-medium">
              {option.name || "Unnamed option"}
            </span>
          )}
        </TableCell>
        <TableCell>
          {editing ? (
            <Select
              value={option.optionType}
              onValueChange={(value) => updateOption("optionType", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={OptionType.TEXT}>Text</SelectItem>
                <SelectItem value={OptionType.COLOR}>Color</SelectItem>
                <SelectItem value={OptionType.IMAGE}>Image</SelectItem>
                <SelectItem value={OptionType.NUMBER}>Number</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Badge variant="secondary" className="capitalize">
              {option.optionType || "text"}
            </Badge>
          )}
        </TableCell>
        <TableCell>
          {editing ? (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  type={getInputType()}
                  value={newValue}
                  placeholder={`Add ${option.optionType} value`}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="w-full"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addValue();
                    }
                  }}
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={addValue}
                  className="shrink-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {option.values && option.values.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {option.values.map((value, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {option.optionType === OptionType.COLOR && (
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: value }}
                        />
                      )}
                      {value}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-3 w-3 rounded-full p-0 text-muted-foreground hover:text-foreground"
                        onClick={() => removeValue(i)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ) : (
            renderOptionValues()
          )}
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end gap-1">
            {editing ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSave}
                  title="Save"
                >
                  <Save className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCancel}
                  title="Cancel"
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditing(true)}
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={deleteOption}
                  title="Delete"
                  className="text-destructive hover:text-destructive/90"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </TableCell>
      </TableRow>
    )
  );
};

export default ProductOptionsCard;
