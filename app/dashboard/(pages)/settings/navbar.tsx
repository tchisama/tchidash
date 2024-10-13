"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const links = [
  {
    href: "/dashboard/settings",
    label: "General",
  },
  {
    href: "/dashboard/settings/security",
    label: "Security",
  },
  {
    href: "/dashboard/settings/integrations",
    label: "Integrations",
  },
  {
    href: "/dashboard/settings/support",
    label: "Support",
  },
  {
    href: "/dashboard/settings/organizations",
    label: "Organizations",
  },
  {
    href: "/dashboard/settings/advanced",
    label: "Advanced",
  },
];
function Navbar() {
  const pathName = usePathname();
  return (
    <div>
      <nav
        className="grid gap-4 text-sm text-muted-foreground"
        x-chunk="dashboard-04-chunk-0"
      >
        {links.map((link) => (
          <Link
            className={`${
              pathName === link.href
                ? "text-primary font-bold"
                : "text-muted-foreground"
            }`}
            key={link.href}
            href={link.href}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default Navbar;
