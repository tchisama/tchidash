"use client"
import { Button } from '@/components/ui/button'
import useNotification from '@/hooks/useNotification'
import useRenderWhatsappMessage from '@/lib/utils/functions/renderWhatsappMessage'
import { useStore } from '@/store/storeInfos'
import { Order } from '@/types/order'
import { Stars } from 'lucide-react'
import { useSession } from 'next-auth/react'
import React from 'react'

function AskForReviewButton({
  currentOrder
}:{
  currentOrder:Order
}) {
  const {store,storeId} = useStore()
  const {data:session} = useSession()
  const {sendNotification} = useNotification();
  const renderMessage = useRenderWhatsappMessage({currentOrder});
  return (
    <Button 
    size={"sm"}
    variant={"outline"}
    onClick={()=>{
                          if(!storeId) return;
                          if(!session) return;
                          if(!store) return
                          const AskForReviewMessage = store.AskReviewMessage ?? "";
                          sendNotification(
                            `Sent Ask for review message 💬`,
                            `of order:#${currentOrder?.sequence}`
                          )
                          const message = renderMessage(
                            AskForReviewMessage
                          )
                          window.open(
                            `https://wa.me/212${currentOrder?.customer?.phoneNumber}?text=${encodeURIComponent(
                              message,
                            )}`,
                          );
    }}
    >
     <Stars size={15} className='mr-2'/> Ask Review
    </Button>
  )
}

                        // onClick={() => {
                        // }}

export default AskForReviewButton