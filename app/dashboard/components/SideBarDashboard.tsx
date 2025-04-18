"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/20/solid";
import { useStore } from "@/store/storeInfos";
import {
  Box,
  ChartColumn,
  Folder,
  Home,
  Mail,
  Settings,
  ShoppingBasket,
  SidebarIcon,
  StarIcon,
  Truck,
  UsersIcon,
  Store as StoreIcon,
  LayoutTemplate,
} from "lucide-react";
import { Notification } from "./Notifications";
import UserProfileButton from "./UserProfileButton";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BreadcrumbCom from "./Breadcrumb";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useLocalStorage from "@/hooks/useLocalStorage";
import {
  collection,
  getCountFromServer,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/firebase";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Store } from "@/types/store";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Orders", href: "/dashboard/orders", icon: ShoppingBasket },
  { name: "Products", href: "/dashboard/products", icon: Box },
  { name: "Inventory", href: "/dashboard/inventory", icon: Truck },
  { name: "Reports", href: "/dashboard/analytics", icon: ChartColumn },
  { name: "Messages", href: "/dashboard/contacts", icon: Mail },
  { name: "Reviews", href: "/dashboard/reviews", icon: StarIcon },
  { name: "Customers", href: "/dashboard/customers", icon: UsersIcon },
  { name: "FileSystem", href: "/dashboard/filesystem", icon: Folder },
  { 
    name: "POS", 
    href: "/dashboard/pos", 
    icon: StoreIcon,
    isVisible: (store: Store | null) => store?.integrations?.find((i: { name: string; enabled: boolean }) => i.name === "pos")?.enabled ?? false
  },
  {
    name: "Landing Pages",
    href: "/dashboard/landing-page/pages",
    icon: LayoutTemplate,
    isVisible: (store: Store | null) => store?.integrations?.find((i: { name: string; enabled: boolean }) => i.name === "landing-page-builder")?.enabled ?? false
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function SideBarDashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { store, storeId } = useStore();
  const pathname = usePathname();
  const [desktopOpen, setDesktopOpen] = useLocalStorage("sidebarOpen", true);

  const { data: totalNewOrders } = useQuery({
    queryKey: ["totalNewOrders", storeId],
    queryFn: async () => {
      const q = query(
        collection(db, "orders"),
        where("orderStatus", "==", "pending"),
        where("storeId", "==", store?.id),
      );
      const totalNumber = await getCountFromServer(q);
      return totalNumber?.data().count;
    },
  });

  useEffect(() => {
    localStorage.setItem("sidebarOpen", String(desktopOpen));
  }, [desktopOpen]);

  useEffect(() => {
    const savedSidebarOpen = localStorage.getItem("sidebarOpen");
    if (savedSidebarOpen !== null) {
      setDesktopOpen(JSON.parse(savedSidebarOpen));
    } else {
      setDesktopOpen(true);
    }
  }, []);

  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
      */}
      <div>
        <Dialog
          open={sidebarOpen}
          onClose={setSidebarOpen}
          className="relative z-50 lg:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
            >
              <TransitionChild>
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="-m-2.5 p-2.5"
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon
                      aria-hidden="true"
                      className="h-6 w-6 text-white"
                    />
                  </button>
                </div>
              </TransitionChild>
              {/* Sidebar component, swap this element with another sidebar if you like */}
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                <div className="flex mt-3 gap-2 h-16 shrink-0 items-center">
                  <img
                    alt="Your Company"
                    src={store?.logoUrl ?? ""}
                    className="size-14  bg-slate-50 rounded-xl border"
                  />
                  <div className="">
                    <div>{store?.name}</div>
                    <div className="text-xs text-slate-600">
                      powered by tchidash
                    </div>
                  </div>
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation
                          .filter(item => !item.isVisible || item.isVisible(store))
                          .map((item) => (
                            <li key={item.name}>
                              <Link
                                href={item.href}
                                className={classNames(
                                  isLinkActive(item.href, pathname)
                                    ? "bg-gray-50 text-primary"
                                    : "text-gray-700 hover:bg-gray-50 hover:text-primary",
                                  "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                                )}
                              >
                                <item.icon
                                  aria-hidden="true"
                                  className={classNames(
                                    isLinkActive(item.href, pathname)
                                      ? "text-primary"
                                      : "text-gray-400 group-hover:text-primary",
                                    "h-6 w-6 shrink-0",
                                  )}
                                />
                                {item.name}
                              </Link>
                            </li>
                          ))}
                      </ul>
                    </li>

                    <li className="mt-auto">
                      <Link
                        href="/dashboard/settings"
                        className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                      >
                        <Settings className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600" />
                        Settings
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Static sidebar for desktop */}
        <div
          className={cn(
            "hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col",
            !desktopOpen && "lg:hidden",
          )}
        >
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
            <div className="flex mt-3 gap-2 h-16 shrink-0 items-center">
              <img
                alt="Your Company"
                src={store?.logoUrl ?? ""}
                className="size-14  bg-slate-50 rounded-xl border"
              />
              <div className="">
                <div>{store?.name}</div>
                <div className="text-xs text-slate-600">
                  powered by tchidash
                </div>
              </div>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation
                      .filter(item => !item.isVisible || item.isVisible(store))
                      .map((item) => (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            className={classNames(
                              isLinkActive(item.href, pathname)
                                ? "bg-primary/10 text-primary border border-primary/10"
                                : "text-gray-700 hover:bg-gray-50 hover:text-primary",
                              "group items-center flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                            )}
                          >
                            <item.icon
                              aria-hidden="true"
                              className={classNames(
                                isLinkActive(item.href, pathname)
                                  ? "text-primary"
                                  : "text-gray-400 group-hover:text-primary",
                                "size-5 shrink-0",
                              )}
                            />
                            {item.name}
                            {item.name === "Orders" &&
                              (totalNewOrders ?? 0) > 0 && (
                                <Badge className="ml-auto">
                                  {totalNewOrders}
                                </Badge>
                              )}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </li>

                <li className="mt-auto">
                  <Link
                    href="/dashboard/settings"
                    className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                  >
                    <Settings
                      aria-hidden="true"
                      className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                    />
                    Settings
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className={cn(desktopOpen ? "lg:pl-72" : "")}>
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon aria-hidden="true" className="h-6 w-6" />
            </button>

            {/* Separator */}
            <div
              aria-hidden="true"
              className="h-6 w-px bg-gray-200 lg:hidden"
            />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="flex-1 flex h-full items-center">
                <Button
                  className="hidden -ml-2 lg:flex mr-4"
                  size={"icon"}
                  variant={"outline"}
                  onClick={() => setDesktopOpen(!desktopOpen)}
                >
                  {/* // open side bar */}
                  <SidebarIcon className="h-5 w-5" />
                </Button>
                <BreadcrumbCom />
              </div>
              <div className="flex items-center gap-x-4 lg:gap-x-4">
                <Notification />

                {/* Profile dropdown */}
                <UserProfileButton />
              </div>
            </div>
          </div>

          <main className="">
            <div className="">{children}</div>
          </main>
        </div>
      </div>
    </>
  );
}

const isLinkActive = (href: string, pathname: string) => {
  if (href !== "/dashboard") {
    return pathname.includes(href);
  } else {
    return pathname === href;
  }
};
