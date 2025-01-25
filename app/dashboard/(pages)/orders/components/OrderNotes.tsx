import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SendIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import Avvvatars from "avvvatars-react";
import { dbAddDoc, dbGetDocs } from "@/lib/dbFuntions/fbFuns";
import { useStore } from "@/store/storeInfos";
import {
  collection,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { useOrderStore } from "@/store/orders";
import { orderStatusValues } from "@/lib/datajson/states";
import { orderStatusValuesWithIcon } from "./StateChanger";

export type Note = {
  id: string;
  content?: string;
  creator: string;
  createdAt: Timestamp;
  changed?: string;
  details:
    | {
        for: "order";
        orderId: string;
      }
    | {
        for: "customer";
        customerId: string;
      };
};

function OrderNotes() {
  const [content, setContent] = React.useState("");
  const { storeId } = useStore();
  const { data: session } = useSession();
  const { currentOrder } = useOrderStore();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeId) return;
    if (!currentOrder) return;
    dbAddDoc(
      collection(db, "notes"),
      {
        content,
        creator: session?.user?.email,
        createdAt: Timestamp.now(),
        details: {
          for: "order",
          orderId: currentOrder?.id,
        },
      },
      storeId,
      "",
    );
    setContent("");
  };
  const { data: notes, error } = useQuery({
    queryKey: ["notes", storeId, currentOrder?.id],
    queryFn: async () => {
      if (!storeId) return;
      if (!currentOrder) return;
      const q = query(
        collection(db, "notes"),
        where("details.for", "==", "order"),
        where("details.orderId", "==", currentOrder?.id),
        orderBy("createdAt", "desc"),
      );
      return dbGetDocs(q, storeId, "").then((response) =>
        response.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as Note),
      );
    },
  });

  return (
    <Card className="flex m-0 shadow-none p-0 relative border-none  flex-col h-full ">
      <CardContent className=" p-0 overflow-y-auto border-t  py-6 space-y-4 flex-1">
        {error?.message}
        {notes?.map((note) => {
          return <Message key={note.id} note={note} />;
        })}
        {notes?.length === 0 && (
          <p className="flex-1 opacity-40 h-full flex items-center justify-center">
            No History
          </p>
        )}
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
function Message({ note }: { note: Note }) {
  const { storeId,store } = useStore();
  const { data: user, error } = useQuery({
    queryKey: ["user", note.creator, storeId],
    queryFn: async () => {
      if (!storeId) return;
      // const q = query(
      //   collection(db, "users"),
      //   where("email", "==", note.creator),
      // );
      // const response = await dbGetDocs(q, storeId, "").then((response) =>
      //   response.docs.map(
      //     (doc) =>
      //       ({ ...doc.data(), id: doc.id }) as {
      //         id: string;
      //         name: string;
      //         email: string;
      //         image: string;
      //       },
      //   ),
      // );
      // const u = response[0];
      const user = store?.employees?.find(employee => employee.email === note.creator);
      return user;
    },
  });
  return (
    <div className="flex w-full gap-2">
      {error?.message}
      <Avatar className="h-8 w-8 border bg-white">
        <AvatarImage src={user?.imageUrl} />
        <AvatarFallback asChild className="">
          <Avvvatars border value={note.creator} style="shape" />
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 items-start justify-start">
        <div className="flex justify-between">
          <div className="text-sm ml-2">{user?.name}</div>
          <div className="text-sm text-gray-500 flex gap-2">
            <span>
              {new Date(note.createdAt.toDate()).toLocaleDateString()}
            </span>
            <span>
              {new Date(note.createdAt.toDate()).toLocaleTimeString()}
            </span>
          </div>
        </div>
        <div
          className={`flex w-fit border bg-white flex-1 flex-col gap-2 rounded-lg px-3 py-2 text-sm `}
        >
          <div>
            {note?.content ?? (
              <div
                style={{
                  color: orderStatusValues.find(
                    (status) => status.name === note?.changed,
                  )?.color,
                }}
                className="font-bold uppercase flex gap-2 items-center"
              >
                {
                  orderStatusValuesWithIcon.find(
                    (status) => status.name === note?.changed,
                  )?.icon
                }
                {note?.changed}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderNotes;
