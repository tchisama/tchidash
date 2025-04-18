"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useStore } from "@/store/storeInfos";
import { dbUpdateDoc } from "@/lib/dbFuntions/fbFuns";
import { doc } from "firebase/firestore";
import { db } from "@/firebase";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

export default function POSIntegrationConfig() {
  const { store, setStore } = useStore();
  const [autoSync, setAutoSync] = useState(false);
  const [syncInterval, setSyncInterval] = useState("5");

  useEffect(() => {
    if (!store?.integrations) return;
    const posConfig = store.integrations.find(i => i.name === "pos");
    if (posConfig) {
      setAutoSync(posConfig.config?.autoSync ?? false);
      setSyncInterval(posConfig.config?.syncInterval ?? "5");
    }
  }, [store]);

  const handleSubmit = async () => {
    if (!store) return;

    const newUpdate = {
      ...store,
      integrations: (store.integrations ?? []).map((i) =>
        i.name === "pos"
          ? {
              ...i,
              config: {
                autoSync,
                syncInterval,
              },
            }
          : i
      ),
    };

    setStore(newUpdate);
    await dbUpdateDoc(
      doc(db, "stores", store.id),
      {
        integrations: newUpdate.integrations,
      },
      store.id,
      "",
    );

    toast({
      title: "Settings saved",
      description: "Your POS integration settings have been updated.",
    });
  };

  return (
    store && (
      <div className="container max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-start">POS Integration</h1>
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">Configure Integration</CardTitle>
              <Button onClick={handleSubmit}>Save</Button>
            </div>
            <CardDescription>
              Manage your POS integration settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              <AlertTitle>POS Integration</AlertTitle>
              <AlertDescription>
                Configure how your POS system integrates with your online store
              </AlertDescription>
            </Alert>

            <form className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="autoSync"
                  checked={autoSync}
                  onCheckedChange={setAutoSync}
                />
                <Label htmlFor="autoSync">
                  <div>
                    <h4>Auto Sync</h4>
                    <p className="text-sm text-gray-500">
                      Automatically sync inventory and sales data
                    </p>
                  </div>
                </Label>
              </div>

              {autoSync && (
                <div className="space-y-2">
                  <Label htmlFor="syncInterval">Sync Interval (minutes)</Label>
                  <Input
                    id="syncInterval"
                    type="number"
                    value={syncInterval}
                    onChange={(e) => setSyncInterval(e.target.value)}
                    min="1"
                    max="60"
                  />
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    )
  );
} 