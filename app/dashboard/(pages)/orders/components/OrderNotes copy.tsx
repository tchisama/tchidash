import React from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SendIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";


function OrderNotes() {
  return (
    <Card className="flex border-none flex-col  ">
      <CardContent className="px-4 overflow-y-auto border-t bg-slate-100 py-6 space-y-4 flex-1">
        <Message text="Hello, how can I assist you today?" isUser={false} />
        <Message
          text="I'd like to get some insights on our sales performance and customer trends."
          isUser
        />
        <Message
          text="Sure, let me pull up that data for you. One moment please..."
          isUser={false}
        />
        <Message
          text="Sales Performance"
          details="- Total revenue for the last quarter: $1.2M\n- 15% increase in sales compared to the previous quarter\n- Top selling product: Acme Pro Subscription"
          isUser
        />
        <Message
          text="Customer Trends"
          details="- 25% increase in new customer signups\n- Average customer lifetime value: $500\n- Top customer locations: San Francisco, New York, London"
          isUser={false}
        />
        <Message
          text="Excellent, this is very helpful. Thank you for the insights!"
          isUser
        />
      </CardContent>
      <CardFooter className="flex flex-col">
        <form className="flex w-full items-start space-x-2 pt-4 border-t">
          <Textarea
            placeholder="Type your message here..."
            className="flex-1 h-12 bg-slate-50"
          />
          <Button type="submit" size="icon">
            <SendIcon className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>

  )
}
function Message({
  text,
  isUser,
  details,
}: {
  text: string;
  isUser: boolean;
  details?: string;
}) {
  return (
    <div
      className={`flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm ${isUser ? "ml-auto bg-primary text-gray-50 border" : "bg-white border dark:bg-gray-800"}`}
    >
      <div>{text}</div>
      {details && <div>{details}</div>}
    </div>
  );
}



export default OrderNotes