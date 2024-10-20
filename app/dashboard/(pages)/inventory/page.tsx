import { Button } from "@/components/ui/button";
import { InventoryMovementTable } from "./commponents/InventoryTable";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

function page() {
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

export default page;
