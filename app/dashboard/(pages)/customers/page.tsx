"use client";
import React from "react";
import Avvvatars from "avvvatars-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { collection, orderBy, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { useQuery } from "@tanstack/react-query";
import { Customer } from "@/types/customer"; // Import your customer type
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Copy, Eye, MoreHorizontal, Phone } from "lucide-react";
import { useStore } from "@/store/storeInfos";
import { dbGetDocs } from "@/lib/dbFuntions/fbFuns";

export default function CustomerPage() {
  const { storeId, store } = useStore();
  // Fetch customers using react-query
  const {
    data: customers,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const q = query(
        collection(db, "customers"),
        where("storeId", "==", storeId),
        orderBy("createdAt", "desc"),
      );
      if (!storeId) return;
      const response = await dbGetDocs(q, storeId, "");
      const data = response.docs.map(
        (doc) =>
          ({
            ...doc.data(),
            id: doc.id,
          }) as Customer,
      );
      return data;
    },
  });

  // Loading and error states
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load customer data {error.message}.</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer List</CardTitle>
        <CardDescription>View all registered customers</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>All Registered Customers</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Avatar</TableHead>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>total purchases</TableHead>
              <TableHead>total revenue</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers &&
              customers.map((customer: Customer) => (
                <TableRow key={customer.id} className="h-16">
                  <TableCell>
                    <Avvvatars
                      size={35}
                      style="shape"
                      value={customer?.phoneNumber ?? ""}
                    />
                  </TableCell>
                  <TableCell>{customer.firstName}</TableCell>
                  <TableCell>{customer.lastName}</TableCell>
                  <TableCell>{customer.email || "N/A"}</TableCell>
                  <TableCell>{customer.phoneNumber}</TableCell>
                  <TableCell>
                    {customer?.address?.street}, {customer?.address?.city}
                  </TableCell>
                  <TableCell>{customer.status}</TableCell>
                  <TableCell>
                    {customer.createdAt.toDate().toLocaleString()}
                  </TableCell>
                  <TableCell>{customer.purchaseCount} </TableCell>
                  <TableCell>
                    {customer.totalAmountSpent}{" "}
                    {store?.settings.currency.symbol}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Link
                            className="flex"
                            href={`/dashboard/customers/${customer.id}`}
                          >
                            <Eye className="mr-2 h-4 w-4" /> View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Phone className="mr-2 h-4 w-4" /> Call
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Phone className="mr-2 h-4 w-4" /> Whatsapp
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            // window.cli
                            navigator.clipboard.writeText(
                              customer?.phoneNumber + "",
                            );
                          }}
                        >
                          <Copy className="mr-2 h-4 w-4" /> Copy Number
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
