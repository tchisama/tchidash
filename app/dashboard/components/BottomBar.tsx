"use client";
import React 
// { useEffect }
 from "react";

import Image from "next/image";
import Home from "@/public/images/svgs/icons/home.svg";
import Cart from "@/public/images/svgs/icons/cart.svg";
import Graph from "@/public/images/svgs/icons/graph.svg";
import Settings from "@/public/images/svgs/icons/settings.svg";
import Product from "@/public/images/svgs/icons/product.svg";
import Mail from "@/public/images/svgs/icons/mail.svg";
import Customers from "@/public/images/svgs/icons/customers.svg";
import Folder from "@/public/images/svgs/icons/folder.svg";
import Stars from "@/public/images/svgs/icons/stars.svg";
import Box from "@/public/images/svgs/icons/box.svg";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

// import { db } from "@/firebase";
// import { useStore } from "@/store/storeInfos";
// import { Employee, Store } from "@/types/store";
// import { useQuery } from "@tanstack/react-query";
// import { doc, getDoc } from "firebase/firestore";
// import { useSession } from "next-auth/react";

import FloatingDock from "./FloatingDock";
import { Loader } from "lucide-react";

const iconsClass =
  "h-6 w-6 group-hover:scale-[1.05] duration-200 hover:cursor-pointer";
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
  {
    href: "/dashboard/inventory",
    label: "Inventory",
    icon: ({ className }: NavIconClass) => (
      <Image src={Box} alt="Box" className={cn(iconsClass, className)} />
    ),
  },
  {
    href: "/dashboard/analytics",
    label: "Analytics",
    icon: ({ className }: NavIconClass) => (
      <Image src={Graph} alt="Graph" className={cn(iconsClass, className)} />
    ),
  },
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
    href: "/dashboard/filesystem",
    label: "Filesystem",
    icon: ({ className }: NavIconClass) => (
      <Image src={Folder} alt="Folder" className={cn(iconsClass, className)} />
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
  // {
  //   href: "/dashboard/chat",
  //   label: "Ai Chat",
  //   icon: ({ className }: NavIconClass) => (
  //     <Image
  //       src={Planet}
  //       alt="Ai Chat"
  //       className={cn(iconsClass, className)}
  //     />
  //   ),
  // }
];

function BottomBar() {
  const pathname = usePathname();

  // const { storeId } = useStore();
  // const { data: session } = useSession();
  // const { data, isLoading } = useQuery({
  //   queryKey: ["store", storeId],
  //   queryFn: async () => {
  //     if (!storeId) return null;
  //     const store: Store = await getDoc(doc(db, "stores", storeId)).then(
  //       (doc) => {
  //         return { ...doc.data(), id: doc.id } as Store;
  //       },
  //     );
  //     return store;
  //   },
  //   refetchOnWindowFocus: false,
  // });
  return (
    <div className="">
      <FloatingDock
        items={
          false
            ? [
                {
                  title: "loading",
                  icon: <Loader className="animate-spin" />,
                  href: "/dashboard",
                  active: false,
                },
              ]
            : [
                ...navLinks
                  .map((link) => ({
                    title: link.label,
                    icon: link.icon({}),
                    href: link.href,
                    active: pathname === link.href,
                  })),
              ]
        }
      />
    </div>
  );
}

export default BottomBar;
