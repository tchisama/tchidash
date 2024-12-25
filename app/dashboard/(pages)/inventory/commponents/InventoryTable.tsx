"use client";
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
import { db } from "@/firebase";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/storeInfos";
import { PurchaseOrder } from "@/types/inventory";
import { useQuery } from "@tanstack/react-query";
import { collection, deleteDoc, doc, getDocs, orderBy, query, where } from "firebase/firestore";
import Image from "next/image";
import { StateChanger } from "./StateChanger";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export function InventoryMovementTable() {
  const { storeId, store } = useStore();
  const { data: purchaseOrders, error } = useQuery({
    queryKey: ["purchaseOrders", storeId],
    queryFn: async () => {
      const q = query(
        collection(db, "purchaseOrders"),
        where("storeId", "==", storeId),
        orderBy("createdAt", "desc"),
      );
      return getDocs(q).then((response) =>
        response.docs.map(
          (doc) => ({ ...doc.data(), id: doc.id }) as PurchaseOrder,
        ),
      );
    },
  });
  if (error) {
    console.error(error);
  }
  return (
    purchaseOrders && (
      <Card className="w-full">
        <CardHeader className="">
          <CardTitle className="mb-2">Inventory Movements</CardTitle>
          <CardDescription className="text-sm text-gray-500">
            View all inventory movements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Products</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchaseOrders.map((movement, index) => (
                <TableRow key={index}>
                  <TableCell className="relative">
                    <div className="py-2 h-10">
                      {movement.itemsMoves.slice(0, 3).map((item, i) => {
                        return (
                          <div
                            key={i}
                            className={cn(
                              "mask absolute top-1/2 w-10 aspect-auto transform -translate-y-1/2",
                              i === 0 && "left-0",
                              i === 1 && "left-6",
                              i === 2 && "left-12",
                            )}
                          >
                            <Image
                              width={50}
                              height={50}
                              src={item.imageUrl ?? ""}
                              alt=""
                              className="w-10 rounded-xl bg-slate-100 border-[2px] aspect-square  shadow-lg object-cover"
                            />
                          </div>
                        );
                      })}
                      {movement.itemsMoves.length > 3 && (
                        <div className="mask absolute top-1/2 -translate-y-1/2 left-[70px] w-10 aspect-square left-18">
                          <div className="w-10 h-10 bg-slate-100 relative rounded-xl border-[2px] flex items-center justify-center">
                            <Image
                              width={50}
                              height={50}
                              src={movement.itemsMoves[3].imageUrl ?? ""}
                              alt="Avatar Tailwind CSS Component"
                              className="w-10 filter opacity-20 rounded-xl bg-slate-100  aspect-square  shadow-lg object-cover"
                            />
                            <span className="text-xs z-10 font-bold text-muted-foreground absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                              +{movement.itemsMoves.length - 3}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{movement.vendorName}</TableCell>
                  <TableCell>
                    {movement.totalCost.toFixed(2)}{" "}
                    {store?.settings.currency.symbol}
                  </TableCell>
                  <TableCell>
                    <StateChanger state={movement.status} order={movement} />
                  </TableCell>
                  <TableCell>
                    {movement.createdAt.toDate().toLocaleString()}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button variant="outline">View</Button>
                    <Button variant="destructive" 
                      onClick={() => {
                        if(confirm("Are you sure you want to delete this item?")) {
                          if(movement.id) {
                            deleteDoc(
                              doc(db, "purchaseOrders", movement.id)
                            );
                          }
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    )
  );
}
