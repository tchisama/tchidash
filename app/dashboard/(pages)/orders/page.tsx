"use client";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OrdersTable } from "./components/Table";
import Link from "next/link";
import OrderView from "./components/OrderView";
import Analytic from "./components/analytic";
import { cn } from "@/lib/utils";
import { useOrderStore } from "@/store/orders";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function Page() {
  const { currentOrder } = useOrderStore();
  const [pageSize, setPageSize] = useState(25);
  return (
    <main
      className={cn(
        "grid flex-1 items-start px-0 sm:py-0 gap-8 lg:grid-cols-2 ",
        currentOrder && "lg:grid-cols-3",
      )}
    >
      <div className="grid auto-rows-max items-start gap-4  lg:col-span-2">
        <Analytic />
        <div className="ml-auto flex items-center gap-2">

      <div className="flex flex-col gap-2 min-w-[100px]">
        <Select
          onValueChange={(value) => setPageSize(Number(value))}
          defaultValue={pageSize.toString()}
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent className="mt-2 max-w-xs bg-white">
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
      </div>
          <Link href="/dashboard/orders/new">
            <Button  variant="outline" className=" gap-1 text-sm">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only">New Order</span>
            </Button>
          </Link>
        </div>
        <Card x-chunk="dashboard-05-chunk-3">
          <CardHeader className="px-7">
            <CardTitle>Orders</CardTitle>
            <CardDescription>Recent orders from your store.</CardDescription>
          </CardHeader>
          <CardContent>
            <OrdersTable pageSize={pageSize} setPageSize={setPageSize} />
          </CardContent>
        </Card>
      </div>

      <OrderView />
    </main>
  );
}
