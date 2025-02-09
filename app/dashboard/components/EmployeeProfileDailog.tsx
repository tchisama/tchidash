"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { useDialogs } from "@/store/dialogs";
import { useSession } from "next-auth/react";
import { useStore } from "@/store/storeInfos";
import UploadImageProvider from "@/components/UploadImageProvider";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";

interface UserProfile {
  name: string;
  phoneNumber: string;
  email: string;
  photoUrl: string;
}

export function EmployeeProfileDailog() {
  // const [isOpen, setIsOpen] = useState(false);
  const {
    employeeProfileDialogOpen: isOpen,
    setEmployeeProfileDialogOpen: setIsOpen,
  } = useDialogs();
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    phoneNumber: "",
    photoUrl: "",
    email: "",
  });

  const { data: session } = useSession();
  const { store, setStore } = useStore();

  useEffect(() => {
    if (store) {
      const employee = store?.employees?.find(
        (employee) => employee.email === session?.user?.email,
      );
      if (employee) {
        setProfile({
          name: employee.name,
          phoneNumber: "",
          photoUrl: employee.imageUrl ?? "",
          email: employee.email,
        });
      }
    }
  }, [store, session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const employees = store?.employees?.map((employee) => {
      if (employee.email === profile.email) {
        return { ...employee, name: profile.name, imageUrl: profile.photoUrl };
      }
      return employee;
    });
    if (!store) return;
    updateDoc(doc(db, "stores", store?.id), {
      employees,
    });
    setStore({
      ...store,
      employees,
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center space-y-2">
            <Avatar className="w-36 h-36">
              <AvatarImage src={profile.photoUrl} alt={profile.name} />
              <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <UploadImageProvider
              name={profile.email}
              callback={(url) => {
                setProfile((prev) => ({ ...prev, photoUrl: url }));
              }}
              folder="employees"
            >
              <div className="cursor-pointer">
                <div className="flex items-center space-x-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 rounded-md">
                  <Camera size={16} />
                  <span>Change Photo</span>
                </div>
              </div>
            </UploadImageProvider>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={profile.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={profile.phoneNumber}
              onChange={handleInputChange}
            />
          </div>
          <Button type="submit" className="w-full">
            Save changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
