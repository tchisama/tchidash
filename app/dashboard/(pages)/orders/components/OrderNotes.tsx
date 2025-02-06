import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SendIcon } from "lucide-react";
import Avvvatars from "avvvatars-react";
import { dbAddDoc } from "@/lib/dbFuntions/fbFuns";
import { useStore } from "@/store/storeInfos";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { useOrderStore } from "@/store/orders";
import { orderStatusValuesWithIcon } from "./StateChanger";
import { MentionInput } from "@/components/MentionInput";

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
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const { storeId } = useStore();
  const { data: session } = useSession();
  const { currentOrder } = useOrderStore();

  // Fetch notes in real-time
  useEffect(() => {
    if (!storeId || !currentOrder) return;

    const q = query(
      collection(db, "notes"),
      where("details.for", "==", "order"),
      where("details.orderId", "==", currentOrder.id),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Note[];
      setNotes(notesData);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [storeId, currentOrder]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeId || !currentOrder || !session?.user?.email) return;

    await dbAddDoc(
      collection(db, "notes"),
      {
        content,
        creator: session.user.email,
        createdAt: Timestamp.now(),
        details: {
          for: "order",
          orderId: currentOrder.id,
        },
      },
      storeId,
      ""
    );

    setContent(""); // Clear input after submission
  };


  return (
    <Card className="flex m-0 shadow-none p-0 relative border-none overflow-y-auto flex-col h-full ">
      <CardContent className=" p-0 overflow-y-auto border-t  py-6 space-y-4 flex-1">
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
          <MentionInput input={content} setInput={setContent} />
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
  const { storeId, store } = useStore();
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
      const user = store?.employees?.find(
        (employee) => employee.email === note.creator,
      );
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
          style={{
            background:
              orderStatusValuesWithIcon.find(
                (status) => status.name === note?.changed,
              )?.color + "90",
            color: "#000a",
          }}
          className={`flex w-fit bg-white flex-1 flex-col gap-2 rounded-full px-3 py-[4px] text-sm `}
        >
          <div>
            {note?.content ?? (
              <div className="font-bold  uppercase flex gap-2 items-center">
                {
                  orderStatusValuesWithIcon.find(
                    (status) => status.name === note?.changed,
                  )?.icon
                }
                {note?.changed }
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderNotes;
