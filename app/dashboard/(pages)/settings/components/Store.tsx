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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import UploadImageProvider from "@/components/UploadImageProvider";
import { db } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { currencyOptions, useStore } from "@/store/storeInfos";
import { Store } from "@/types/store";
import { useQuery } from "@tanstack/react-query";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { CheckCircle } from "lucide-react";
import Image from "next/image";

import { useEffect, useState } from "react";

const StoreDetailsCard = () => {
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
  const { toast } = useToast();

  const [storeName, setStoreName] = useState("");
  const [country, setCountry] = useState("");
  const [currency, setCurrency] = useState({
    name: "",
    symbol: "",
  });
  const [storeDescription, setStoreDescription] = useState("");
  const [image, setImage] = useState("");
  const [saved, setSaved] = useState(false);
  const [dainamicVariantImages, setDainamicVariantImages] = useState(false);

  const handleSave = () => {
    if (!storeId) return;
    if (!store) return;

    const newStore = {
      ...store,
      name: storeName,
      logoUrl: image,
      settings: {
        country,
        currency,
        dynamicVariantsImages: dainamicVariantImages,
      },
      description: storeDescription,
    };

    updateDoc(doc(db, "stores", storeId), newStore).then(() => {
      setSaved(true);
    });
    toast({
      title: "Store details saved",
      description: "Your store details have been saved successfully",
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
    setStoreDescription(store.description || "");
    setImage(store.logoUrl || "");
    const currencySelected = currencyOptions.find(
      (c) => c.name == store.settings.currency.name,
    );
    if (!currencySelected) return;
    setCurrency(currencySelected);

    if (store.settings?.dynamicVariantsImages) {
      setDainamicVariantImages(store.settings.dynamicVariantsImages ?? false);
    }

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
      setCurrency({
        name: "USD",
        symbol: "$",
      });
    }
  };

  return (
    storeId && (
      <Card x-chunk="dashboard-04-chunk-2">
        <CardHeader>
          <CardTitle>Store Details</CardTitle>
          <CardDescription>
            Manage your store&lsquo;s details below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex gap-4 mb-8">
              <div className="">
                <Label htmlFor="storeLogo" className="pb-2 font-medium">
                  Store Logo
                </Label>
                <UploadImageProvider
                  name={store?.name + storeId || ""}
                  callback={(url) => {
                    setImage(url);
                  }}
                  folder="stores/logos"
                >
                  <Image
                    src={image ?? ""}
                    alt=""
                    width={100}
                    height={100}
                    className=" w-[150px] aspect-square object-contain border rounded-xl bg-slate-100"
                  />
                </UploadImageProvider>
              </div>
              <div className="flex-1">
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
                  <Label
                    htmlFor="storeDescription"
                    className="pb-2 font-medium"
                  >
                    Store Description
                  </Label>
                  <Textarea
                    id="storeDescription"
                    value={storeDescription}
                    onChange={(e) => setStoreDescription(e.target.value)}
                    className="w-full"
                    placeholder="Store Description"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="mb-4 flex-1">
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

              <div className="mb-4 flex-1">
                <Label htmlFor="currency" className="pb-2 font-medium">
                  Currency
                </Label>
                <Select
                  onValueChange={(value) =>
                    setCurrency(
                      currencyOptions.find((c) => c.name === value) ?? {
                        name: "",
                        symbol: "",
                      },
                    )
                  }
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
            </div>
            <Separator className="my-4" />
            <div>
              <Label
                htmlFor="dainamicVariantImages"
                className="pb-3 font-medium flex items-center gap-2"
              >
                <Checkbox
                  checked={dainamicVariantImages}
                  id="dainamicVariantImages"
                  onCheckedChange={(v: boolean) => setDainamicVariantImages(v)}
                />
                Dynamic Variant Images
              </Label>
              <p className="text-sm text-slate-500">
                Enable this feature to genirate different images for each
                product variant dynamically
              </p>
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
    )
  );
};

export { StoreDetailsCard };
