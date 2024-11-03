"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface User {
  id: number;
  name: string;
  whatsappNumber: string;
  events: {
    newOrder: boolean;
    dailyReports: boolean;
    pendingOrdersReminders: boolean;
  };
}

interface UserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (user: Omit<User, "id"> | User) => void;
  initialData: User | null;
}

export function UserDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  initialData,
}: UserDialogProps) {
  const [name, setName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [selectedEvents, setSelectedEvents] = useState({
    newOrder: false,
    dailyReports: false,
    pendingOrdersReminders: false,
  });

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setWhatsappNumber(initialData.whatsappNumber);
      setSelectedEvents(initialData.events);
    } else {
      setName("");
      setWhatsappNumber("");
      setSelectedEvents({
        newOrder: false,
        dailyReports: false,
        pendingOrdersReminders: false,
      });
    }
  }, [initialData]);

  const handleEventChange = (event: keyof typeof selectedEvents) => {
    setSelectedEvents((prev) => ({ ...prev, [event]: !prev[event] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userData = {
      name,
      whatsappNumber,
      events: selectedEvents,
    };
    onSubmit(initialData ? { ...userData, id: initialData.id } : userData);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit User" : "Add New User"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter user name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp Number</Label>
            <Input
              id="whatsapp"
              placeholder="Enter WhatsApp number"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Select Events</Label>
            <div className="space-y-2">
              {Object.entries(selectedEvents).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={key}
                    checked={value}
                    onCheckedChange={() =>
                      handleEventChange(key as keyof typeof selectedEvents)
                    }
                  />
                  <Label htmlFor={key}>
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <Button type="submit" className="w-full">
            {initialData ? "Update User" : "Add User"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
