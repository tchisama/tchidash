import { ShippingCard } from "./components/Shipping";
import { StoreDetailsCard } from "./components/Store";

export default function Page() {
  return (
    <div>
      <StoreDetailsCard />
      <ShippingCard />
    </div>
  );
}
