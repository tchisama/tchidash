"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { dbDeleteDoc, dbGetDocs } from "@/lib/dbFuntions/fbFuns";
import { collection, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { useStore } from "@/store/storeInfos";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

function Page() {
  const { storeId } = useStore();
  const RemoveAllCustomers = async () => {
    if (!confirm("Are you sure you want to remove all customers?")) return;
    const q = query(
      collection(db, "customers"),
      where("storeId", "==", storeId),
    );
    if (!storeId) return;
    const getAllCustomers = await dbGetDocs(q, storeId, "");
    getAllCustomers.docs.forEach((doc) => {
      dbDeleteDoc(doc.ref, storeId, "");
    });
  };

  const RemoveAllOrders = () => {
    if (!confirm("Are you sure you want to remove all orders?")) return;
    const q = query(collection(db, "orders"), where("storeId", "==", storeId));
    if (!storeId) return;
    dbGetDocs(q, storeId, "").then((response) =>
      response.docs.forEach((doc) => {
        dbDeleteDoc(doc.ref, storeId, "");
      }),
    );
    // delete all sales in the store
    const q2 = query(collection(db, "sales"), where("storeId", "==", storeId));
    dbGetDocs(q2, storeId, "").then((response) =>
      response.docs.forEach((doc) => {
        dbDeleteDoc(doc.ref, storeId, "");
      }),
    );
  };
  const RemoveAllProducts = () => {
    if (!confirm("Are you sure you want to remove all products?")) return;
    const q = query(collection(db, "products"), where("storeId", "==", storeId));
    if (!storeId) return;
    dbGetDocs(q, storeId, "").then((response) =>
      response.docs.forEach((doc) => {
        dbDeleteDoc(doc.ref, storeId, "");
      }),
    );
  };
  const RemoveAllReviews = () => {
    if (!confirm("Are you sure you want to remove all reviews?")) return;
    const q = query(collection(db, "reviews"), where("storeId", "==", storeId));
    if (!storeId) return;
    dbGetDocs(q, storeId, "").then((response) =>
      response.docs.forEach((doc) => {
        dbDeleteDoc(doc.ref, storeId, "");
      }),
    );
  };
  const RemoveAllInventory = () => {
    if (!confirm("Are you sure you want to remove all inventory?")) return;
    const q = query(collection(db, "inventoryItems"), where("storeId", "==", storeId));
    if (!storeId) return;
    dbGetDocs(q, storeId, "").then((response) =>
      response.docs.forEach((doc) => {
        dbDeleteDoc(doc.ref, storeId, "");
      }),
    );
  };
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Remove all Data</CardTitle>
          <CardDescription>
            This action will remove all data from the database
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Accordion type="single" collapsible>
            <AccordionItem value="customers">
              <AccordionTrigger>Customers</AccordionTrigger>
              <AccordionContent>
                <Button variant={"destructive"} onClick={RemoveAllCustomers}>
                  Remove All Customers
                </Button>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="orders">
              <AccordionTrigger>Orders</AccordionTrigger>
              <AccordionContent>
                <Button onClick={RemoveAllOrders} variant={"destructive"}>
                  Remove All Orders
                </Button>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="products">
              <AccordionTrigger>Products</AccordionTrigger>
              <AccordionContent>
                <Button variant={"destructive"} onClick={RemoveAllProducts}>
                  Remove All Products
                </Button>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="reviews">
              <AccordionTrigger>Reviews</AccordionTrigger>
              <AccordionContent>
                <Button variant={"destructive"} onClick={RemoveAllReviews}>
                  Remove All Reviews
                </Button>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="inventory">
              <AccordionTrigger>Inventory</AccordionTrigger>
              <AccordionContent>
                <Button variant={"destructive"} onClick={RemoveAllInventory}>
                  Remove All Inventory
                </Button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}

export default Page;
