"use client";

import { Search, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "ai/react";
import { useSession } from "next-auth/react";
import { useStore } from "@/store/storeInfos";
import { ScrollArea } from "@/components/ui/scroll-area";
import OrderComponent from "./components/OrderComponent";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Component() {
  const { storeId } = useStore();
  const session = useSession();
  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: "/api/ai/chat",
    body: {
      storeId,
      userEmail: session.data?.user?.email,
      userName: session.data?.user?.name,
    },
  });

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  return (
    <div className="flex flex-col flex-1  max-w-6xl mx-auto">
      <div className="flex-1 ">
        <ScrollArea className="h-full  pb-16 p-8">
          {messages.map((message, id) => (
            <div key={id}>
              {message.content && (
                <div
                  className={`mb-4  px-4 ${
                    message.role !== "user" ? "text-left  " : "text-right"
                  }`}
                >
                  <div
                    className={`inline-block max-w-5xl   rounded-lg ${
                      message.role !== "user"
                        ? "bg-white border p-4 "
                        : "bg-primary text-white px-4 py-2"
                    }`}
                  >
                    <ReactMarkdown
                      // style images
                      remarkPlugins={[remarkGfm]}
                      components={{
                        img: ({ ...props }) => (
                          <img
                            {...props}
                            className="bg-slate-50 my-1 mr-2 w-[50px] border border-[#3333] rounded-xl"
                          />
                        ),
                        td: ({ ...props }) => (
                          <td
                            {...props}
                            className="p-1 border pr-8 pl-3   max-w-[250px]  rounded-xl"
                          />
                        ),
                        th: ({ ...props }) => (
                          <th
                            {...props}
                            className="p-1 border pr-8 pl-3 bg-slate-50  max-w-[250px]  rounded-xl"
                          />
                        ),
                        table: ({ ...props }) => (
                          <table
                            {...props}
                            className="table-auto min-w-[700px] mb-4 my-2 mr-2 w-full p-1 border-[#3333] "
                          />
                        ),
                        hr: () => <hr className="my-3" />,
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
              <div className="p-4">
                {message.toolInvocations?.map((toolInvocation) => {
                  const { toolName, args, toolCallId, state } = toolInvocation;
                  console.log(toolInvocation);
                  if (state === "result") {
                    if (toolName === "displayOrder") {
                      const { result } = toolInvocation;
                      return (
                        <div key={toolCallId}>
                          <OrderComponent order={result.order} />
                        </div>
                      );
                    }
                  } else {
                    return (
                      <div key={toolCallId}>
                        {toolName === "displayOrder" && (
                          <div>Loading Order</div>
                        )}
                        {toolName === "getOrdersFromVictorDB" && (
                          <div className="p-2 px-4 w-fit items-center bg-white border rounded-xl flex gap-3">
                            <Search className="h-4 w-4" />
                            Searching in victor db by {args.prompt}
                          </div>
                        )}
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
      <div className="p-2 border bg-white left-1/2 shadow-xl -translate-x-1/2 max-w-3xl rounded-2xl bottom-[20px] fixed w-full">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Textarea
            placeholder="Type your message..."
            value={input}
            className="bg-slate-50 duration-100 focus:border-[2px] border-primary/20 shadow-none"
            onChange={handleInputChange}
          />
          <Button type="submit" onClick={handleSubmit}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
