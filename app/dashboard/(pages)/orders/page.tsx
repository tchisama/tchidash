"use client";
import {
  CheckCircle,
  HashIcon,
  PhoneIcon,
  PlusCircle,
  SearchIcon,
  UserIcon,
  XIcon,
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
import { orderStatusValuesWithIcon } from "./components/StateChanger";
// import { Label } from "@/components/ui/label";
import Analytic from "./components/analytic";
import { Input } from "@/components/ui/input";
import { usePermission } from "@/hooks/use-permission";
import Actions from "./components/Actions";

export default function Page() {
  const { currentOrder, selectedOrder } = useOrderStore();
  const [pageSize, setPageSize] = useState(25);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<{
    status: string;
    search: string;
    searchBy: "Name" | "Number" | "Order ID";
  }>({
    status: "all",
    search: "",
    searchBy: "Name",
  });

  // Check if the user has view permission
  const hasViewPermission = usePermission();

  if (!hasViewPermission("orders", "view")) {
    return <div>You dont have permission to view this page</div>;
  }

  const handleStatusFilterChange = (selectedStatuses: string) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      status: selectedStatuses,
    }))
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
              <Select
                onValueChange={(value) => {
                  const selectedStatuses = value
                  handleStatusFilterChange(selectedStatuses);
                }}
                value={filter.status}
                defaultValue="all"
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent className="mt-2 max-w-xs bg-white">
                  {[{
                    name: "all",
                    icon: <CheckCircle className="h-4 w-4" />,
                    color:"white",
                  }, ...orderStatusValuesWithIcon].map((status) => (
                    <SelectItem key={status.name} value={status.name}>
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-[8px] flex items-center justify-center" style={{ backgroundColor: status.color + "88" }}
                        >{status.icon}</span> {status.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                onValueChange={(value) => setPageSize(Number(value))}
                defaultValue={pageSize.toString()}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Page Size" />
                </SelectTrigger>
                <SelectContent className="mt-2 max-w-xs bg-white">{
                  [25, 50 ,100 ].map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size} {
                        size === pageSize && " / page"
                      }
                    </SelectItem>
                  ))
                  }</SelectContent>
              </Select>
              <div className=" hidden md:flex flex-row-reverse">
                <Button
                  variant={"outline"}
                  onClick={() => {
                    setFilter((prev) => ({ ...prev, search: search }));
                  }}
                  className="rounded-l-none border-l-0"
                >
                  <SearchIcon className="h-4 w-4" />
                </Button>
                <Select
                  defaultValue={filter.searchBy}
                  onValueChange={(value: "Name" | "Number" | "Order ID") =>
                    setFilter((prev) => ({ ...prev, searchBy: value }))
                  }
                >
                  <SelectTrigger className="w-fit rounded-none border-l-0 bg-white flex gap-2">
                    <SelectValue placeholder="Search By" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {[
                      { name: "Name", icon: UserIcon, selected: true },
                      { name: "Number", icon: PhoneIcon },
                      { name: "Order ID", icon: HashIcon },
                    ].map((item) => (
                      <SelectItem
                        className="bg-white"
                        key={item.name}
                        value={item.name}
                      >
                        <div className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          {item.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="relative">
                  <Input
                    placeholder="Search"
                    className="min-w-[200px] rounded-r-none bg-white"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {search && (
                    <Button
                      onClick={() => {
                        setSearch("");
                        setFilter((prev) => ({ ...prev, search: "" }));
                      }}
                      size={"icon"}
                      variant={"secondary"}
                      className="absolute border w-6 h-6 right-2 top-1/2 -translate-y-1/2  border-l-0"
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex ml-auto flex-col gap-2 min-w-[100px]">
              <div className="flex gap-2 ">
                {selectedOrder && selectedOrder.length > 0 && <Actions />}
                {hasViewPermission("orders", "create") ? (
                  <Link className="" href="/dashboard/orders/new">
                    <Button className=" gap-1 w-[130px] text-sm">
                      <PlusCircle className="h-4 w-4" />
                      <span className="">New Order</span>
                    </Button>
                  </Link>
                ) : (
                  <Button disabled>New Order</Button>
                )}
              </div>
            </div>
          </div>
          <div className="md:border border-[#3331] rounded-xl ">
          <Card x-chunk="dashboard-05-chunk-3" className="relative border-none bg-transparent shadow-none md:shadow md:bg-white">
            <CardHeader className="">
              <CardTitle className="text-xl font-medium">Orders {}</CardTitle>
            </CardHeader>
            <CardContent className="p-0 border-none md:p-2">
              <OrdersTable
                filter={filter}
                pageSize={pageSize}
                setPageSize={setPageSize}
              />
            </CardContent>
          </Card>
          </div>
        </div>
      </div>

      <OrderView />
    </main>
  );
}