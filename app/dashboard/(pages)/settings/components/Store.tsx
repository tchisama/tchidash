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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { db } from "@/firebase";
import { currencyOptions, useStore } from "@/store/storeInfos";
import { Store } from "@/types/store";
import { useQuery } from "@tanstack/react-query";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { CheckCircle  } from "lucide-react";
import { useEffect, useState } from "react";

const StoreDetailsCard = () => {
  const { storeId } = useStore();
  const { data: store } = useQuery({
    queryKey: ["store", storeId],
    queryFn: async () => {
      if (!storeId) return null;
      const store: Store = await getDoc(doc(db, "stores", storeId)).then((doc) => {
        return { ...doc.data(), id: doc.id } as Store;
      });
      return store;
    },
    refetchOnWindowFocus: false,
  });

  const [storeName, setStoreName] = useState("");
  const [country, setCountry] = useState("");
  const [currency, setCurrency] = useState({
    name: "",
    symbol: "",
  });
  const [storeDescription, setStoreDescription] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!storeId) return;
    if (!store) return;

    const newStore = {
      ...store,
      name: storeName,
      settings: {
        country,
        currency,
      },
      description: storeDescription,
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
    setStoreName(store.name || "");
    setCountry(store.settings.country || "");
    const currencySelected = currencyOptions.find(c=>c.name==store.settings.currency.name);
    if(!currencySelected) return;
    setCurrency(currencySelected);
    setStoreDescription(store.description || "");
    setSaved(false);
  }, [store]);

  const handleCountryChange = (selectedCountry: string) => {
    setCountry(selectedCountry);

    // Automatically set currency based on the selected country
    if (selectedCountry === "Morocco") {
      setCurrency({
        name: "MAD",
        symbol: "dh",
      });
    } else if (selectedCountry === "USA") {
      setCurrency(
        {
          name: "USD",
          symbol: "$",
        }
      );
    }
  };

  return (
    <Card x-chunk="dashboard-04-chunk-2">
      <CardHeader>
        <CardTitle>Store Details</CardTitle>
        <CardDescription>Manage your store&lsquo;s details below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="storeName" className="pb-2 font-medium">
              Store Name
            </Label>
            <Input
              id="storeName"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full"
              type="text"
              placeholder="Store Name"
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="country" className="pb-2 font-medium">
              Country
            </Label>
            <Select onValueChange={handleCountryChange} value={country}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Morocco">Morocco</SelectItem>
                <SelectItem value="USA">USA</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4">
            <Label htmlFor="currency" className="pb-2 font-medium">
              Currency
            </Label>
            <Select
              onValueChange={(value) => setCurrency(currencyOptions.find((c) => c.name === value)??{ name: "", symbol: "" })}
              value={currency.name}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MAD">MAD</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4">
            <Label htmlFor="storeDescription" className="pb-2 font-medium">
              Store Description
            </Label>
            <Input
              id="storeDescription"
              value={storeDescription}
              onChange={(e) => setStoreDescription(e.target.value)}
              className="w-full"
              type="text"
              placeholder="Store Description"
            />
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

export { StoreDetailsCard };
