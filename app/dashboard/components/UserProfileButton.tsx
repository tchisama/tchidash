"use client"
import React from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useStore } from "@/store/storeInfos"
import { Employee } from "@/types/store"
import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import useClean from '@/hooks/useClean'
import { InfoIcon, LogOutIcon, SettingsIcon, StoreIcon } from 'lucide-react'




function UserProfileButton() {
  const { store, setStoreId } = useStore();
  const { data: session } = useSession();
  const router = useRouter();
  const { cleanAll } = useClean();

  return (
    <DropdownMenu>
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
                        store?.employees?.find(
                          (employee: Employee) =>
                            employee.email === session?.user?.email
                        )?.name ?? ""
                      }
                    </span>
                  </div>
                  <Image
                    src={
                      (store  && 
                      store.employees?.find(
                        (employee: Employee) =>
                          employee.email === session?.user?.email
                        )?.imageUrl )?? ""
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
                  <StoreIcon className="mr-2 h-4 w-4" />
                  Switch Store
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => {
                    router.push("/dashboard/settings");
                  }}
                >
                  <SettingsIcon
                    className="mr-2 h-4 w-4"
                  />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <InfoIcon
                    className="mr-2 h-4 w-4"
                  />
                  Support
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    setStoreId("");
                    signOut();
                  }}
                >
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
  )
}

export default UserProfileButton