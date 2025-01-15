"use client"
import React from 'react'

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from '@/components/ui/button'
import { Package2, PanelLeft } from 'lucide-react'
import Link from 'next/link'
import { navLinks } from './SideBar'

function PhoneBar() {
  return (
<Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="#"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                >
                  <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
                  <span className="sr-only">Acme Inc</span>
                </Link>
                {navLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="flex items-center group gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  >
                    {link.icon({className:"h-8 w-8"})}
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
  )
}

export default PhoneBar