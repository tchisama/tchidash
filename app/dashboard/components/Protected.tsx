"use client";
import { db } from "@/firebase";
import { fetchStore } from "@/lib/queries/store";
import { useStore } from "@/store/storeInfos";
import { Employee } from "@/types/store";
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
  const [dontHaveAccess, setDontHaveAccess] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

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
    setLoading(true);
    if (!store) return;
    if (!session) return;
    if (session?.user == undefined) return;
    if (session?.user.email == undefined) return;

    if (
      pathname === "/dashboard/create-store" ||
      pathname === "/dashboard/switch-store"
    ) {
      setLoading(false);
      return setDontHaveAccess(false);
    }

    let employee: Employee | null | "admin" = null;
    const email = session?.user.email;
    employee =
      store.employees?.find((employee) => employee.email === email) ?? null;
    if (store.ownerEmail === session?.user.email) {
      employee = "admin";
    }
    setLoading(false);
    if (!employee) {
      //redirect("/dashboard/switch-store");
      return setDontHaveAccess(true);
    }
    if (employee === "admin") {
      // Do something
      return setDontHaveAccess(false);
    }
    if (employee.access[pathname.split("/")[2]]) {
      return setDontHaveAccess(false);
    } else {
      //redirect("/dashboard/switch-store");
      setDontHaveAccess(false);
      if (Object.keys(employee.access).filter((key) => key).length === 0) {
        return redirect("/dashboard/switch-store");
      }
      return redirect("/dashboard/" + Object.keys(employee.access)[0]);
    }
  }, [store, session, pathname, setDontHaveAccess, setLoading]);

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
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }
  if (dontHaveAccess) {
    return (
      <div className="flex h-screen items-center justify-center">
        You are not authorized to access this page
      </div>
    );
  }

  return <div>{children}</div>;
}

export default Protected;

