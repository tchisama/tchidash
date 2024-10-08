import {
  PlusCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { OrdersTable } from "./components/Table"
import Link from "next/link"
import OrderView from "./components/OrderView"

export default function page() {
  return (
    <main className="grid flex-1 items-start gap-4 px-0   sm:py-0 md:gap-8 lg:grid-cols-4 ">
      <div className="grid auto-rows-max items-start gap-4  lg:col-span-3">
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          <Card x-chunk="dashboard-05-chunk-1">
            <CardHeader className="pb-2">
              <CardDescription>This Week</CardDescription>
              <CardTitle className="text-4xl">$1,329</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                +25% from last week
              </div>
            </CardContent>
            <CardFooter>
              <Progress value={25} aria-label="25% increase" />
            </CardFooter>
          </Card>
          <Card x-chunk="dashboard-05-chunk-2">
            <CardHeader className="pb-2">
              <CardDescription>This Month</CardDescription>
              <CardTitle className="text-4xl">$5,329</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                +10% from last month
              </div>
            </CardContent>
            <CardFooter>
              <Progress value={12} aria-label="12% increase" />
            </CardFooter>
          </Card>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/dashboard/orders/new">
            <Button
              size="sm"
              variant="outline"
              className="h-7 gap-1 text-sm"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only">
                New Order
              </span>
            </Button>
          </Link>
        </div>
        <Card x-chunk="dashboard-05-chunk-3">
          <CardHeader className="px-7">
            <CardTitle>Orders</CardTitle>
            <CardDescription>
              Recent orders from your store.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OrdersTable />
          </CardContent>
        </Card>


      </div>

      <OrderView />
    </main>
  )
}