"use client";

import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";

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
import { useQuery } from "@tanstack/react-query";
import { dbGetDocs } from "@/lib/dbFuntions/fbFuns";
import { collection, orderBy, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { useStore } from "@/store/storeInfos";
import { Order } from "@/types/order";
import { daysLeftTextBadge } from "@/lib/utils/functions/date";

function ScheduledOrdersTable() {
  const { storeId } = useStore();
  const { data: orders } = useQuery({
    queryKey: ["scheduled-orders"],
    queryFn: async () => {
      if (!storeId) return;
      const q = query(
        collection(db, "orders"),
        where("orderStatus", "==", "scheduled"),
        where("storeId", "==", storeId),
        orderBy("createdAt", "desc"),
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
    <div>
      <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-6 w-6" />
              Scheduled Orders
            </CardTitle>
            <CardDescription>
              {orders?.length} orders are scheduled
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
                <TableHead>Days left</TableHead>
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
                    {order?.scheduledDate &&
                      daysLeftTextBadge(order.scheduledDate.toDate())}
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
    </div>
  );
}

export default ScheduledOrdersTable;
