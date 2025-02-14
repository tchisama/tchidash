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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

import axios from "axios";

export default function IntegrationConfig() {
  const [token, setToken] = useState("");

  const [Dstore, setDStore] = useState("");
  const [network, setNetwork] = useState("");

  const { store, setStore } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    if (!store) return;
    if (!store.integrations) return;
    setStore({
      ...store,
      integrations: store.integrations.map((i) =>
        i.name === "digylog"
          ? {
              name: "digylog",
              enabled: true,
              token,
              network,
              store: Dstore,
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
                name: "digylog",
                enabled: true,
                token,
                network,
                store: Dstore,
              }
            : i,
        ),
      },
      store.id,
      "",
    );
  };

  const [showPassword, setShowPassword] = useState(false);

  const [Dstores, setDStores] = useState<string[]>([]);
  const [networks, setNetworks] = useState<
    {
      name: string;
      id: string;
    }[]
  >([]);

  const checkToken = async () => {
    if (!token) return;
    await axios
      .get("/api/integrations/digylog/stores?token=" + token)
      .then((res) => {
        setDStores(res.data.data.map((s: { name: string }) => s.name));
      });
    await axios
      .get("/api/integrations/digylog/networks?token=" + token)
      .then((res) => {
        setNetworks(res.data.data);
      });
  };

  useEffect(() => {
    if (!store) return;
    if (!store.integrations) return;
    if (!store.integrations.find((i) => i.name === "digylog")) return;
    const {
      store: Dstore,
      token,
      network,
    } = store.integrations.find(
      (i) => i.name === "digylog",
    ) as digylogIntegration;
    setToken(token);
    setNetwork(network);
    setDStore(Dstore);
  }, [store]);

  useEffect(() => {
    checkToken();
  }, [token]);

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
              <AlertTitle>Get Token</AlertTitle>
              <AlertDescription>
                You can get your token from your Digylog account
              </AlertDescription>
            </Alert>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="token">Token</Label>
                <div className="flex">
                  <Input
                    id="token"
                    type={showPassword ? "text" : "password"}
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    required
                    name="token"
                    className=" rounded-r-none border-r-0"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className=" bg-white border rounded-xl rounded-l-none inset-y-0 right-0 flex items-center px-3"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 my-6"></div>

              {Dstores.length > 0 ? (
                <div className="space-y-2">
                  <Label htmlFor="store">Store</Label>
                  <Select
                    value={Dstore}
                    onValueChange={(value) => setDStore(value)}
                    required
                  >
                    <SelectTrigger>{Dstore || "Select Store"}</SelectTrigger>
                    <SelectContent>
                      {Dstores.map((store) => (
                        <SelectItem key={store} value={store}>
                          {store}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : null}
              {networks.length > 0 ? (
                <div className="space-y-2">
                  <Label htmlFor="network">Network</Label>
                  <Select
                    value={network}
                    onValueChange={(value) => setNetwork(value)}
                    required
                  >
                    <SelectTrigger>{network || "Select Network"}</SelectTrigger>
                    <SelectContent>
                      {networks.map((network) => (
                        <SelectItem key={network.id} value={network.id}>
                          {network.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : null}
            </form>
          </CardContent>
        </Card>
      </div>
    )
  );
}
