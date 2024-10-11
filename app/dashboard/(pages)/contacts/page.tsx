"use client"
import React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { ContactMessage } from '@/types/messages'
import { db } from '@/firebase'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useQuery } from '@tanstack/react-query'
import CreateMessageDialog from './components/CreateMessageDialog'
import { useStore } from '@/store/storeInfos'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
export default function Page() {
  const {storeId} = useStore()
  const {data:messages} = useQuery(
    {
      queryKey: ["messages"],
      queryFn: async () => {
        const q = query(
          collection(db, "messages"),
          where("storeId", "==", storeId),
        );
        const response = await getDocs(q);
        const data = response.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        } as ContactMessage));
        return data;
      }
    }
  )
  return (
    <div>
      <div className="flex justify-end">
      <CreateMessageDialog />
      </div>
    <Card>
      <CardHeader>
        <CardTitle>Customer Messages</CardTitle>
        <CardDescription>
          View all customer messages
        </CardDescription>
      </CardHeader>
      <CardContent>

    <Table>
      <TableCaption>Customer Messages</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Status</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Message</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {
          messages &&
        messages.map((message: ContactMessage) => (
          <TableRow key={message.id}>
            <TableCell>
              {message.status}
            </TableCell>
            <TableCell>{message.name}</TableCell>
            <TableCell>{message.phone}</TableCell>
            <TableCell>{message.message}</TableCell>
            <TableCell>{message.createdAt.toDate().toLocaleString()}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>View</DropdownMenuItem>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Send Email</DropdownMenuItem>
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>  
    </CardContent>
    </Card>
    </div>
    )
}