"use client"
import { OrderView } from "./components/order-view"
import { useQuery } from "@tanstack/react-query"
import { and, collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/firebase"
import { Order } from "@/types/order"
import { useParams } from "next/navigation"
import { useOrderStore } from "@/store/orders"
import { useStore } from "@/store/storeInfos"
import OrderNotes from "../components/OrderNotes"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import TimeLine from "./components/TimeLine"


export default function OrderPage() {
  const { orderId:id } = useParams<{ orderId: string }>()
  const { setCurrentOrder,setOrders,orders } = useOrderStore();
  const {storeId} = useStore()
  const {data:order} = useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      try{
        if(!id) return null
        if(!storeId) return null
        const sequence = parseInt(id)
        const q= query(collection(db,"orders"),and( where("sequence","==",sequence),where("storeId","==",storeId)))
        const o = await getDocs(q).then((response) => response.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Order))[0])
        console.log(o)
        if(!o) return null
        setOrders([...(orders??[]),o])
        setCurrentOrder(o.id)
        return o
      }catch(e){
        console.log("EEE")
        console.error(e)
        return null
      }
    }})
  
      
  if(!order) return <div>no order found</div>


  return <div className="flex  xl:flex-row flex-col gap-2">
    <div className="flex-1">
      <OrderView order={order} />
    </div>
    <div className="p-2 pt-0 flex flex-col gap-4 lg:p-0">
      <Card>
        <CardHeader>
          <CardTitle>Order Notes</CardTitle>
        </CardHeader>
        <CardContent className="min-h-[500px] max-h-[800px]  lg:w-[400px]">
<Tabs defaultValue="notes" className="max-h-[700px] overflow-auto">
  <TabsList>
    <TabsTrigger value="notes">Notes</TabsTrigger>
    <TabsTrigger value="timeline">TimeLine</TabsTrigger>
  </TabsList>
  <TabsContent value="notes">
    <OrderNotes />
  </TabsContent>
  <TabsContent value="timeline">
    <TimeLine />
  </TabsContent>
</Tabs>

        </CardContent>
      </Card>
    </div>
    </div>
}

