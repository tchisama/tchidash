"use client";

import { useEffect } from "react";
import { useStore } from "@/store/storeInfos";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutTemplate } from "lucide-react";
import { Suspense } from "react";
import { Loader } from "lucide-react";
import { usePermission } from "@/hooks/use-permission";

export default function LandingPage() {
  const { store } = useStore();
  const router = useRouter();
  const hasViewPermission = usePermission();

  const isLandingPageBuilderEnabled = store?.integrations?.find(i => i.name === "landing-page-builder")?.enabled ?? false;
  const canViewLandingPage = hasViewPermission("landing_page", "view");

  useEffect(() => {
    if (!isLandingPageBuilderEnabled || !canViewLandingPage) {
      router.push("/dashboard");
    }
  }, [isLandingPageBuilderEnabled, canViewLandingPage, router]);

  if (!isLandingPageBuilderEnabled) {
    return (
      <div className="container max-w-4xl py-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <LayoutTemplate className="w-6 h-6" />
              Landing Page Builder Not Enabled
            </CardTitle>
            <CardDescription>
              The Landing Page Builder integration is not enabled for your store.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              To use the Landing Page Builder, you need to enable it in your settings.
            </p>
            <Button onClick={() => router.push("/dashboard/settings/integrations")}>
              Go to Integrations
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!canViewLandingPage) {
    return (
      <div className="container max-w-4xl py-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <LayoutTemplate className="w-6 h-6" />
              Access Denied
            </CardTitle>
            <CardDescription>
              You don{"'"}t have permission to access the Landing Page Builder.
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
        <div className="container max-w-4xl py-10">
          <h1 className="text-3xl font-bold mb-8">Landing Page Builder</h1>
          {/* Add your Landing Page Builder content here */}
        </div>
      </Suspense>
    </main>
  );
} 