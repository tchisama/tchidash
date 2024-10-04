"use client"
import React from 'react'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Link from 'next/link'
import Image from 'next/image';
import Home from "@/public/images/svgs/icons/home.svg"
import Cart from "@/public/images/svgs/icons/cart.svg"
import Graph from "@/public/images/svgs/icons/graph.svg"
import Settings from "@/public/images/svgs/icons/settings.svg"
import Product from "@/public/images/svgs/icons/product.svg"
import { cn } from '@/lib/utils';
import {usePathname } from 'next/navigation';

const iconsClass = "h-7 w-7 group-hover:scale-[1.05] duration-200 hover:cursor-pointer"
type NavIconClass = {className?:string}
export const navLinks = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon:({className}:NavIconClass) => <Image src={Home} alt="Home" className={cn( iconsClass,className)} />,
  },
  {
    href: "/dashboard/orders",
    label: "Orders",
    icon:({className}:NavIconClass) => <Image src={Cart} alt="Cart" className={cn( iconsClass,className)} />,
  },
  {
    href: "/dashboard/products",
    label: "Products",
    icon:({className}:NavIconClass) => <Image src={Product} alt="Product" className={cn( iconsClass,className)} />,
  },
  {
    href: "/dashboard/analytics",
    label: "Analytics",
    icon:({className}:NavIconClass) => <Image src={Graph} alt="Graph" className={cn( iconsClass,className)} />,
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon:({className}:NavIconClass) => <Image src={Settings} alt="Settings" className={cn( iconsClass,className)} />,
    isSettings: true,
  },
];





function SideBar() {
  const pathname = usePathname();
  return (
<aside className="fixed px-2 rounded-2xl inset-y-0 left-0 z-10 hidden w-14 flex-col border m-2 bg-background sm:flex">
        <nav className="flex flex-col items-center gap-3 px-2 sm:py-3">
          <Link
            href="#"
            className="group mb-8 flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            TD
            <span className="sr-only">Acme Inc</span>
          </Link>
          {navLinks.map((link, index) => (
            !link.isSettings && (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Link
                    href={link.href}
                    className={cn("flex h-10 w-10 group bg-slate-50 items-center border justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground",
                      pathname === link.href ? "bg-slate-200 " : "text-muted-foreground"
                    )}
                  >
                    {link.icon({})}
                    <span className="sr-only">{link.label}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{link.label}</TooltipContent>
              </Tooltip>
            )
          ))}
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          {navLinks.filter(link => link.isSettings).map((link, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Link
                  href={link.href}
                  className="flex h-9 w-9 group items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  {link.icon({})}
                  <span className="sr-only">{link.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{link.label}</TooltipContent>
            </Tooltip>
          ))}
        </nav>
      </aside>
  )
}

export default SideBar