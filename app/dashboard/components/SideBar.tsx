"use client";
import React, { useEffect } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import Image from "next/image";
import Home from "@/public/images/svgs/icons/home.svg";
import Cart from "@/public/images/svgs/icons/cart.svg";
// import Graph from "@/public/images/svgs/icons/graph.svg";
import Settings from "@/public/images/svgs/icons/settings.svg";
import Product from "@/public/images/svgs/icons/product.svg";
import Mail from "@/public/images/svgs/icons/mail.svg";
import Customers from "@/public/images/svgs/icons/customers.svg";
import Stars from "@/public/images/svgs/icons/stars.svg";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

import { db } from "@/firebase";
import { useStore } from "@/store/storeInfos";
import { Employee, Store } from "@/types/store";
import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";

const iconsClass =
  "h-5 w-5 group-hover:scale-[1.05] duration-200 hover:cursor-pointer";
type NavIconClass = { className?: string };
export const navLinks = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: ({ className }: NavIconClass) => (
      <Image src={Home} alt="Home" className={cn(iconsClass, className)} />
    ),
  },
  {
    href: "/dashboard/orders",
    label: "Orders",
    icon: ({ className }: NavIconClass) => (
      <Image src={Cart} alt="Cart" className={cn(iconsClass, className)} />
    ),
  },
  {
    href: "/dashboard/products",
    label: "Products",
    icon: ({ className }: NavIconClass) => (
      <Image
        src={Product}
        alt="Product"
        className={cn(iconsClass, className)}
      />
    ),
  },
  // {
  //   href: "/dashboard/analytics",
  //   label: "Analytics",
  //   icon: ({ className }: NavIconClass) => (
  //     <Image src={Graph} alt="Graph" className={cn(iconsClass, className)} />
  //   ),
  // },
  {
    href: "/dashboard/contacts",
    label: "contacts",
    icon: ({ className }: NavIconClass) => (
      <Image src={Mail} alt="Mail" className={cn(iconsClass, className)} />
    ),
  },
  {
    href: "/dashboard/reviews",
    label: "Reviews",
    icon: ({ className }: NavIconClass) => (
      <Image src={Stars} alt="Mail" className={cn(iconsClass, className)} />
    ),
  },
  {
    href: "/dashboard/customers",
    label: "Customers",
    icon: ({ className }: NavIconClass) => (
      <Image
        src={Customers}
        alt="Customers"
        className={cn(iconsClass, className)}
      />
    ),
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: ({ className }: NavIconClass) => (
      <Image
        src={Settings}
        alt="Settings"
        className={cn(iconsClass, className)}
      />
    ),
    isSettings: true,
  },
];

function SideBar() {
  const pathname = usePathname();

  const { storeId } = useStore();
  const { data: session } = useSession();
  const { data } = useQuery({
    queryKey: ["store", storeId],
    queryFn: async () => {
      if (!storeId) return null;
      const store: Store = await getDoc(doc(db, "stores", storeId)).then(
        (doc) => {
          return { ...doc.data(), id: doc.id } as Store;
        },
      );
      return store;
    },
    refetchOnWindowFocus: false,
  });
  const [employee, setEmployee] = React.useState<Employee | null | "admin">(
    null,
  );
  useEffect(() => {
    if (!data) return;
    if (!session) return;
    if (!session.user) return;
    if (!session.user.email) return;
    if (data.ownerEmail == session?.user?.email) {
      setEmployee("admin");
      return;
    }
    if (!data.employees) return;
    setEmployee(
      data.employees.find(
        (employee) => employee.email === session?.user?.email,
      ) ?? null,
    );
  }, [data, session, setEmployee]);

  return (
    <aside className=" px-1 sticky top-4 rounded-2xl h-[80vh] overflow-y-auto inset-y-0 left-0 z-10 hidden flex-col  m-2  sm:flex">
      <nav className="flex flex-col  gap-1 px-1 sm:py-3">
        <div className="mb-10 text-slate-700 px-2 font-bold">
          <p className="text-xs font-light text-slate-500">powered by</p>
          TchiDash
          <span className="sr-only">Acme Inc</span>
        </div>
        {navLinks
          .filter((link) => {
            if (employee === "admin") return true;
            if (!employee) return false;
            if (employee?.access?.[link?.label.toLowerCase()]) {
              return true;
            } else {
              return false;
            }
          })
          .map(
            (link, index) =>
              !link.isSettings && (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <Link
                      href={link.href}
                      className={cn(
                        "flex px-2 hover:bg-slate-50 pr-12 h-10 hover:border group duration-200 items-center border-slate-100 border gap-2 rounded-lg text-slate-700 transition-colors hover:text-foreground",
                        (
                          link.href === "/dashboard"
                            ? link.href === pathname
                            : pathname.includes(link.href)
                        )
                          ? "bg-white   font-bold "
                          : "",
                      )}
                    >
                      {link.icon({})}
                      <span className="text-sm">{link.label}</span>
                      <span className="sr-only">{link.label}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{link.label}</TooltipContent>
                </Tooltip>
              ),
          )}
      </nav>
      <nav className="mt-auto flex w-full  flex-col items-center gap-4 px-2 sm:py-5 sm:pb-3">
        {navLinks
          .filter((link) => link.isSettings)
          .filter((link) => {
            if (employee === "admin") return true;
            if (!employee) return false;
            if (employee?.access?.[link?.label.toLowerCase()]) {
              return true;
            } else {
              return false;
            }
          })
          .map((link, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Link
                  href={link.href}
                  className={cn(
                    "flex w-full px-2 pr-4 h-10  group duration-200 items-center border-slate-100 border gap-2 rounded-lg text-muted-foreground transition-colors hover:text-foreground",
                    pathname === link.href ? "bg-white   font-bold " : "",
                  )}
                >
                  {link.icon({})}
                  <div className="text-sm">{link.label}</div>
                  <span className="sr-only">{link.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{link.label}</TooltipContent>
            </Tooltip>
          ))}
      </nav>
    </aside>
  );
}

export default SideBar;
