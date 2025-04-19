"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, PlusCircle, StoreIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { and, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { signOut, useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/store/storeInfos";
import useClean from "@/hooks/useClean";
import { Store } from "@/types/store";
import Image from "next/image";

export default function StoreSwitchCard() {
  const [selectedStore, setSelectedStore] = useState<string>("");
  const [stores, setStores] = useState<Store[]>([]);
  const [workOnStores, setWorkOnStores] = useState<Store[]>([]);
  const { cleanAll } = useClean();
  const { setStoreId } = useStore();
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/signin");
    },
  });

  useEffect(() => {
    if (!session) return;
    if (!session?.user?.email) return;
    const fetchStores = async () => {
      try {
        const q = query(
          collection(db, "stores"),
          and(where("ownerEmail", "==", session?.user?.email)),
        );
        const querySnapshot = await getDocs(q);
        const ownedStores = querySnapshot.docs.map(
          (doc) => ({ ...doc.data(), id: doc.id }) as Store,
        );
        cleanAll();
        setStores(ownedStores);

        const q2 = query(
          collection(db, "stores"),
          and(where("employeesEmails", "array-contains", session?.user?.email)),
        );
        const querySnapshot2 = await getDocs(q2);
        const allWorkOnStores = querySnapshot2.docs.map(
          (doc) => ({ ...doc.data(), id: doc.id }) as Store,
        );

        // Filter out stores that you already own
        const filteredWorkOnStores = allWorkOnStores.filter(
          (store) =>
            !ownedStores.some((ownedStore) => ownedStore.id === store.id),
        );

        setWorkOnStores(filteredWorkOnStores);
      } catch (error) {
        console.error("Error fetching stores:", error);
      }
    };

    fetchStores();
  }, [session, cleanAll]);

  const router = useRouter();

  const handleContinue = () => {
    setLoading(true);
    console.log(`Continuing to dashboard for store: ${selectedStore}`);
    setStoreId(selectedStore);
    router.push("/dashboard");
  };

  return (
    <div className="flex justify-center items-center w-full h-screen bg-muted">
      <Card className="w-full  max-w-lg mx-auto">
        <CardHeader className="flex flex-row justify-between items-start">
          <CardTitle className="text-2xl font-bold">Switch Store</CardTitle>
          <Link href={"/dashboard/create-store"}>
            <Button variant={"outline"} className="w-full">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Store
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedStore} onValueChange={setSelectedStore}>
            <div className="text-sm text-muted-foreground">Your Stores</div>
            {stores &&
              stores.map((store: Store) => (
                <div
                  onClick={() => setSelectedStore(store.id)}
                  key={store.id}
                  className={cn(
                    "duration-200 flex cursor-pointer py-4 items-center bg-slate-50 border p-2 space-x-2 mb-1 rounded-xl pl-4",
                    selectedStore === store.id
                      ? "border-primary bg-primary/10"
                      : "border",
                  )}
                >
                  <RadioGroupItem value={store.id} id={store.id} />
                  <Label
                    htmlFor={store.id}
                    className="flex items-center cursor-pointer"
                  >
                    {store?.logoUrl ? (
                      <Image
                        src={store.logoUrl ?? ""}
                        alt={store.name}
                        width={60}
                        height={60}
                        className="w-12 p-2 bg-white mr-3 aspect-square object-contain border rounded-md "
                      />
                    ) : (
                      <StoreIcon
                        strokeWidth={1.3}
                        className=" mr-3 text-muted-foreground w-[50px] p-3 bg-white border rounded-md h-[50px]"
                      />
                    )}
                    <div>
                      <div className="font-medium">{store.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {store.description}
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            {workOnStores.length > 0 && (
              <>
                <div className="text-sm text-muted-foreground">
                  Stores you work on
                </div>
                {workOnStores.map((store: Store) => (
                  <div
                    onClick={() => setSelectedStore(store.id)}
                    key={store.id}
                    className={cn(
                      "duration-200 flex cursor-pointer py-4 items-center bg-slate-50 border p-2 space-x-2 mb-1 rounded-xl pl-4",
                      selectedStore === store.id
                        ? "border-primary bg-primary/10"
                        : "border",
                    )}
                  >
                    <RadioGroupItem value={store.id} id={store.id} />
                    <Label
                      htmlFor={store.id}
                      className="flex items-center cursor-pointer"
                    >
                      {store?.logoUrl ? (
                        <Image
                          src={store.logoUrl ?? ""}
                          alt={store.name}
                          width={60}
                          height={60}
                          className="w-12 p-2 bg-white mr-3 aspect-square object-contain border rounded-md "
                        />
                      ) : (
                        <StoreIcon
                          strokeWidth={1.3}
                          className=" mr-3 text-muted-foreground w-[50px] p-3 bg-white border rounded-md h-[50px]"
                        />
                      )}
                      <div>
                        <div className="font-medium">{store.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {store.description}
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </>
            )}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex gap-2 flex-col">
          <Button
            disabled={!selectedStore}
            onClick={handleContinue}
            className="w-full py-6 flex gap-4"
          >
            Continue to Dashboard
            {loading && <Loader2 className="animate-spin ml-2" />}
          </Button>
          <p className="mt-4">
            signed in as {session?.user?.name},
            <Link
              href={"/api/auth/signin"}
              onClick={() => signOut()}
              className="text-primary hover:underline"
            >
              {" "}
              sign out
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
