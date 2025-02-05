"use client";
import { usePermission } from "@/hooks/use-permission";
import { ShippingCard } from "./components/Shipping";
import { StoreDetailsCard } from "./components/Store";
import WhatsappConfirmationMessage from "./components/Whatsapp-confirmation-message";
import AskForReviewSettings from "./components/Ask-for-review";

export default function Page() {
  // Check if the user has view permission
  const hasViewPermission = usePermission();

  if (!hasViewPermission("settings", "view")) {
    return <div>You dont have permission to view this page</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <StoreDetailsCard />
      <ShippingCard />
      <WhatsappConfirmationMessage />
      <AskForReviewSettings />
    </div>
  );
}
