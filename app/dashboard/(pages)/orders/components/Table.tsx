"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getPage } from "@/lib/pagenation";
import { cn } from "@/lib/utils";
import { useOrderStore } from "@/store/orders";
// import { cn } from "@/lib/utils"
import { useStore } from "@/store/storeInfos";
import { Order } from "@/types/order";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React, { useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  and,
  collection,
  getDocs,
  or,
  query,
  QueryFilterConstraint,
  where,
} from "firebase/firestore";
import { db } from "@/firebase";
import { StateChanger } from "./StateChanger";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import NoteViewer from "./NoteViewer";
import { Edit2 } from "lucide-react";
import { Popover , PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import { OrdersMobileView } from "./OrdersMobileView";

export function OrdersTable({
  filter,
  pageSize,
  setPageSize,
}: {
  pageSize: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  filter: { status: string[]; search: string, searchBy: "Name" | "Number" | "Order ID" };
}) {
  const { storeId } = useStore();
  const {
    orders,
    setOrders,
    currentOrder,
    setCurrentOrder,
    selectedOrder,
    setSelectedOrder,
  } = useOrderStore();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(0);
  const [totalCount, setTotalCount] = React.useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ["orders", storeId, currentPage, pageSize, filter],
    queryFn: async () => {
      const wheres: QueryFilterConstraint[] = [];
      wheres.push(where("storeId", "==", storeId));
      wheres.push(where("orderStatus", "in", filter.status));



    if (filter.search) {
      if (filter.searchBy === "Name") {
        wheres.push(or(
          where("customer.firstName", "==", filter.search),
          where("customer.lastName", "==", filter.search),
          where("customer.name", "==", filter.search)
        ));
      } else if (filter.searchBy === "Number") {
        wheres.push(where("customer.phoneNumber", "==", filter.search));
      } else if (filter.searchBy === "Order ID") {
        wheres.push(where("sequence", "==", parseInt(filter.search)));
      }
    }



      if (!storeId) return null;
      const queryBuilder = query(collection(db, "orders"), and(...wheres));
      
      let response
      if(filter.search){
        response = await getDocs(queryBuilder).then((snapshot) => ({
          documents: snapshot.docs.map((doc) => {
            return doc.data() as Order;
          }),
          currentPage: 1,
          totalPages: 1,
          pageSize: pageSize,
          totalCount: snapshot.docs.length,
        }));
      }else{
       response = await getPage(queryBuilder, currentPage, pageSize,storeId)
      }
      return response;
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data) {
      setOrders(data.documents as Order[]);
      setCurrentPage(data.currentPage);
      setPageSize(data.pageSize);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
    }
  }, [
    data,
    setOrders,
    setCurrentPage,
    setPageSize,
    setTotalPages,
    setTotalCount,
  ]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const renderPageNumbers = () => {
    const pages: JSX.Element[] = [];

    for (let i = 1; i <= Math.min(totalPages, 10); i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            onClick={() => handlePageClick(i)}
            className={
              currentPage === i ? "bg-slate-200 hover:bg-slate-300" : ""
            }
          >
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return pages;
  };

  if (isLoading)
    return (
  <>
      <div className="md:block hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="">Select</TableHead>
              <TableHead className="">Product</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="">Status</TableHead>
              <TableHead className="">Address</TableHead>
              <TableHead className="">Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {new Array(2).fill(0).map((_, j) => (
              <TableRow key={j}>
                {new Array(6).fill(0).map((_, i) => (
                  <TableCell key={i}>
                    <Skeleton className="h-8 bg-slate-100 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
    );

  if (error)
    return (
      <p className="text-xs text-red-600">no orders found for this store</p>
    );

  return (
    <div>
      <div className="md:hidden block">
      <OrdersMobileView 
        orders={orders}
      />
      </div>
      <div className="md:block hidden">
      <Table className="">
        <TableHeader>
          <TableRow>
            <TableHead className="">
              <div className="flex   justify-start items-center">
                <Checkbox
                  checked={orders.every((order) =>
                    selectedOrder.includes(order.id),
                  )}
                  onCheckedChange={() => {
                    if (
                      orders.every((order) => selectedOrder.includes(order.id))
                    ) {
                      setSelectedOrder([]);
                    } else {
                      setSelectedOrder(orders.map((order) => order.id));
                    }
                  }}
                />
              </div>
            </TableHead>
            <TableHead className="">Sequence</TableHead>
            <TableHead className="">Product</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead className="">Status</TableHead>
            <TableHead className="">Address</TableHead>
            <TableHead className="">Note</TableHead>
            <TableHead className="">Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders?.map((order) => (
            <TableRow
              onDoubleClick={() => window.open(`/dashboard/orders/${order?.sequence}`)}
              key={order.id}
              onClick={() => setCurrentOrder(order.id)}
              className={cn(
                "cursor-pointer",
                currentOrder && currentOrder.id === order.id && "bg-muted",
              )}
            >
              <TableCell
                className="group"
                onClick={(e) => {
                  e.stopPropagation();
                  if (selectedOrder.includes(order.id)) {
                    setSelectedOrder(
                      selectedOrder.filter((id) => id !== order.id),
                    );
                  } else {
                    setSelectedOrder([...selectedOrder, order.id]);
                  }
                }}
              >
                <div className="flex   justify-start items-center">
                  <Checkbox
                    className="group-hover:outline outline-primary/30"
                    checked={selectedOrder.includes(order.id)}
                  />
                </div>
              </TableCell>
              <TableCell>
                #{order?.sequence ?? "-"} 
              </TableCell>
              <TableCell className="w-[130px]">
                <div className="relative h-10 w-20">
                  {order.items.slice(0, 2).map((item, i) => {
                    return (
                      <div
                        key={item.id}
                        className={cn(
                          "mask absolute top-0 w-10 aspect-auto",
                          i === 0 && "left-0 ",
                          i === 1 && "left-8 ",
                          i === 2 && "left-16 ",
                        )}
                      >
                        <Image
                          width={50}
                          height={50}
                          src={item.imageUrl ?? ""}
                          alt="Avatar Tailwind CSS Component"
                          className="w-10 rounded-[15px] bg-slate-100 border border-[#3334] aspect-square  object-cover"
                        />
                      </div>
                    );
                  })}
                  {order.items.length > 2 && (
                    <div className="mask absolute top-0 w-10 aspect-square left-16">
                      <div className="w-10 h-10 border-[#3334] border bg-slate-100 relative rounded-[15px] flex items-center justify-center">
                        <Image
                          width={50}
                          height={50}
                          src={order.items[2].imageUrl ?? ""}
                          alt="Avatar Tailwind CSS Component"
                          className={cn("w-10  filter opacity-20 rounded-[15px] bg-slate-100  aspect-square   object-cover",
                            order.items.length - 3 === 0 && "opacity-100",
                          )}
                        />
                        {
                        order.items.length - 3 > 0 &&
                        <span className="text-xs font-bold z-10 text-muted-foreground absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          +{order.items.length - 2}
                        </span>
                        }
                      </div>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium">
                  {order.customer.firstName} {order.customer.lastName}
                </div>

                <div className=" text-sm text-muted-foreground ">
                  {order.customer.phoneNumber}
                </div>
              </TableCell>
              <TableCell className="">
                <div
                  className="w-fit"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <StateChanger state={order.orderStatus} order={order} />
                </div>
              </TableCell>
              <TableCell className="">
                <div className="text-sm">
                  {order.customer.shippingAddress.city}
                </div>
                <div className="text-xs text-muted-foreground">
                  {order.customer.shippingAddress.address.slice(0, 40)}
                  {order.customer.shippingAddress.address.length > 40 && "..."}
                </div>
              </TableCell>
              <TableCell className="">
                <Popover>
                  <PopoverTrigger
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  >
                    {
                      order.note?.content
                        ? <div
                           className="w-fit text-xs"
                        >
                          {order.note?.content.slice(0, 40)}
                          {order.note?.content.length > 40 && "..."}
                        </div>
                        :<Button
                        size={"icon"}
                        variant={"ghost"}
                        className="hover:border-slate-200 border border-slate-50/0 text-slate-400"
                        ><Edit2 className="h-4 w-4" /></Button>
                    }
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px]">
                    <NoteViewer order={order} />
                  </PopoverContent>
                </Popover>
              </TableCell>
              <TableCell className="">
                <div className="text-sm">
                  {order.createdAt.toDate().toLocaleDateString("en-US", {
                    // i want to get the same order as year/month/day

                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                  })}
                </div>
                <div className="text-xs text-muted-foreground">
                  {order.createdAt.toDate().toLocaleTimeString(
                    // without seconds
                    "en-US",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right font-bold">
                {order.totalPrice} Dh
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableCaption className="">
          <Pagination className=" flex items-end justify-between">
            <div>
              Showing {currentPage}-{totalPages} of {totalCount}
            </div>

            <PaginationContent className="bg-slate-50 mt-2 w-fit border rounded-xl">
              <PaginationItem>
                <PaginationPrevious href="#" onClick={handlePreviousPage} />
              </PaginationItem>

              {renderPageNumbers()}

              {totalPages > 5 && <PaginationEllipsis />}

              <PaginationItem>
                <PaginationNext href="#" onClick={handleNextPage} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </TableCaption>
      </Table>
      </div>
    </div>
  );
}
