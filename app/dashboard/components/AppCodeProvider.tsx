"use client";
import { db } from "@/firebase";
import {
  and,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useStore } from "@/store/storeInfos";
import { Button } from "@/components/ui/button";

type Props = {
  children: React.ReactNode;
};

type CodeRequest = {
  id: string;
  email: string;
  code: number;
  createdAt: Timestamp;
};

function AppCodeProvider({ children }: Props) {
  const [codeReqeusts, setCodeRequests] = React.useState<CodeRequest[]>([]);
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = React.useState(false);
  const { storeId } = useStore();
  const [error, setError] = React.useState("");

  useEffect(() => {
    // get snapshot of code requests
    if (!session) return;
    if (!session?.user) return;
    if (!session?.user.email) return;
    const q = query(
      collection(db, "auth-subscribers"),
      and(
        where("email", "==", session?.user.email),
        where("approved", "==", false),
      ),
    );
    onSnapshot(q, (snapshot) => {
      const codeRequests = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as CodeRequest,
      );
      setCodeRequests(codeRequests);
    });
  }, [session]);
  useEffect(() => {
    if (codeReqeusts.length > 0) {
      setIsOpen(true);
      setCode("");
    }
  }, [codeReqeusts]);

  const [code, setCode] = React.useState("");

  useEffect(() => {
    setError("");
  }, [code, isOpen]);

  return (
    <div>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Code Request</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            You have a pending code request. Please enter the code to continue
          </AlertDialogDescription>

          <div className="flex justify-center items-center py-8">
            <InputOTP
              maxLength={6}
              value={code}
              onChange={(value) => {
                setCode(value);
              }}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                if (codeReqeusts.length > 0)
                  deleteDoc(doc(db, "auth-subscribers", codeReqeusts[0].id));
              }}
            >
              Cancel
            </AlertDialogCancel>
            <Button
              onClick={() => {
                if (codeReqeusts[0].code === parseInt(code)) {
                  updateDoc(doc(db, "auth-subscribers", codeReqeusts[0].id), {
                    approved: true,
                    storeId,
                  });
                  setIsOpen(false);
                } else {
                  setError("Invalid code entered");
                }
              }}
            >
              Approve
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {children}
    </div>
  );
}

export default AppCodeProvider;
