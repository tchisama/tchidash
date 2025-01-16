"use client"
import { Button } from "@/components/ui/button";
import { InventoryMovementTable } from "./commponents/InventoryTable";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { usePermission } from "@/hooks/use-permission";

function Page() {

  // Check if the user has view permission
  const hasViewPermission = usePermission();

   if (!hasViewPermission("reviews", "view")) {
    return <div>You dont have permission to view this page</div>;
  }
  return (
    <div>
      <div className="flex justify-between mb-4">
        <div></div>
        <Link href="/dashboard/inventory/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Movement
          </Button>
        </Link>
      </div>
      <InventoryMovementTable />
    </div>
  );
}

export default Page;
