"use client";
import { db } from "@/firebase";
import { fetchStore } from "@/lib/queries/store";
import { useStore } from "@/store/storeInfos";
import { useQuery } from "@tanstack/react-query";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { redirect, usePathname } from "next/navigation";
import React, { useEffect } from "react";

function Protected({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/signin");
    },
  });
  const { storeId, loadStoreId, setStore } = useStore();
  //const [loading, setLoading] = React.useState(true);

  const { data: store } = useQuery({
    queryKey: ["store", storeId],
    queryFn: () => {
      if (!storeId) return null;
      return fetchStore({
        storeId,
      });
    },
    refetchOnWindowFocus: false,
  });
  useEffect(() => {
    if (store) {
      setStore(store);
    }
  }, [store, setStore]);

  useEffect(() => {
    //setLoading(true);
    if (!store) return;
    if (!session) return;
    if (session?.user == undefined) return;
    if (session?.user.email == undefined) return;

  }, [store, session, pathname]);

  useEffect(() => {
    loadStoreId();
    if (session) {
      if (!storeId) {
        if (
          pathname !== "/dashboard/create-store" &&
          pathname !== "/dashboard/switch-store"
        ) {
          redirect("/dashboard/switch-store");
        }
      }
      handleFirstTimeRegistration(
        session.user as {
          email: string;
          name: string;
          image: string;
        },
      );
    }
  }, [session, storeId, redirect, pathname]);

  const handleFirstTimeRegistration = async (user: {
    email: string;
    name: string;
    image: string;
  }) => {
    try {
      const userEmail = user.email;
      if (!userEmail) {
        throw new Error("User email is undefined");
      }

      const userRef = doc(db, "users", userEmail); // Use email as the document ID
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        // User is registering for the first time
        await setDoc(userRef, {
          email: user.email,
          name: user.name || "Anonymous",
          image: user.image || "",
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
      }
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };
  if (!session) {
    return null;
  }
  //if (loading) {
  //  return (
  //    <div className="flex h-screen items-center justify-center">
  //      Loading...
  //    </div>
  //  );
  //}

  return <div>{children}</div>;
}

export default Protected;
