"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PhoneBar from "./PhoneBar";
import { signOut, useSession } from "next-auth/react";
import Logout from "@/public/images/svgs/icons/logout.svg";
import Help from "@/public/images/svgs/icons/help.svg";
import Settings from "@/public/images/svgs/icons/settings.svg";
import Store from "@/public/images/svgs/icons/shop.svg";
import BreadcrumbCom from "./Breadcrumb";
import { useNavbar } from "@/store/navbar";
import { useRouter } from "next/navigation";
import useClean from "@/hooks/useClean";
import BottomBar from "./BottomBar";
import { useStore } from "@/store/storeInfos";

export const description =
  "An orders dashboard with a sidebar navigation. The sidebar has icon navigation. The content area has a breadcrumb and search in the header. The main area has a list of recent orders with a filter and export button. The main area also has a detailed view of a single order with order details, shipping information, billing information, customer information, and payment information.";

export default function DashboardUiProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const { cleanAll } = useClean();
  const { actions } = useNavbar();
  const { setStoreId ,store} = useStore();
  return (
    <div className="flex min-h-screen w-full bg-slate-100 dark:bg-slate-900">
      {/*
      <SideBar />
       * */}
      <div className="flex-col relative flex-1 sm:gap-4 sm:py-4 ">
        <header className="sticky  top-0 z-30 flex h-14 items-center gap-4 border-b  px-4 sm:py-3  sm:h-auto sm:border-0 sm:bg-muted sm:px-6">
          <div className="flex-1 ">
            <PhoneBar />
            <BreadcrumbCom />
          </div>
          <div className="flex justify-center items-center flex-1">
            <BottomBar />
          </div>
          <div className="flex    justify-center gap-4">
            {actions && actions.length > 0 && (
              <div className="flex gap-2">
                {actions.map((action) => action)}
              </div>
            )}
            {/* <DashboardCommand /> */}
          </div>
          <div className="flex-1 flex justify-end">
          <DropdownMenu >
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="overflow-hidden font-medium h-11 py-4 pr-1 text-sm flex gap-2 "
              >
                <div className="flex flex-col  items-start ">
                  <span className="mb-[-4px] text-[11px] font-normal opacity-80">
                    {store?.name}
                  </span>
                <span className="font-medium text-xs">
                {
                  session?.user?.name 
                }
                </span>

                </div>
                <Image
                  src={
                    store?.logoUrl ??
                    session?.user?.image ??
                    ""
                  }
                  width={36}
                  height={36}
                  alt="Avatar"
                  className="overflow-hidden  rounded-md border"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[200px]">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => {
                  cleanAll();
                  router.push("/dashboard/switch-store");
                }}
              >
                <Image src={Store} alt="Settings" className="mr-2 h-4 w-4" />
                Switch Store
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Image src={Settings} alt="Settings" className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Image src={Help} alt="Help" className="mr-2 h-4 w-4" />
                Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setStoreId("");
                  signOut();
                }}
              >
                <Image src={Logout} alt="Logout" className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        </header>

        <main className="p-6 py-2 pb-[200px] pt-10 min-h-[80vh]">
          {children}
        </main>
      </div>
    </div>
  );
}
