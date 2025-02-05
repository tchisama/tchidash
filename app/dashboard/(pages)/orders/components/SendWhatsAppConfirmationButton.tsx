"use client"
import { Button } from '@/components/ui/button'
import useNotification from '@/hooks/useNotification'
import useRenderWhatsappMessage from '@/lib/utils/functions/renderWhatsappMessage'
import { useStore } from '@/store/storeInfos'
import { Order } from '@/types/order'
import { IconBrandWhatsapp } from '@tabler/icons-react'
import { useSession } from 'next-auth/react'
import React from 'react'

function SendWhatsAppConfirmationButton({
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
                          const whatsappConfirmMessage =
                            store?.whatsappConfirmationMessage;
                          if (!whatsappConfirmMessage) return;
                          if(!storeId) return;
                          if(!session) return;
                          sendNotification(
                            `Sent whatsapp confirmation 💬`,
                            `of order:#${currentOrder?.sequence}`
                          )
                          const message = renderMessage(
                            whatsappConfirmMessage,
                          )
                          window.open(
                            `https://wa.me/212${currentOrder?.customer?.phoneNumber}?text=${encodeURIComponent(
                              message,
                            )}`,
                          );
    }}
    >
     <IconBrandWhatsapp size={14} className='mr-2'/> Confirm Message
    </Button>
  )
}

                        // onClick={() => {
                        // }}

export default SendWhatsAppConfirmationButton