"use client"
import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { MoreVertical, Trash } from 'lucide-react'
import { deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/firebase'
import { toast } from '@/hooks/use-toast'


type Props = {
  id:string
}

function MessageActions({id}: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <span className="sr-only">Open menu</span>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
        onClick={()=>{
          if(confirm("Are you sure you want to delete this message?")){
            deleteDoc(doc(db,"messages",id))
            .then(()=>{
              toast({
                title:"Message deleted",
                description:"Message deleted successfully",
              })
            }).then(()=>{
              setTimeout(() => {
                window.location.reload()
              },1000)
            })
          }
        }}
        className='text-red-600 bg-red-50 hover:bg-red-100'
        >
          <Trash className='mr-2 w-4 h-4'/>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

  )
}

export default MessageActions