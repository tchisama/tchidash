'use client'

import { Search, Send } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Textarea } from '@/components/ui/textarea'
import { useChat } from 'ai/react'
import { useSession } from 'next-auth/react'
import { useStore } from '@/store/storeInfos'
import { ScrollArea } from '@/components/ui/scroll-area'
import OrderComponent from './components/OrderComponent'
import { useEffect } from 'react'


export default function Component() {
  const {storeId} = useStore();
  const session = useSession();
  const {
    input,
    handleInputChange,
    handleSubmit,
    messages
  } = useChat({
    api:"/api/ai/chat",
    body:{
      storeId,
      userEmail:session.data?.user?.email,
      userName:session.data?.user?.name
    }
  });

  useEffect(() => {
    console.log(messages)
  },[messages])


  return (
    <div className="flex flex-col flex-1  max-w-5xl mx-auto">
      <div className="flex-1 ">
        <ScrollArea className="h-full  pb-16 p-8">
          {messages.map((message,id) => (
      <div key={id}>
              {
                (message.content ) &&
            <div
              className={`mb-4  px-4 ${
                message.role !== 'user' ? 'text-left  drop-shadow-md ' : 'text-right'
              }`}
            >
              <div
                className={`inline-block max-w-xl px-4 p-2 rounded-lg ${
                  message.role !== 'user'
                    ? 'bg-black/90  text-primary-foreground'
                    : 'bg-white border text-secondary-foreground'
                }`}
                dangerouslySetInnerHTML={{ __html: message.content.replace(/\n/g, '<br/>') }}
              >
              </div>
           </div>
              }
           <div className='p-4'>
            {
              message.toolInvocations?.map(toolInvocation=>{
                const {toolName, args, toolCallId,state} = toolInvocation;
                console.log(toolInvocation)
                if(state === 'result'){
                  if(toolName=== "displayOrder"){
                    const { result } = toolInvocation;
                    return <div key={toolCallId}>
                        <OrderComponent order={result.order} />
                    </div>
                  }
                }else{
                  return <div key={toolCallId}>
                    {
                      toolName === "displayOrder" && <div>Loading Order</div>
                    }
                    {
                      toolName === "getOrdersFromVictorDB" && <div
                      className='p-2 px-4 w-fit items-center bg-white border rounded-xl flex gap-3'
                      > 
                      <Search className="h-4 w-4" />
                      Searching in victor db by {
                        args.prompt}</div>
                    }
                    </div>
                }
              })
            }
           </div>
          </div>
          ))}
        </ScrollArea>
      </div>
      <div className="p-2 bg-white left-1/2 shadow-xl -translate-x-1/2 max-w-3xl rounded-xl bottom-[100px] fixed w-full">
          <form onSubmit={handleSubmit} className="flex space-x-2">
          <Textarea
            placeholder="Type your message..."
            value={input}
            className='bg-slate-50 shadow-none'
            onChange={handleInputChange}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <Button type='submit' onClick={handleSubmit}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
          </form>
        </div>
    </div>
  )
}