import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SendIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

function WhatsappCard() {
  const [content, setContent] = React.useState("");
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(content);
    setContent("");
  };
  return (
    <Card className="flex m-0 shadow-none p-0 relative border-none  flex-col h-full ">
      <CardContent className=" p-0 overflow-y-auto border-t  py-6 space-y-4 flex-1">
        <Message text="Hello" isUser={true} />
        <Message text="Hi" isUser={false} />
        <Message text="How are you?" isUser={true} />
        <Message text="I'm good" isUser={false} />
      </CardContent>
      <CardFooter className="w-full px-0 pb-0">
        <form
          onSubmit={onSubmit}
          className="flex w-full pt-4  items-start space-x-2  border-t"
        >
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 h-12 bg-slate-50"
          />
          <Button disabled={!content} type="submit" size="icon">
            <SendIcon className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
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

export default WhatsappCard;
