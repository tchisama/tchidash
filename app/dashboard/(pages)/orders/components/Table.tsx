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
  query,
  QueryFilterConstraint,
  where,
} from "firebase/firestore";
import { db } from "@/firebase";
import { StateChanger } from "./StateChanger";
import { Skeleton } from "@/components/ui/skeleton";

export function OrdersTable({
  filter,
  pageSize,
  setPageSize,
}: {
  pageSize: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  filter: { status: string[]; search: string };
}) {
  const { storeId } = useStore();
  const { orders, setOrders, currentOrder, setCurrentOrder } = useOrderStore();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(0);
  const [totalCount, setTotalCount] = React.useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ["orders", storeId, currentPage, pageSize, filter],
    queryFn: async () => {
      const wheres: QueryFilterConstraint[] = [];
      wheres.push(where("storeId", "==", storeId));
      wheres.push(where("orderStatus", "in", filter.status));
      // if (filter.search) {
      // const searchTermLower = filter.search.toLowerCase();
      //   wheres.push(
      //     or(
      //       where("customer.name", ">=", searchTermLower),
      //       where("customer.name", "<=", searchTermLower + "\uf8ff"),
      //       where("customer.phoneNumber", ">=", searchTermLower),
      //       where("customer.phoneNumber", "<=", searchTermLower + "\uf8ff")
      //     )
      //   );
      // }

      const queryBuilder = query(collection(db, "orders"), and(...wheres));
      const response = await getPage(queryBuilder, currentPage, pageSize);
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

    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            onClick={() => handlePageClick(i)}
            className={currentPage === i ? "active" : ""}
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
      <div>
        <Table>
          <TableHeader>
            <TableRow>
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
    );

  if (error)
    return (
      <p className="text-xs text-red-600">no orders found for this store</p>
    );

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="">Product</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead className="">Status</TableHead>
            <TableHead className="">Address</TableHead>
            <TableHead className="">Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders?.map((order) => (
            <TableRow
              key={order.id}
              onClick={() => setCurrentOrder(order.id)}
              className={cn(
                "cursor-pointer",
                currentOrder && currentOrder.id === order.id && "bg-muted",
              )}
            >
              <TableCell className="">
                <div className="relative h-10 w-20">
                  {order.items.slice(0, 3).map((item, i) => {
                    return (
                      <div
                        key={item.id}
                        className={cn(
                          "mask absolute top-0 w-10 aspect-auto",
                          i === 0 && "left-0",
                          i === 1 && "left-6",
                          i === 2 && "left-12",
                        )}
                      >
                        <Image
                          width={50}
                          height={50}
                          src={item.imageUrl ?? ""}
                          alt="Avatar Tailwind CSS Component"
                          className="w-10 rounded-xl bg-slate-100 border-[2px] aspect-square  shadow-lg object-cover"
                        />
                      </div>
                    );
                  })}
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
                  {order.customer.shippingAddress.address}
                </div>
              </TableCell>
              <TableCell className="">
                <div className="text-sm">
                  {order.createdAt.toDate().toDateString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  {order.createdAt.toDate().toLocaleTimeString()}
                </div>
              </TableCell>
              <TableCell className="text-right">
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
  );
}
