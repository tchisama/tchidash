"use client";
import {
  Blocks,
  Cpu,
  HelpCircle,
  MessageCircle,
  Settings2,
  Shield,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const links = [
  {
    href: "/dashboard/settings",
    label: "General",
    icon: <Settings2 className="w-4 h-4" />,
  },
  {
    href: "/dashboard/settings/security",
    label: "Security",
    icon: <Shield className="w-4 h-4" />,
  },
  {
    href: "/dashboard/settings/rules",
    label: "Rules",
    icon: <Shield className="w-4 h-4" />,
  },
  {
    href: "/dashboard/settings/whatsapp",
    label: "Communication",
    icon: <MessageCircle className="w-4 h-4" />,
  },
  {
    href: "/dashboard/settings/integrations",
    label: "Integrations",
    icon: <Blocks className="w-4 h-4" />,
  },
  {
    href: "/dashboard/settings/api-docs",
    label: "API Documentation",
    icon: <BookOpen className="w-4 h-4" />,
  },
  {
    href: "/dashboard/settings/support",
    label: "Support",
    icon: <HelpCircle className="w-4 h-4" />,
  },
  {
    href: "/dashboard/settings/advanced",
    label: "Advanced",
    icon: <Cpu className="w-4 h-4" />,
  },
];
function Navbar() {
  const pathName = usePathname();
  return (
    <div className="h-full">
      <h1 className="text-3xl mb-8 font-semibold">Settings</h1>
      <nav
        className="grid gap-4 sticky top-32 text-sm text-muted-foreground"
        x-chunk="dashboard-04-chunk-0"
      >
        {links.map((link) => (
          <Link
            className={`flex items-center gap-2 ${
              pathName === link.href
                ? "text-primary font-bold"
                : "text-muted-foreground"
            }`}
            key={link.href}
            href={link.href}
          >
            {link?.icon}
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default Navbar;
