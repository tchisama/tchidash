"use client"

import { LandingPagesList } from "./../../components/landing-pages-list"
import { useStore } from "@/store/storeInfos"
import { usePermission } from "@/hooks/use-permission"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LayoutTemplate } from "lucide-react"

export default function PagesPage() {
  const { storeId, store } = useStore()
  const router = useRouter()
  const hasViewPermission = usePermission()

  const isLandingPageBuilderEnabled = store?.integrations?.find(i => i.name === "landing-page-builder")?.enabled ?? false
  const canViewLandingPage = hasViewPermission("landing_page", "view")

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
    )
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
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Your Landing Pages</h1>
        <LandingPagesList storeId={storeId??""} />
      </div>
    </main>
  )
}
