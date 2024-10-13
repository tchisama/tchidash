import { db } from "@/firebase";
import { Store } from "@/types/store";
import { doc, getDoc } from "firebase/firestore";

export async function fetchStore({ storeId }: { storeId: string }) {
  if (!storeId) return null;
  const store: Store = await getDoc(doc(db, "stores", storeId)).then((doc) => {
    return { ...doc.data(), id: doc.id } as Store;
  });
  return store;
}
