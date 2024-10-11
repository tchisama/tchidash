import Link from "next/link"

import { ShippingCard } from "./components/Shipping"
import { StoreDetailsCard } from "./components/Store"

export default function Page() {
  return (
<main className="flex  min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-2 md:gap-8 ">
        <div className="mx-auto grid w-full  gap-2">
          <h1 className="text-3xl font-semibold">Settings</h1>
        </div>
        <div className="mx-auto grid w-full  items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <nav
            className="grid gap-4 text-sm text-muted-foreground" x-chunk="dashboard-04-chunk-0"
          >
            <Link href="#" className="font-semibold text-primary">
              General
            </Link>
            <Link href="#">Security</Link>
            <Link href="#">Integrations</Link>
            <Link href="#">Support</Link>
            <Link href="#">Organizations</Link>
            <Link href="#">Advanced</Link>
          </nav>
          <div className=" max-w-3xl grid gap-6">
            <StoreDetailsCard />
            <ShippingCard />
          </div>
        </div>
      </main>
  )
}
