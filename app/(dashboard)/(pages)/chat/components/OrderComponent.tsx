import {  PhoneIcon, MapPinIcon, DollarSignIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function OrderComponent({
  order
}:{
  order: {
    orderId: string
    name: string
    phone: string
    address: string
    city: string
    total: string
    status: string
    note: string
    createdAt: string
  }
}) {
  return (
    <Card  className="w-full max-w-md">
      <CardHeader className="flex flex-row justify-between">
        <CardTitle className="text-2xl">Order</CardTitle>
        <Badge variant="secondary" className="w-fit">
          {order.status}
        </Badge>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center gap-2">
          <div className="font-semibold">
            {order.name}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <PhoneIcon className="h-4 w-4 text-muted-foreground" />
          <div className="text-sm">{
            order.phone
          }</div>
        </div>
        <div className="flex items-start gap-2">
          <MapPinIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div className="text-sm">{
            order.address
            }</div>
        </div>
        <div className="flex items-center gap-2">
          <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
          <div className="font-semibold">Total: {
            order.total
}</div>
        </div>
      </CardContent>
    </Card>
  )
}