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
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/firebase";
import { useStore } from "@/store/storeInfos";
import { Store } from "@/types/store";
import { useQuery } from "@tanstack/react-query";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { CheckCircle, Copy, X } from "lucide-react";
import { useEffect, useState } from "react";

import { v4 } from "uuid";

const SecuritySettings = () => {
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
  const [saved, setSaved] = useState(false);
  const [apiKeys, setApiKeys] = useState<Store["apiKeys"]>([]);

  useEffect(() => {
    if (!store) return;
    if (!store?.apiKeys) return;
    setApiKeys(store.apiKeys);
  }, [store]);

  const handleSave = () => {
    if (!storeId) return;
    if (!store) return;
    if (!store.settings) return;
    const newStore = {
      ...store,
      apiKeys,
    };
    updateDoc(doc(db, "stores", storeId), newStore);
    setSaved(true);
  };
  useEffect(() => {
    if (!store) return;
    if (!store.settings) return;
    setSaved(false);
  }, [setSaved, store]);

  return (
    <Card x-chunk="dashboard-04-chunk-1">
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>
          Manage your store&apos;s security settings here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4">
          <Label htmlFor="password">Store Id</Label>
          <div>
            {store?.id}{" "}
            <Button
              className="ml-2"
              variant={"outline"}
              size="icon"
              onClick={() => {
                navigator.clipboard.writeText(store?.id ?? "");
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex gap-2 justify-between">
          <Label htmlFor="password">Api Keys</Label>

          <Button
            onClick={() => {
              const key = v4();
              if (!apiKeys) {
                setApiKeys([{ name: "", key }]);
              } else {
                setApiKeys([...apiKeys, { name: "", key }]);
              }
            }}
          >
            Add
          </Button>
        </div>

        <Table className="mt-2">
          <TableHeader>
            <TableRow>
              <TableHead>Key</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apiKeys &&
              apiKeys.map((apiKey) => (
                <TableRow key={apiKey.key}>
                  <TableCell>{apiKey.key}</TableCell>
                  <TableCell className="flex justify-end">
                    <Button
                      onClick={() => {
                        setApiKeys(apiKeys.filter((k) => k !== apiKey));
                      }}
                      variant={"outline"}
                      size="icon"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
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

export { SecuritySettings };
