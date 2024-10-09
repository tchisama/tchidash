"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db } from "@/firebase";
import { useStore } from "@/store/storeInfos";
import { Store } from "@/types/store";
import { useQuery } from "@tanstack/react-query";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
const ShippingCard = () => {
  const { storeId } = useStore();
  const { data: store } = useQuery({
    queryKey: ["store", storeId],
    queryFn: async () => {
      if (!storeId) return null;
      const store: Store = await getDoc(doc(db, "stores", storeId)).then((doc) => {
        return { ...doc.data(), id: doc.id } as Store;
      });
      return store
    },
    refetchOnWindowFocus: false,
  });
  const [shippingCost, setShippingCost] = useState(40);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!storeId) return;
    if (!store) return;
    if (!store.settings) return;
    const newStore = { ...store, settings: { ...store.settings, shippingCost } };
    updateDoc(doc(db, "stores", storeId), newStore).then(()=>{
      setSaved(true);
    })
  };
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleSave();
  };
  useEffect(()=>{
    if (!store) return;
    if (!store.settings) return;
    setSaved(false);
  },[shippingCost,setSaved,store])

  return (
    <Card x-chunk="dashboard-04-chunk-1">
      <CardHeader>
        <CardTitle>Shipping Information</CardTitle>
        <CardDescription>all about your shipping information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Label htmlFor="shippingCost" className="pb-3 font-medium">Shipping Cost</Label>
          <Input
            id="shippingCost"
            value={shippingCost}
            onChange={(e) => setShippingCost(Number(e.target.value))}
            className="w-full max-w-[150px]"
            type="number"
            placeholder="Shipping Cost"
          />
        </form>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button onClick={handleSave}>
            {
              !saved ? "Save"  : "Saved"
            }
            {
              saved && <CheckCircle className="ml-2 h-4 w-4" />
            }
        </Button>
      </CardFooter>
    </Card>
  );
};

export { ShippingCard };
