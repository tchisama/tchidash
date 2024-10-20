"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "@/store/storeInfos";
import {
  addDoc,
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "@/firebase";
import { Vendor } from "@/types/vendor";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { usePurchaseOrderStore } from "@/store/purchase";
import { PurchaseOrder } from "@/types/inventory";

// VendorCombobox component
export function VendorCombobox() {
  const [open, setOpen] = React.useState(false);

  const [value, setValue] = React.useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false); // Modal visibility state
  const { storeId } = useStore();
  const { currentPurchaseOrder, setCurrentPurchaseOrder } =
    usePurchaseOrderStore();
  const [newVendor, setNewVendor] = React.useState<Vendor>({
    name: "",
    contact: { phone: "", email: "" },
    Image: "",
    id: "",
    address: "",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    storeId: "",
  });

  React.useEffect(() => {
    if (!storeId) return;
    setNewVendor({
      name: "",
      contact: { phone: "", email: "" },
      Image: "",
      id: "",
      address: "",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      storeId: storeId,
    });
  }, [storeId]);

  const {
    data: vendors,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["vendors", storeId],
    queryFn: async () => {
      const q = query(
        collection(db, "vendors"),
        where("storeId", "==", storeId),
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => {
        const data: Vendor = { ...(doc.data() as Vendor) };
        return {
          value: data.name + " - " + data.contact.phone,
          label: data.name,
          id: doc.id,
        };
      });
    },
  });

  React.useEffect(() => {
    if (!value) return;
    if (!vendors) return;
    const vendor = vendors.find((vendor) => vendor.value === value);
    if (vendor) {
      setCurrentPurchaseOrder({
        ...currentPurchaseOrder,
        vendorId: vendor.id,
        vendorName: vendor.label,
      } as PurchaseOrder);
    }
  }, [value, vendors, setCurrentPurchaseOrder]);

  const createVendor = async () => {
    // Create a new vendor
    const vendor = await addDoc(collection(db, "vendors"), newVendor);
    console.log("Vendor created with ID: ", vendor.id);
    setDialogOpen(false);
  };

  if (error) {
    console.log(error);
  }
  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    vendors && (
      <>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className=" justify-between"
            >
              {value
                ? vendors.find((vendor) => vendor.value === value)?.label
                : "Select vendor..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Command>
              <CommandInput placeholder="Search vendor..." />
              <CommandList>
                <CommandEmpty>
                  {/* Button to trigger modal */}
                  <Button
                    variant="link"
                    onClick={() => {
                      setDialogOpen(true);
                    }}
                  >
                    Create new vendor
                  </Button>
                </CommandEmpty>
                <CommandGroup>
                  {vendors.map((vendor) => (
                    <CommandItem
                      key={vendor.value}
                      value={vendor.value}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === vendor.value ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {vendor.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Modal for creating new vendor */}
        <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Create New Vendor</AlertDialogTitle>
              <AlertDialogDescription>
                Fill in the details to create a new vendor.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createVendor();
              }}
            >
              {/* Vendor Name Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Vendor Name
                </label>
                <Input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Vendor name"
                  defaultValue={newVendor.name}
                  value={newVendor.name}
                  onChange={(e) =>
                    setNewVendor({ ...newVendor, name: e.target.value })
                  }
                  required
                />
              </div>

              {/* Vendor Contact Phone */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Contact Phone
                </label>
                <Input
                  type="tel"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Phone number"
                  defaultValue={newVendor.contact.phone}
                  value={newVendor.contact.phone}
                  onChange={(e) =>
                    setNewVendor({
                      ...newVendor,
                      contact: { ...newVendor.contact, phone: e.target.value },
                    })
                  }
                  required
                />
              </div>

              {/* Vendor Contact Email */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Contact Email (Optional)
                </label>
                <Input
                  type="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Email address"
                  defaultValue={newVendor.contact.email}
                  value={newVendor.contact.email}
                  onChange={(e) =>
                    setNewVendor({
                      ...newVendor,
                      contact: { ...newVendor.contact, email: e.target.value },
                    })
                  }
                  required
                />
              </div>
            </form>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDialogOpen(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                type="submit"
                onClick={() => {
                  createVendor();
                }}
              >
                Create
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    )
  );
}
