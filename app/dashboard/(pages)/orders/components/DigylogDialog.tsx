"use client";

import { useEffect, useState } from "react";
import { MapPin, FileText, DollarSign, Wand2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useOrderStore } from "@/store/orders";

export default function DigylogDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const [city, setCity] = useState("");
  const [note, setNote] = useState("");
  const [price, setPrice] = useState("");

  const { currentOrder } = useOrderStore();
  useEffect(() => {
    if (currentOrder) {
      setCity(currentOrder.customer.shippingAddress.city ?? "");
      setNote("Please deliver this order as soon as possible.");
      setPrice(currentOrder.totalPrice.toString());
    }
  }, [currentOrder]);

  const [open, setOpen] = useState(false);

  return (
    <>
      <div onClick={() => setOpen(true)} className="flex  items-center">
        {children}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Order Details</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <Label htmlFor="city" className="text-right">
                <MapPin className="h-4 w-4 inline-block mr-2" />
                City
              </Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="flex-1"
              />
            </div>
            <div className="flex items-center gap-4">
              <Label htmlFor="price" className="text-right">
                <DollarSign className="h-4 w-4 inline-block mr-2" />
                Price
              </Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="flex-1"
              />
            </div>
            <div className="flex items-start gap-4">
              <Label htmlFor="note" className="text-right">
                <FileText className="h-4 w-4 inline-block mr-2" />
                Note
              </Label>
              <Textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="flex-1 min-h-[200px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={() => {
                // Update the order details
                setOpen(false);
              }}
            >
              Place Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
