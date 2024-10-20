import { db } from "@/firebase";
import { useStore } from "@/store/storeInfos";
import { InventoryMoveStatus } from "@/types/inventory";
import { Product, Variant } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import {
  query,
  collection,
  where,
  and,
  getAggregateFromServer,
  sum,
} from "firebase/firestore";

const useStock = (product: Product, variant?: Variant) => {
  const { storeId } = useStore();
  return useQuery({
    queryKey: ["inventoryStock", product?.id, variant?.id],
    queryFn: () => getStock(storeId ?? "", product, variant),
    //enabled: !!product?.id && !!variant?.id, // Avoid running the query if product or variant is undefined
  });
};

async function getStock(storeId: string, product: Product, variant?: Variant) {
  if (
    product &&
    product.variants &&
    product.variants.length > 0 &&
    !variant &&
    !product.variantsAreOneProduct
  )
    return "has variants";
  if (product.hasInfiniteStock && !variant) return "infinite";
  if (variant && variant.hasInfiniteStock) return "infinite";

  if (variant && !product?.variantsAreOneProduct) {
    const stockQuery = query(
      collection(db, "inventoryItems"),
      and(
        where("storeId", "==", storeId),
        where("productId", "==", product.id),
        where("variantId", "==", variant.id),
        where("status", "==", InventoryMoveStatus.APPROVED),
      ),
    );

    const count = await getAggregateFromServer(stockQuery, {
      stock: sum("quantity"),
    });

    return count.data().stock;
  } else {
    const stockQuery = query(
      collection(db, "inventoryItems"),
      and(
        where("storeId", "==", storeId),
        where("productId", "==", product.id),
        where("status", "==", InventoryMoveStatus.APPROVED),
      ),
    );

    const count = await getAggregateFromServer(stockQuery, {
      stock: sum("quantity"),
    });

    return count.data().stock;
  }
}

export { useStock, getStock };
