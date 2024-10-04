"use client"
import Image from "next/image"
import Link from "next/link"
import {
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import PhoneBar from "./PhoneBar"
import SideBar from "./SideBar"
import { signOut, useSession } from "next-auth/react"
import Logout from "@/public/images/svgs/icons/logout.svg"
import Help from "@/public/images/svgs/icons/help.svg"
import Settings from "@/public/images/svgs/icons/settings.svg"
import BreadcrumbCom from "./Breadcrumb"

export const description =
  "An orders dashboard with a sidebar navigation. The sidebar has icon navigation. The content area has a breadcrumb and search in the header. The main area has a list of recent orders with a filter and export button. The main area also has a detailed view of a single order with order details, shipping information, billing information, customer information, and payment information."


export default function DashboardUiProvider({ children }: { children: React.ReactNode }) {
  const {data: session} = useSession()
  return (
    <div className="flex min-h-screen w-full  bg-muted/40">
      <SideBar />
      <div className="flex-col flex-1 sm:gap-4 sm:py-4 ">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <div className="flex-1 ">
            <PhoneBar />
            <BreadcrumbCom/>
          </div>
          <div className="flex  flex-1  justify-center gap-4">
            <div className="relative min-w-[40%]  md:grow-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full rounded-lg bg-background min-w-[200px] pl-8 md:w-[200px] lg:w-[336px]"
              />
            </div>
          </div>
          <div className="flex-1 flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
                  <Image
                    src={session?.user?.image ?? ""}
                    width={36}
                    height={36}
                    alt="Avatar"
                    className="overflow-hidden rounded-full"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Image src={Settings} alt="Settings" className="mr-2 h-5 w-5" />
                  Settings</DropdownMenuItem>
                <DropdownMenuItem>
                  <Image src={Help} alt="Help" className="mr-2 h-5 w-5" />
                  Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={()=>signOut()}>
                  <Image src={Logout} alt="Logout" className="mr-2 h-5 w-5" />
                  Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="p-6 py-2 pt-10 min-h-[80vh]">
          {children}
        </main>
      </div>
    </div>
  );
}
