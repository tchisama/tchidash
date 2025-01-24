import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { ArrowUpRight, Copy, EditIcon, LayoutGrid, Table, Text, TicketMinus, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useOrderStore } from '@/store/orders';
// import { toast } from 'react-hot-toast'; // For showing toast notifications
import * as XLSX from 'xlsx'; // For exporting to Excel
import { copyToClipboard } from '@/lib/utils'; // Utility function to copy text to clipboard
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase';

function Actions() {
  const router = useRouter();
  const { selectedOrder, orders } = useOrderStore();

  // Function to handle exporting to Excel
  const handleExportExcel = () => {
    const selectedOrdersData = orders.filter(order => selectedOrder.includes(order.id)).map(order => ({
      name: order.customer.name,
      number: order.customer.phoneNumber,
      total: order.totalPrice,
      city: order.customer.shippingAddress.city,
      address: order.customer.shippingAddress.address
    }))
    const worksheet = XLSX.utils.json_to_sheet(selectedOrdersData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, "orders.xlsx");
    // toast.success("Exported to Excel successfully!");
  };

  // Function to handle exporting details
  const handleExportDetails = () => {
    const selectedOrdersData = orders.filter(order => selectedOrder.includes(order.id));
    const data = selectedOrdersData
    .map(order => (`
name: ${order.customer.name}
number: ${order.customer.phoneNumber}
total: ${order.totalPrice} Dh
city: ${order.customer.shippingAddress.city}
address: ${order.customer.shippingAddress.address}
    `)).join('\n\n\n');

    // export text
    const link = document.createElement('a');
    link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(data);
    link.download = 'export_orders.txt';
    
    link.click();
    // toast.success("Exported details successfully!");
  };

  // Function to handle copying details
  const handleCopyDetails = () => {
    const selectedOrdersData = orders.filter(order => selectedOrder.includes(order.id)).
    map(order => (`
name: ${order.customer.name}
number: ${order.customer.phoneNumber}
total: ${order.totalPrice} Dh
city: ${order.customer.shippingAddress.city}
address: ${order.customer.shippingAddress.address}
    `)).join('\n\n\n');
    copyToClipboard(selectedOrdersData);
    // toast.success("Details copied to clipboard!");
  };

  const deleteOrders = async () => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete these orders?");

      orders.forEach(async (order) => {
        if (selectedOrder.includes(order.id) && confirmDelete) {
          if(order.orderStatus !== "pending"){
            alert("You can't delete an order that is not cancelled or returned");
          }else{
            deleteDoc(doc(db,"orders",order.id));
          }
        }
      })
    }catch (error) {
      console.error("Error deleting orders:", error);
    }
  }



  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"}>
        <LayoutGrid className="mr-2 h-4 w-4"/>
        Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {
          selectedOrder.length === 1 && (
            <>
            <DropdownMenuItem onClick={() => router.push(`/dashboard/orders/${orders.find((order) => order.id === selectedOrder[0])?.sequence}`)}>
              <ArrowUpRight className="mr-2 h-4 w-4" />
              View Order
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/dashboard/orders/edit/${orders.find((order) => order.id === selectedOrder[0])?.sequence}`)}>
              <EditIcon className="mr-2 h-4 w-4" />
              Edit Order
            </DropdownMenuItem>

      
            <DropdownMenuSeparator />
            </>
          )
        }
        <DropdownMenuItem onClick={() => router.push("/dashboard/none-layout/tickets")}>
          <TicketMinus className="mr-2 h-4 w-4" />
          Tickets
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportExcel}>
          <Table className="mr-2 h-4 w-4" />
          Export Excel
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleExportDetails}>
          <Text className="mr-2 h-4 w-4" />
          Export Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyDetails}>
          <Copy className="mr-2 h-4 w-4" />
          Copy Details
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={()=>deleteOrders()}
         className='text-red-600 bg-red-50' >
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Actions;
