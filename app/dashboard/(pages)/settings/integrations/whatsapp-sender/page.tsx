"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { doc, onSnapshot, setDoc, Timestamp } from "firebase/firestore";
import { db } from "@/firebase";
import { useStore } from "@/store/storeInfos";
import QRCode from "react-qr-code";

export default function Component() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [messageTemplate, setMessageTemplate] = useState(
    "Hello! This is a WhatsApp message template.",
  );
  const [error, setError] = useState("");
  const [qrCode, setQrCode] = useState(
    "halkfjasljfaljsfljflkalksdjflakjsdflkjasdflkjalsdkfjalskjdflkajsdf;lkja",
  );

  const { storeId } = useStore();
  const handleLogin = () => {
    if (!storeId) return;
    setDoc(doc(db, "whatsapp-login", storeId), {
      status: "pending",
      storeId,
      action: "login",
      qrCode: "",
      createdAt: Timestamp.now(),
    }).then(() => {
      setShowQR(true);
    });
  };

  useEffect(() => {
    if (!storeId) return;
    const unsubscribe = onSnapshot(
      doc(db, "whatsapp-login", storeId),
      (doc) => {
        if (!doc.exists()) return;
        const data = doc.data();
        if (!data) return;
        if (data?.status === "success") {
          setIsLoggedIn(true);
          setShowQR(false);
          setQrCode("");
          unsubscribe();
        } else if (data?.status === "ready") {
          setQrCode(data.qrCode);
        } else if (data?.status === "success") {
          setIsLoggedIn(true);
          setShowQR(false);
          setQrCode("");
          unsubscribe();
        } else if (data?.status === "error") {
          setError(data.error);
          setShowQR(false);
          setQrCode("");
          unsubscribe();
        }
      },
    );
  }, [storeId]);

  return (
    <div className="w-full max-w-4xl  space-y-6 p-4">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">WhatsApp Sender</h1>
          <p className="text-gray-600 mb-4">
            Login to your WhatsApp account to send messages.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col items-start space-y-4">
          {error && <p className="text-red-600">{error}</p>}
          {!isLoggedIn && (
            <Button onClick={handleLogin} disabled={showQR}>
              {showQR ? "Scanning..." : "Login"}
            </Button>
          )}
          {showQR && <QRCode value={qrCode} />}
          {isLoggedIn && (
            <div className="flex justify-between">
              <p className="text-green-600">Logged in successfully!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {isLoggedIn && (
        <Card>
          <CardHeader>
            <CardTitle>Order Confirmation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-green-100 rounded-lg p-4 ">
              <Textarea
                value={messageTemplate}
                onChange={(e) => setMessageTemplate(e.target.value)}
                placeholder="Edit your WhatsApp message template here"
                className="min-h-[100px] bg-white max-w-md"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
