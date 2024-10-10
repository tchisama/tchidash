"use client";
import { Badge } from "@/components/ui/badge";
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
} from "@/components/ui/pagination"
import { collection, query, where } from "firebase/firestore";
import { db } from "@/firebase";



export function OrdersTable({pageSize, setPageSize}:{pageSize:number, setPageSize:React.Dispatch<React.SetStateAction<number>>}) {
  const { storeId } = useStore();
  const { orders, setOrders, currentOrder, setCurrentOrder } = useOrderStore();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ["orders", storeId, currentPage, pageSize],
    queryFn: async () => {
      const response = await getPage(query(collection(db, "orders"), where("storeId", "==", storeId)), currentPage??1, pageSize??10);
      return response;
    },
    refetchOnWindowFocus:false,
  });

  useEffect(() => {
    if (data){
      setOrders(data.documents as Order[]);
      setCurrentPage(data.currentPage);
      setPageSize(data.pageSize);
      setTotalPages(data.totalPages)
    } 
  }, [data, setOrders, setCurrentPage, setPageSize, setTotalPages]);



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

  const handlePageClick = (pageNumber:number) => {
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
        </PaginationItem>
      );
    }

    return pages;
  };


  if (isLoading) return <p>Loading...</p>;

  if (error) return <p className="text-xs text-red-600">Error {error.message}</p>;

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
              {
                order.items.slice(0, 3).map((item,i) => {
                  return (
                        <div key={item.id} className={cn("mask absolute top-0 w-10 aspect-auto",i===0 &&"left-0",i===1&& "left-6",i===2&& "left-12" )}>
                          <Image
                            width={50}
                            height={50}
                            src={item.imageUrl??""}
                            alt="Avatar Tailwind CSS Component"
                            className="w-10 rounded-xl border-[3px] aspect-square  shadow-lg object-cover"
                          />
                        </div>
                  );
                })
              }
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
              <Badge>{order.orderStatus}</Badge>
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
            <TableCell className="text-right">{order.totalPrice} Dh</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableCaption className="">



      <Pagination className=" flex justify-end">
      <PaginationContent className="bg-slate-50 mt-2 w-fit border rounded-xl">
        <PaginationItem>
          <PaginationPrevious href="#" onClick={handlePreviousPage}  />
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
