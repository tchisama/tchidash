"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useStore } from "@/store/storeInfos";
import axios from "axios";

export default function Component() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [error, setError] = useState("");
  const [qrCode, setQrCode] = useState("");

  const { storeId } = useStore();
  const handleLogin = () => {
    if (!storeId) return;
    const url = "http://localhost:4000/connect";
    axios
      .post(url, {
        sessionId: storeId,
      })
      .then((res) => {
        setShowQR(true);
        setQrCode(res.data.qrCodeUrl);
      });
  };

  useEffect(() => {
    checkLogin();
  }, [storeId]);

  const checkLogin = () => {
    const url = "http://localhost:4000/check";
    axios
      .post(url, {
        sessionId: storeId,
      })
      .then((res) => {
        if (res.data.status == "running") {
          setIsLoggedIn(true);
          setShowQR(false);
        }
      })
      .catch((err) => {
        setError(JSON.stringify(err.message));
      });
  };

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
          {/* {showQR && <QRCode value={qrCode} />} */}
          {showQR && <img src={qrCode} alt="QR Code" className="w-1/2" />}
          {isLoggedIn && (
            <div className="flex justify-between">
              <p className="text-green-600">Logged in successfully!</p>
            </div>
          )}
          <Button
            onClick={() => {
              const url = "http://localhost:4000/send";
              axios
                .post(url, {
                  sessionId: storeId,
                  message: "Hello from Whatsapp",
                  to: "212770440046",
                })
                .then((res) => {
                  console.log(res.data);
                  if (res.data.success) {
                    alert("Message sent successfully");
                  }
                });
            }}
          >
            Send Demo Message
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
