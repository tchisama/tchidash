import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

function ProductDiscount() {
  return (
    <Card x-chunk="dashboard-07-chunk-3">
      <CardHeader>
        <CardTitle>Product Discount</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="discount">Discount</Label>
            <div className="grid gap-3 md:grid-cols-1">
              <Select>
                <SelectTrigger id="discount" aria-label="Select type discount">
                  <SelectValue placeholder="discount type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed</SelectItem>
                  <SelectItem value="percentage">Percentage</SelectItem>
                </SelectContent>
              </Select>
              <Input
                id="discount"
                type="number"
                className="w-full"
                defaultValue="10"
              />
            </div>
            <div className="flex flex-col gap-2">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index}>
                  <Label htmlFor="discount">
                    Date {index == 0 ? "Start" : "End"}
                  </Label>
                  <div className="gap-2 mt-2 flex">
                    <Input id="discount" type="date" className="w-full" />
                    <Input id="discount" type="time" className="w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProductDiscount;
