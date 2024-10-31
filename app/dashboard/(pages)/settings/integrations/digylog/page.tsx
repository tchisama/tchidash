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
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useStore } from "@/store/storeInfos";
import { digylogIntegration } from "@/types/store";
import { dbUpdateDoc } from "@/lib/dbFuntions/fbFuns";
import { doc } from "firebase/firestore";
import { db } from "@/firebase";

export default function IntegrationConfig() {
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [authKey, setAuthKey] = useState("");

  const { store, setStore } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log("Form submitted:", { number, password, authKey });
    if (!store) return;
    if (!store.integrations) return;
    setStore({
      ...store,
      integrations: store.integrations.map((i) =>
        i.name === "digylog"
          ? {
              ...i,
              phoneNumber: number,
              password,
              headers: {
                authorization: authKey,
              },
            }
          : i,
      ),
    });
    dbUpdateDoc(
      doc(db, "stores", store.id),
      {
        integrations: store.integrations.map((i) =>
          i.name === "digylog"
            ? {
                ...i,
                phoneNumber: number,
                password,
                headers: {
                  authorization: authKey,
                },
              }
            : i,
        ),
      },
      store.id,
      "",
    );
  };

  useEffect(() => {
    if (!store) return;
    if (!store.integrations) return;
    if (!store.integrations.find((i) => i.name === "digylog")) return;
    const { phoneNumber, password, headers } = store.integrations.find(
      (i) => i.name === "digylog",
    ) as digylogIntegration;
    setNumber(phoneNumber ?? "");
    setPassword(password ?? "");
    setAuthKey(headers?.authorization ?? "");
  }, [store]);
  const [showPassword, setShowPassword] = useState(false);

  return (
    store && (
      <div className="container max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-start">Digylog </h1>
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">Configure Integration</CardTitle>
              <Button onClick={handleSubmit}>Save</Button>
            </div>
            <CardDescription>
              Securely manage your integration settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6 ">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              <AlertTitle>Secure Storage</AlertTitle>
              <AlertDescription>
                All credentials are encrypted and stored safely. We prioritize
                the security of your sensitive information.
              </AlertDescription>
            </Alert>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="number">Number</Label>
                <Input
                  id="number"
                  type="text"
                  placeholder="Enter your number"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="flex gap-2 ">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    variant="outline"
                    size={"icon"}
                    onClick={() => setShowPassword((p) => !p)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="authKey">Authorized Key</Label>
                <Input
                  id="authKey"
                  type="text"
                  placeholder="Enter your authorized key"
                  value={authKey}
                  onChange={(e) => setAuthKey(e.target.value)}
                  required
                />
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  );
}
