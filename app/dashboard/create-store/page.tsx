"use client"

import { useState } from "react";
import { StoreIcon, Upload, PlusCircle, Loader2  } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { db } from "@/firebase"; // Import your Firebase configuration
import { collection, addDoc, Timestamp } from "firebase/firestore"; // Import Firestore functions
import { Store } from "@/types/store";
import { redirect, useRouter } from "next/navigation";
import { useStore } from "@/store/storeInfos";

export default function CreateNewStore() {
  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/signin");
    },
  });
  const [, setStores] = useState<Store[]>([]);

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setLogoFile(event.target.files[0]);
    }
  };
  const router = useRouter();
  const {setStoreId} = useStore()
  const [loading,setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    setLoading(true)
    event.preventDefault();
    if(!storeName || !storeDescription) {
      return;
    }
    if(!session) return;
    if(!session.user) return;

    const newStore: Store = {
      id: '', // Firebase will generate this
      name: storeName,
      owner: {
        id: "", // Assuming user ID is in session
        name: session?.user?.name || "", // Assuming user name is in session
        email: session?.user?.email || "",
        phoneNumber: "", // Assuming user phone is in session
      },
      ownerEmail: session?.user?.email || "",
      status: "pending_approval", // Default value
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
      description: storeDescription,
      logoUrl: "", // This will be populated after uploading the logo
      settings: {
        currency: "USD", // Default currency
        taxRate: 0, // Default tax rate
      },
      productCount: 0, // Default product count
    };

    try {
      const docRef = await addDoc(collection(db, "stores"), newStore);
      // Set the new store ID
      newStore.id = docRef.id;
      // Update local state
      setStores((prevStores) => [...prevStores, newStore]);
      console.log("New store created with ID:", docRef.id);
      // Optionally, reset the form
      setStoreName("");
      setStoreDescription("");
      setLogoFile(null);
      setStoreId(docRef.id);
      router.push("/dashboard")
    } catch (error) {
      console.error("Error creating store:", error);
    }
  };

  return (
    <div className="w-full bg-slate-100 min-h-screen flex justify-center items-center">
      <div className="container mx-auto py-10">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <StoreIcon className="h-6 w-6" />
              Create New Store
            </CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input
                  id="storeName"
                  placeholder="Enter store name"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeDescription">Store Description</Label>
                <Textarea
                  id="storeDescription"
                  placeholder="Enter store description"
                  value={storeDescription}
                  onChange={(e) => setStoreDescription(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo">Store Logo</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                  <Label
                    htmlFor="logo"
                    className="cursor-pointer flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Upload className="h-5 w-5" />
                    {logoFile ? logoFile.name : "Upload logo"}
                  </Label>
                  {logoFile && (
                    <span className="text-sm text-muted-foreground">
                      File selected
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter>

            <Button disabled={!storeName || !storeDescription} type="submit" className="w-full py-6 flex gap-4">
                <PlusCircle className="h-5 w-5 mr-2" />
                Create Store
              {
                loading &&
                <Loader2 className="animate-spin ml-2" />
              }
            </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
