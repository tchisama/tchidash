import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useOrderStore } from '@/store/orders';
import { Button } from '@/components/ui/button';
import { OrderItem } from '@/types/order';
import { Input } from '@/components/ui/input';
import ChooseProductWithVariant from './ChooseProductWithVariant';


function ItemsTable() {
  const { newOrder, setNewOrder } = useOrderStore();
  
  // new order item with the type of OrderItem
  const addItem = () => {
    const newItem: OrderItem = {
      id: Date.now().toString(),
      productId: "",
      title: "",
      quantity: 1,
      price: 0,
      totalPrice: 0,
      imageUrl: "",
    };
    
    if (!newOrder) return;
    
    setNewOrder({
      ...newOrder,
      items: [...newOrder.items, newItem],
    });
  };

  return (
    <div>
      <Button onClick={addItem} className='ml-auto'>
        Add Item
      </Button>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Product</TableHead>
            <TableHead>Item Price</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead className="text-right">Total Price</TableHead>
          </TableRow>
        </TableHeader>
        
        <TableBody>
          {newOrder?.items.map((item) => (
            <TableRow key={item.id}>
              {/* Product Info */}
              <TableCell>
                <ChooseProductWithVariant />
              </TableCell>

              {/* Item Price */}
              <TableCell>
                <div className="font-medium">{item.price}</div>
              </TableCell>

              {/* Quantity */}
              <TableCell>
                <Input
                  type="number"
                  className='w-32'
                  value={item.quantity}
                  onChange={(e) => {
                    setNewOrder({
                      ...newOrder,
                      items: newOrder?.items.map((i) => {
                        if (i.id === item.id) {
                          return {
                            ...i,
                            quantity: Number(e.target.value),
                            totalPrice: Number(e.target.value) * item.price
                          };
                        }
                        return i;
                    }),
                    });
                  }}
                />
              </TableCell>

              {/* Discount */}
              <TableCell>
                <div className="font-medium">
                  {item.discount?.type === "percentage" 
                    ? `${item.discount.amount}%` 
                    : `${item.discount?.amount}`}
                </div>
              </TableCell>

              {/* Total Price */}
              <TableCell className="text-right">
                <div className="font-medium">{item.totalPrice}</div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default ItemsTable;
