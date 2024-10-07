"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Store } from "lucide-react"
import { cn } from "@/lib/utils"
import { and, collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/firebase"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"

interface Store {
  id: string
  name: string
  description: string
}


export default function StoreSwitchCard() {
  const [selectedStore, setSelectedStore] = useState<string>("")
  const [stores,setStores] = useState<Store[]>([])
    const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/signin')
    }
  })

  useEffect(() => {
    if(!session) return
    if(! session?.user?.email) return
    const fetchStores = async () => {
      try {
        const q = query(collection(db, "stores"), and(where("status", "==", "active"), where("ownerEmail", "==", session?.user?.email)))
        const querySnapshot = await getDocs(q)
        const stores = querySnapshot.docs.map((doc) => doc.data() as Store)
        setStores(stores)
      } catch (error) {
        console.error("Error fetching stores:", error)
      }
    }

    fetchStores()
  }, [session])


  const handleContinue = () => {
    console.log(`Continuing to dashboard for store: ${selectedStore}`)
    // Add your logic here to navigate to the dashboard or perform any other action
  }

  return (
    <div className="flex justify-center items-center w-full h-screen bg-slate-100">
    <Card className="w-full  max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Switch Store</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedStore} onValueChange={setSelectedStore}>
          {
            stores &&
          stores.map((store: Store) => (
            <div onClick={() => setSelectedStore(store.id)} key={store.id} className={cn("duration-200 flex cursor-pointer py-4 items-center bg-slate-50 border p-2 space-x-2 mb-1 rounded-xl pl-4", 
              selectedStore === store.id ? "border-primary bg-primary/10" : "border"
             )}>
              <RadioGroupItem value={store.id} id={store.id} />
              <Label htmlFor={store.id} className="flex items-center cursor-pointer">
                <Store strokeWidth={1.3} className="h-7 w-7 mr-2 text-muted-foreground" />
                <div>
                  <div className="font-medium">{store.name}</div>
                  <div className="text-sm text-muted-foreground">{store.description}</div>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
        <Button variant={"outline"} className="w-full py-6 mt-6">
            Add New Store
        </Button>
      </CardContent>
      <CardFooter>
        <Button onClick={handleContinue} className="w-full py-6">
          Continue to Dashboard
        </Button>
      </CardFooter>
    </Card>
    </div>
  )
}