import { ShippingCard } from "./components/Shipping";
import { StoreDetailsCard } from "./components/Store";

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <StoreDetailsCard />
      <ShippingCard />
    </div>
  );
}
