"use client";
import {
  Check,
  CheckCircle,
  Filter,
  PlusCircle,
  TicketsIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrdersTable } from "./components/Table";
import Link from "next/link";
import OrderView from "./components/OrderView";
import { cn } from "@/lib/utils";
import { useOrderStore } from "@/store/orders";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { orderStatusValuesWithIcon } from "./components/StateChanger";
import { Label } from "@/components/ui/label";
import Analytic from "./components/analytic";
import { Input } from "@/components/ui/input";
import { usePermission } from "@/hooks/use-permission";

export default function Page() {
  const { currentOrder, selectedOrder } = useOrderStore();
  const [pageSize, setPageSize] = useState(25);
  const [filter, setFilter] = useState({
    status: [
      "pending",
      "confirmed",
      "packed",
      "shipped",
      "delivered",
      "scheduled",
      "cancelled",
      "returned",
      "fake",
    ],
    search: "",
  });

  // Check if the user has view permission
  const hasViewPermission = usePermission();

  if (!hasViewPermission("orders", "view")) {
    return <div>You dont have permission to view this page</div>;
  }

  const handleStatusFilterChange = (statusName: string) => {
    if (statusName === "all") {
      // If "All" is selected, toggle between selecting all statuses and none
      setFilter((prevFilter) => ({
        ...prevFilter,
        status:
          prevFilter.status.length === orderStatusValuesWithIcon.length
            ? []
            : orderStatusValuesWithIcon.map((status) => status.name),
      }));
    } else {
      // Toggle the selected status
      setFilter((prevFilter) => ({
        ...prevFilter,
        status: prevFilter.status.includes(statusName)
          ? prevFilter.status.filter((s) => s !== statusName)
          : [...prevFilter.status, statusName],
      }));
    }
  };

  return (
    <main
      className={cn(
        "grid flex-1 items-start px-0 sm:py-0 gap-8 lg:grid-cols-2 ",
        currentOrder && "lg:grid-cols-3",
      )}
    >
      <div className="grid duration-200 auto-rows-max items-start gap-4  lg:col-span-2">
        <Analytic />
        <div className="">
          <div className="ml-auto mb-2 flex items-center gap-2">
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button className="" variant={"outline"}>
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[150px] flex p-2 gap-1 flex-col">
                  <div className="p-1 px-2">
                    <Label>Order Status</Label>
                  </div>
                  {/* Add "All" option */}
                  <Button
                    onClick={() => handleStatusFilterChange("all")}
                    size="sm"
                    variant="outline"
                    className="w-full gap-2 justify-start text-left shadow-none border font-normal"
                  >
                    <CheckCircle className="h-4 w-4" />
                    All
                    {filter.status.length ===
                      orderStatusValuesWithIcon.length && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </Button>
                  <div className="border-t border-gray-200 my-2"></div>
                  {[...orderStatusValuesWithIcon].map((status) => (
                    <Button
                      key={status.name}
                      onClick={() => handleStatusFilterChange(status.name)}
                      style={{
                        background: status.color + "50",
                        borderColor: status.color + "30",
                        color: "#000a",
                      }}
                      size="sm"
                      className="w-full gap-2 justify-start text-left shadow-none border font-normal"
                    >
                      {status.icon} {status.name}
                      {filter.status.includes(status.name) && (
                        <Check className="ml-auto h-4 w-4" />
                      )}
                    </Button>
                  ))}
                </PopoverContent>
              </Popover>
              <Select
                onValueChange={(value) => setPageSize(Number(value))}
                defaultValue={pageSize.toString()}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Page Size" />
                </SelectTrigger>
                <SelectContent className="mt-2 max-w-xs bg-white">
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Search"
                value={filter.search}
                className="min-w-[200px] bg-white"
                onChange={(e) => {
                  setFilter({
                    ...filter,
                    search: e.target.value,
                  });
                }}
              />
            </div>

            <div className="flex ml-auto flex-col gap-2 min-w-[100px]">
              <div className="flex gap-2 ">
                {selectedOrder && selectedOrder.length > 0 && (
                  <Link href="/dashboard/none-layout/tickets">
                    <Button className="text-sm flex gap-2">
                      <TicketsIcon className="h-4 w-4" />
                      Tickets
                    </Button>
                  </Link>
                )}
                {hasViewPermission("orders", "create") ? (
                  <Link className="" href="/dashboard/orders/new">
                    <Button className=" gap-1 w-[130px] text-sm">
                      <PlusCircle className="h-4 w-4" />
                      <span className="sr-only sm:not-sr-only">New Order</span>
                    </Button>
                  </Link>
                ) : (
                  <Button disabled>New Order</Button>
                )}
              </div>
            </div>
          </div>
          <Card x-chunk="dashboard-05-chunk-3">
            <CardHeader className="">
              <CardTitle className="text-xl font-medium">Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <OrdersTable
                filter={filter}
                pageSize={pageSize}
                setPageSize={setPageSize}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <OrderView />
    </main>
  );
}
