'use client'

import { Send } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from '@/components/ui/textarea'
import { useChat } from 'ai/react'


export default function Component() {

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit
  } = useChat({
    api:"/api/ai/chat"
  });



  return (
    <div className="flex flex-col flex-1  max-w-5xl mx-auto">
      <div className="flex-1 ">
        <ScrollArea className="h-full  pb-16 p-8">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4  px-4 ${
                message.role !== 'user' ? 'text-left  drop-shadow-md ' : 'text-right'
              }`}
            >
              <div
                className={`inline-block  px-4 p-2 rounded-lg ${
                  message.role !== 'user'
                    ? 'bg-black/90  text-primary-foreground'
                    : 'bg-white border text-secondary-foreground'
                }`}
              >
                {message.content}
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
            // onKeyPress={(e) => e.key === 'Enter' && handleSend()}
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