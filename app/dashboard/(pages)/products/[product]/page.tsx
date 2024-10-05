import React from "react";

import Image from "next/image";
import {ChevronLeft, MoreHorizontal, Upload } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Photo from "@/public/images/svgs/icons/photo.svg";
import { Checkbox } from "@/components/ui/checkbox";

function page() {
  return (
    <div className="mx-auto grid max-w-[90rem]  flex-1 auto-rows-max gap-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7">
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Pro Controller
        </h1>
        <Badge variant="outline" className="ml-auto sm:ml-0">
          In stock
        </Badge>
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          <Button variant="outline" size="sm">
            Discard
          </Button>
          <Button size="sm">Save Product</Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <Card x-chunk="dashboard-07-chunk-0">
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
              <CardDescription>
                Lipsum dolor sit amet, consectetur adipiscing elit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    className="w-full"
                    defaultValue="Gamer Gear Pro Controller"
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc."
                    className="min-h-32"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card x-chunk="dashboard-07-chunk-2">
            <CardHeader >
              <div className="flex items-center justify-between">
              <CardTitle>Product Category</CardTitle>
              <Button variant="outline" size={"sm"}>
                Add Category
              </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="">
                <div className="grid gap-3">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger id="category" aria-label="Select category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clothing">Clothing</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="accessories">Accessories</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card x-chunk="dashboard-07-chunk-1">
            <CardHeader>
              <CardTitle>Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="">
                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                  <Label htmlFor="category">Options List</Label>
                  <Button variant="outline" size={"sm"}>Add Option</Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Name</TableHead>
                        <TableHead>Options</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Color</TableCell>
                        <TableCell className="space-x-2">
                          <Badge variant="outline">Black</Badge>
                          <Badge variant="outline">White</Badge>
                          <Badge variant="outline">Red</Badge>
                          <Badge variant="outline">Blue</Badge>
                        </TableCell>
                        <TableCell className="flex gap-2 justify-end items-center">
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Size</TableCell>
                        <TableCell className="space-x-2 ">
                          <Badge variant="outline">S</Badge>
                          <Badge variant="outline">M</Badge>
                          <Badge variant="outline">L</Badge>
                          <Badge variant="outline">XL</Badge>
                        </TableCell>
                        <TableCell className="flex gap-2 justify-end items-center">
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>



          <Card x-chunk="dashboard-07-chunk-2">
            <CardHeader>
              <CardTitle>Product Variants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="">
                <div className="grid gap-3">
                  <div className="flex justify-between items-center">
                  <Label htmlFor="category">Variants List</Label>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Select</TableHead>
                        <TableHead>Variant</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead className="w-[100px]">SKU</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {
                        [{
                          name: "Color",
                          options: ["Black", "White", "Red", "Blue"]
                          },{
                          name: "Size",
                          options: ["S", "M", "L", "XL"]
                          }].flat().map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <Checkbox />
                              </TableCell>
                              <TableCell className="font-medium">{item.name}</TableCell>
                              <TableCell className="font-medium">
                                <Input
                                  type="text"
                                  className="w-full"
                                  defaultValue="100"
                                />
                              </TableCell>
                              <TableCell className="font-medium">
                                <Input
                                  type="text"
                                  className="w-full"
                                  defaultValue="100"
                                />
                              </TableCell>
                              <TableCell className="font-medium flex justify-end items-end">
                                <Button
                                  size={"sm"}
                                  variant="outline"
                                >Edit</Button>
                              </TableCell>
                            </TableRow>
                          ))
                      }
                    </TableBody>
                  </Table>

                </div>
              </div>
            </CardContent>
          </Card>



        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">

          <Card x-chunk="dashboard-07-chunk-3">
            <CardHeader>
              <CardTitle>Product Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="status">Status</Label>
                  <Select>
                    <SelectTrigger id="status" aria-label="Select status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Active</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="overflow-hidden" x-chunk="dashboard-07-chunk-4">
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
              <CardDescription>
                Lipsum dolor sit amet, consectetur adipiscing elit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <div className="aspect-square w-full border rounded-md object-cover flex items-center justify-center bg-slate-50">
                  <Image
                    alt="Product image"
                    className="aspect-square w-10 object-cover opacity-50"
                    height="300"
                    src={Photo}
                    width="300"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button>
                    <div className="aspect-square border w-full rounded-md object-cover flex items-center justify-center bg-slate-50">
                      <Image
                        alt="Product image"
                        className="aspect-square w-6 object-cover opacity-50"
                        height="84"
                        src={Photo}
                        width="84"
                      />
                    </div>
                  </button>
                  <button>
                    <div className="aspect-square border w-full rounded-md object-cover flex items-center justify-center bg-slate-50">
                      <Image
                        alt="Product image"
                        className="aspect-square w-6 object-cover opacity-50"
                        height="84"
                        src={Photo}
                        width="84"
                      />
                    </div>
                  </button>
                  <button className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed">
                    <Upload className="h-4 w-4 text-muted-foreground" />
                    <span className="sr-only">Upload</span>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
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
                    {
                      Array.from({ length: 2 }).map((_, index) => (
                        <div key={index}>
                          <Label htmlFor="discount">Date {index == 0 ? 'Start' : 'End'}</Label>
                          <div className="gap-2 mt-2 flex" >
                            <Input
                              id="discount"
                              type="date"
                              className="w-full"
                            />
                            <Input
                              id="discount"
                              type="time"
                              className="w-full"
                            />
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card x-chunk="dashboard-07-chunk-5">
            <CardHeader>
              <CardTitle>Archive Product</CardTitle>
              <CardDescription>
                Lipsum dolor sit amet, consectetur adipiscing elit.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div></div>
              <Button size="sm" variant="secondary">
                Archive Product
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 md:hidden">
        <Button variant="outline" size="sm">
          Discard
        </Button>
        <Button size="sm">Save Product</Button>
      </div>
    </div>
  );
}

export default page;
