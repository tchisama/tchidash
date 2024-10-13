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
import { Checkbox } from "@/components/ui/checkbox";
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
      const store: Store = await getDoc(doc(db, "stores", storeId)).then(
        (doc) => {
          return { ...doc.data(), id: doc.id } as Store;
        },
      );
      return store;
    },
    refetchOnWindowFocus: false,
  });
  const [shippingCost, setShippingCost] = useState(30);
  const [shippingFreeAboveCartAmount, setShippingFreeAboveCartAmount] =
    useState(200);
  const [hasFreeShippingAboveAmount, setHasFreeShippingAboveAmount] =
    useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!store) return;
    if (!store.settings) return;
    setShippingCost(store.settings.shippingCost);
    if (store.settings.shippingFreeAboveCartAmount) {
      setShippingFreeAboveCartAmount(
        store.settings.shippingFreeAboveCartAmount,
      );
    }
    setHasFreeShippingAboveAmount(
      store?.settings?.hasFreeShippingAboveAmount || false,
    );
  }, [store]);

  const handleSave = () => {
    if (!storeId) return;
    if (!store) return;
    if (!store.settings) return;
    const newStore = {
      ...store,
      settings: {
        ...store.settings,
        shippingCost,
        shippingFreeAboveCartAmount,
        hasFreeShippingAboveAmount,
      },
    };
    updateDoc(doc(db, "stores", storeId), newStore).then(() => {
      setSaved(true);
    });
  };
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleSave();
  };
  useEffect(() => {
    if (!store) return;
    if (!store.settings) return;
    setSaved(false);
  }, [shippingCost, setSaved, store]);

  return (
    <Card x-chunk="dashboard-04-chunk-1">
      <CardHeader>
        <CardTitle>Orders and Shipping</CardTitle>
        <CardDescription>all about your shipping information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="flex flex-col gap-3">
            <div>
              <Label
                htmlFor="shippingCost"
                className="pb-3 flex items-center gap-2 font-medium"
              >
                Shipping Cost
              </Label>

              <Input
                id="shippingCost"
                value={shippingCost}
                onChange={(e) => setShippingCost(Number(e.target.value))}
                className="w-full max-w-[150px]"
                type="number"
                placeholder="Shipping Cost"
              />
            </div>
            <div>
              <Label
                htmlFor="hasFreeShippingAboveAmount"
                className="pb-3 font-medium flex items-center gap-2"
              >
                <Checkbox
                  checked={hasFreeShippingAboveAmount}
                  id="hasFreeShippingAboveAmount"
                  onCheckedChange={(v: boolean) =>
                    setHasFreeShippingAboveAmount(v)
                  }
                />
                Has Free above Above Cart Amount (optional)
              </Label>
              {hasFreeShippingAboveAmount && (
                <Input
                  value={shippingFreeAboveCartAmount}
                  onChange={(e) =>
                    setShippingFreeAboveCartAmount(Number(e.target.value))
                  }
                  className="w-full max-w-[150px]"
                  type="number"
                  placeholder="Shipping Cost"
                />
              )}
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button onClick={handleSave}>
          {!saved ? "Save" : "Saved"}
          {saved && <CheckCircle className="ml-2 h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  );
};

export { ShippingCard };
