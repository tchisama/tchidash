'use client'
import React from 'react'
import { Timeline, TimelineItem } from '@/components/ui/timeline';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { useOrderStore } from '@/store/orders';
import { collection, orderBy, query, where } from 'firebase/firestore';
import { db } from '@/firebase';
import { dbGetDocs } from '@/lib/dbFuntions/fbFuns';
import { Note } from '../../components/OrderNotes';
import { orderStatusValuesWithIcon } from '../../components/StateChanger';

function TimeLine() {
  const { currentOrder } = useOrderStore()
  const {data:notes} = useQuery({
    queryKey: ['notes',currentOrder?.id],
    queryFn: async () => {
      if(!currentOrder) return []
      const q = query(collection(db, "notes"),where("details.for","==","order"),where("details.orderId","==",currentOrder?.id),orderBy("createdAt","desc"))
      const notes = await dbGetDocs(q, currentOrder.storeId, "")
      return notes.docs.map(doc => ({...doc.data(),id:doc.id}) as Note).reverse()
    }
  })
  return (
    <Card className='h-fit'>   
    <CardHeader>
      <CardTitle>Order Timeline</CardTitle>
    </CardHeader>
    <CardContent>
    <Timeline 
    className='w-[400px] mt-10 ' size={"sm"}>
      <TimelineItem
      // i want the date to be MM/DD - HH:MM
        date={
          <div>
            {currentOrder?.createdAt.toDate().toLocaleDateString()}
            <br />
            {currentOrder?.createdAt.toDate().toLocaleTimeString()}
          </div>
        }
        title="New Order"
        description={
          currentOrder?.customer?.name + " ordered " + currentOrder?.totalItems + " items"
        }
        icon={orderStatusValuesWithIcon.find(status => status.name === "pending")?.icon}
        iconColor={orderStatusValuesWithIcon.find(status => status.name === "pending")?.color + "90"}
        status="completed"
        className='text-[#000a]'
      />
      {
        notes?.map(note => (
          <TimelineItem
            key={note.id}
            date={
              <div>
                {note.createdAt.toDate().toLocaleDateString()}
                <br />
                {note.createdAt.toDate().toLocaleTimeString()}
              </div>
            }
            title={note.changed}
            description={note.creator}
            icon={orderStatusValuesWithIcon.find(status => status.name === note.changed)?.icon}
            iconColor={orderStatusValuesWithIcon.find(status => status.name === note.changed)?.color + "90"}
            className='text-[#000a]'
          />
        ))
      }
    </Timeline>
    </CardContent>
    <CardFooter>
    </CardFooter>
    </Card>
  )
}

export default TimeLine