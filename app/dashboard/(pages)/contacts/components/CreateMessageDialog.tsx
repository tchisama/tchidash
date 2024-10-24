"use client";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { collection, Timestamp } from "firebase/firestore";
import { db } from "@/firebase";
import { useStore } from "@/store/storeInfos";
import { Textarea } from "@/components/ui/textarea";
import { dbAddDoc } from "@/lib/dbFuntions/fbFuns";

export default function CreateMessageDialog() {
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const { storeId } = useStore();

  const handleSubmit = async () => {
    if (name && phone && message) {
      if (!storeId) return;
      await dbAddDoc(
        collection(db, "messages"),
        {
          name,
          phone,
          storeId,
          message,
          status: "new", // default status for new messages
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        },
        storeId,
        "",
      );
      // Reset the form after submission
      setName("");
      setPhone("");
      setMessage("");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="mb-4 ml-auto">
          Create Message
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create New Message</AlertDialogTitle>
          <AlertDialogDescription>
            Fill in the form below to create a new customer message.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Customer Name"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Customer Phone"
            />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Customer Message"
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit}>Create</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
