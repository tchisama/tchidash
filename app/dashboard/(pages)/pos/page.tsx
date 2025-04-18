"use client";

import { useEffect } from "react";
import { useStore } from "@/store/storeInfos";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store } from "lucide-react";
import { Suspense } from "react";
import PosSystem from "./components/pos-system";
import { Loader } from "lucide-react";
import { usePermission } from "@/hooks/use-permission";

export default function POSPage() {
  const { store } = useStore();
  const router = useRouter();
  const hasViewPermission = usePermission();

  const isPOSEnabled = store?.integrations?.find(i => i.name === "pos")?.enabled ?? false;
  const canViewPOS = hasViewPermission("pos", "view");

  useEffect(() => {
    if (!isPOSEnabled || !canViewPOS) {
      router.push("/dashboard");
    }
  }, [isPOSEnabled, canViewPOS, router]);

  if (!isPOSEnabled) {
    return (
      <div className="container max-w-4xl py-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Store className="w-6 h-6" />
              POS Integration Not Enabled
            </CardTitle>
            <CardDescription>
              The POS integration is not enabled for your store.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              To use the POS system, you need to enable the POS integration in your settings.
            </p>
            <Button onClick={() => router.push("/dashboard/settings/integrations")}>
              Go to Integrations
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!canViewPOS) {
    return (
      <div className="container max-w-4xl py-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Store className="w-6 h-6" />
              Access Denied
            </CardTitle>
            <CardDescription>
              You don{"'"}t have permission to access the POS system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Please contact your administrator to get access to this feature.
            </p>
            <Button onClick={() => router.push("/dashboard")}>
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <Loader className="h-8 w-8 animate-spin text-primary" />
          </div>
        }
      >
        <PosSystem />
      </Suspense>
    </main>
  );
}
