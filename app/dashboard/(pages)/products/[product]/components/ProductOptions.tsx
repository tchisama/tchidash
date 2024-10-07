"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreVertical } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useProducts } from "@/store/products";
import { Input } from "@/components/ui/input";
import { Product, Variant } from "@/types/product";
import { useState } from "react";

const ProductOptionsCard = () => {
  const { currentProduct, setCurrentProduct } = useProducts();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Options</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="options">Options List</Label>
            <Button
              variant="outline"
              size={"sm"}
              onClick={() =>
                setCurrentProduct({
                  ...currentProduct,
                  options: [
                    ...(currentProduct?.options ?? []),
                    { name: "", values: [] },
                  ],
                } as Product)
              }
            >
              Add Option
            </Button>
          </div>
          {currentProduct?.options && currentProduct?.options?.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Options</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentProduct &&
                  (currentProduct?.options ?? []).map((option, index) => (
                    <OptionRow option={option} index={index} key={index} />
                  ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const OptionRow = ({
  option,
  index,
}: {
  option: { id: string; name: string; values: string[] };
  index: number;
}) => {
  const [editing, setEditing] = useState(false);
  const { currentProduct, setCurrentProduct } = useProducts();
  return (
    currentProduct && (
      <TableRow>
        <TableCell className="space-x-2">
          {editing ? (
            <Input
              value={option.name}
              className="w-full max-w-[150px]"
              onChange={(e) => {
                const newOptions = [
                  ...(currentProduct.options as {
                    name: string;
                    values: string[];
                  }[]),
                ];
                newOptions[index].name = e.target.value;
                setCurrentProduct({
                  ...currentProduct,
                  options: newOptions,
                } as Product);
              }}
            />
          ) : (
            <span>{option.name}</span>
          )}
        </TableCell>
        <TableCell className="min-w-[70%]">
          {editing ? (
            <Input
              value={option.values.join(",")}
              className="w-full"
              onBlur={(e) => {
                const newOptions = [
                  ...(currentProduct.options as {
                    name: string;
                    values: string[];
                  }[]),
                ];
                // Apply trim only on blur (when the user stops typing or leaves the input field)
                newOptions[index].values = e.target.value
                  .split(",")
                  .map((val) => val.trim());
                setCurrentProduct({
                  ...currentProduct,
                  options: newOptions,
                } as Product);
                setEditing(false);
              }}
              onChange={(e) => {
                const newOptions = [
                  ...(currentProduct.options as {
                    name: string;
                    values: string[];
                  }[]),
                ];
                // Allow spaces while typing, only trim when leaving the input (onBlur)
                newOptions[index].values = e.target.value.split(",");
                setCurrentProduct({
                  ...currentProduct,
                  options: newOptions,
                } as Product);
              }}
            />
          ) : (
            option.values.map((value, index) => (
              <Badge key={index} variant="outline">
                {value}
              </Badge>
            ))
          )}
        </TableCell>
        <TableCell className="flex gap-2 justify-end">
          {editing ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setEditing(false);
              }}
            >
              Save
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setEditing(true);
              }}
            >
              Edit
            </Button>
          )}
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
                  const newOptions = [
                    ...(currentProduct.options as {
                      name: string;
                      values: string[];
                    }[]),
                  ];
                  newOptions.splice(index, 1);
                  setCurrentProduct({
                    ...currentProduct,
                    options: newOptions,
                    variants: [] as Variant[],
                  } as Product);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    )
  );
};

export default ProductOptionsCard;
