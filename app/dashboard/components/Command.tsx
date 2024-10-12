"use client"

import * as React from "react"
import {
  ShoppingCart,
  Plus,
  Package,
  MessageSquare,
  BarChart,
  Home,
  Star,
} from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
const commandGroups = [
  {
    group: "Home",
    commands: [
      {
        icon: <Home className="mr-2 h-3 w-3" />,
        title: "Home Page",
        url: "/dashboard",
      },
    ],
  },
  {
    group: "Orders",
    commands: [
      {
        icon: <ShoppingCart className="mr-2 h-3 w-3" />,
        title: "Orders List",
        url: "/dashboard/orders",
      },
      {
        icon: <Plus className="mr-2 h-3 w-3" />,
        title: "Create Order",
        url: "/dashboard/orders/new",
      },
    ],
  },
  {
    group: "Products",
    commands: [
      {
        icon: <Package className="mr-2 h-3 w-3" />,
        title: "Products List",
        url: "/dashboard/products",
      },
      {
        icon: <Plus className="mr-2 h-3 w-3" />,
        title: "Create Product",
        url: "/dashboard/dashboard/new",
      },
    ],
  },
  {
    group: "Reviews",
    commands: [
      {
        icon: <Star className="mr-2 h-3 w-3" />,
        title: "Reviews List",
        url: "/dashboard/reviews",
      },
      {
        icon: <Plus className="mr-2 h-3 w-3" />,
        title: "Create New Review",
        url: "/dashboard/new",
      },
    ],
  },
  {
    group: "Messages",
    commands: [
      {
        icon: <MessageSquare className="mr-2 h-3 w-3" />,
        title: "Messages List",
        url: "/dashboard/contacts",
      },
    ],
  },
  {
    group: "Analytics",
    commands: [
      {
        icon: <BarChart className="mr-2 h-3 w-3" />,
        title: "Analytics",
        url: "/dashboard/analytics",
      },
    ],
  },
];

export function DashboardCommand() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <>
    <Input
      type="text"
      placeholder="Command or search..."
      onClick={() => setOpen(true)}
      className="bg-white pl-2"
    />
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {commandGroups.map((group) => (
            <React.Fragment key={group.group}>
              <CommandGroup heading={group.group}>
                {group.commands.map((command) => (
                  <CommandItem
                    key={command.title}
                    onSelect={() => {
                      router.push(command.url)
                      setOpen(false)
                    }}
                  >
                    {command.icon}
                    <span>{command.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </React.Fragment>
          ))}

        </CommandList>
      </CommandDialog>
    </>
  )
}
