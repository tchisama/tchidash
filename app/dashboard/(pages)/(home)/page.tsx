"use client";

import Link from "next/link";
import { ArrowUpRight, Stars } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { dbGetDocs } from "@/lib/dbFuntions/fbFuns";
import { collection, limit, orderBy, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { useStore } from "@/store/storeInfos";
import { Order } from "@/types/order";
import ScheduledOrdersTable from "./components/ScheduledOrdersTable";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import StarsComponent from "../../components/StarsComponent";

export default function Page() {
  const { store } = useStore();
  const { data: session } = useSession();
  const { storeId } = useStore();
  const { data: orders } = useQuery({
    queryKey: ["pending-orders"],
    queryFn: async () => {
      if (!storeId) return;
      const q = query(
        collection(db, "orders"),
        where("orderStatus", "==", "pending"),
        where("storeId", "==", storeId),
        orderBy("createdAt", "desc"),
        limit(5),
      );
      const response = await dbGetDocs(q, storeId, "");
      const data = response.docs.map(
        (doc) =>
          ({
            ...doc.data(),
            id: doc.id,
          }) as Order,
      );
      return data;
    },
  });

  return (
    <main className="flex flex-1 flex-col gap-4  md:gap-8 ">
      <h1 className="text-4xl text-slate-800 capitalize font-bold tracking-tight">
        {/* // with emoji of hi */}
        <span className="flex gap-2 items-center">
          <Avatar className="rounded-3xl size-20">
            <AvatarImage
              src={
                store?.employees?.find(
                  (emp) => emp.email === session?.user?.email,
                )?.imageUrl ?? ""
              }
            />
          </Avatar>
          <div>
            <span className="text-5xl">Hello</span>
            <br />
            {
              store?.employees?.find(
                (emp) => emp.email === session?.user?.email,
              )?.name
            }{" "}
            👋
          </div>
        </span>
      </h1>
      <div>
        <StarsComponent />
      </div>
      {/* <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Subscriptions
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-muted-foreground">
              +19% from last month
            </p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">
              +201 since last hour
            </p>
          </CardContent>
        </Card>
      </div> */}
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle className="flex gap-2 items-center">
                <Stars className="h-6 w-6" />
                Pending Orders
              </CardTitle>
              <CardDescription>
                {orders?.length} pending orders waiting for your approval
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/dashboard/orders">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead className="">Address</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders?.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="font-medium">{order.customer.name}</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                        {order.customer.phoneNumber}
                      </div>
                    </TableCell>
                    <TableCell className="font-sm">
                      <div>{order.customer.shippingAddress.city}</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                        {order.customer.shippingAddress.address.slice(0, 50)}
                        {order.customer.shippingAddress.address.length > 50 &&
                          "..."}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {order.totalPrice} Dh
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <ScheduledOrdersTable />
      </div>
    </main>
  );
}
