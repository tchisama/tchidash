"use client";

import Avvvatars from "avvvatars-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlarmCheck,
  ChartBar,
  MoreVertical,
  PlusCircle,
  StarsIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@radix-ui/react-separator";
import { UserDialog } from "./user-dialog";
import { Switch } from "@/components/ui/switch";
import { whatsappUser } from "@/types/store";
import {
  dbDeleteDoc,
  dbGetDocs,
  dbSetDoc,
  dbUpdateDoc,
} from "@/lib/dbFuntions/fbFuns";
import { useStore } from "@/store/storeInfos";
import { collection, doc, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

type User = whatsappUser;

export default function Component() {
  const { storeId } = useStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["whatsapp-users", storeId],
    queryFn: async () => {
      if (!storeId) return;
      const q = query(
        collection(db, "whatsapp-notifications-users"),
        where("storeId", "==", storeId),
      );
      const response = await dbGetDocs(q, storeId, "");
      return response.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];
    },
  });

  const handleAddUser = (newUser: Omit<User, "id">) => {
    if (!storeId) return;
    const id = Math.random().toString(36).substring(7);

    dbSetDoc(
      doc(db, "whatsapp-notifications-users", storeId + "_" + id),
      {
        ...newUser,
        storeId,
        id,
      },
      storeId,
      "",
    ).then(() => {
      queryClient.setQueryData(["whatsapp-users", storeId], (old: User[]) => [
        ...old,
        { ...newUser, id },
      ]);
    });
  };

  const handleEditUser = (editedUser: User) => {
    if (!storeId) return;
    dbSetDoc(
      doc(db, "whatsapp-notifications-users", storeId + "_" + editedUser.id),
      {
        ...editedUser,
        storeId,
      },
      storeId,
      "",
    ).then(() => {
      queryClient.setQueryData(["whatsapp-users", storeId], (old: User[]) =>
        old.map((user) => (user.id === editedUser.id ? editedUser : user)),
      );
    });
  };

  const handleDelete = (id: string) => {
    if (!storeId) return;
    dbDeleteDoc(
      doc(db, "whatsapp-notifications-users", storeId + "_" + id),
      storeId,
      "",
    ).then(() => {
      queryClient.setQueryData(["whatsapp-users", storeId], (old: User[]) =>
        old.filter((user) => user.id !== id),
      );
    });
  };

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  return (
    <Card className="w-full max-w-5xl  relative">
      <CardHeader>
        <h1 className="text-2xl font-bold mb-4">WhatsApp Configs</h1>
        <p className="text-gray-600 mb-4">
          Configure the WhatsApp notifications for each user , you have Up to 4
          users
        </p>
      </CardHeader>

      <Button
        className="absolute top-4 right-4"
        onClick={() => {
          setEditingUser(null);
          setIsDialogOpen(true);
        }}
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        Add User
      </Button>

      <UserDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={(e) => {
          if (editingUser) {
            handleEditUser(e as User);
          } else {
            handleAddUser(e as Omit<User, "id">);
          }
        }}
        initialData={editingUser}
      />

      <CardContent>
        <div className="space-y-4">
          {data &&
            data.map((user) => (
              <div
                key={user.id}
                className="flex items-start justify-between p-4 bg-slate-50 rounded-lg border"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="border rounded-full p-1">
                      <Avvvatars size={35} style="shape" value={user.name} />
                    </div>
                    <p className="font-bold ">{user.whatsappNumber}</p>
                    <span> | </span>
                    <h3 className="">{user.name}</h3>
                    <div className="flex-1"></div>
                    <Switch
                      className="mr-4"
                      checked={user.active}
                      onCheckedChange={() => {
                        if (!storeId) return;
                        dbUpdateDoc(
                          doc(
                            db,
                            "whatsapp-notifications-users",
                            storeId + "_" + user.id,
                          ),
                          {
                            active: !user.active,
                          },
                          storeId,
                          "",
                        ).then(() => {
                          queryClient.setQueryData(
                            ["whatsapp-users", storeId],
                            (old: User[]) =>
                              old.map((u) =>
                                u.id === user.id
                                  ? { ...u, active: !u.active }
                                  : u,
                              ),
                          );
                        });
                      }}
                    />
                  </div>
                  <Separator className="my-2 w-full border-b" />
                  <h3 className=" py-2 font-bold">Allowed Events</h3>
                  <div className="text-xs text-gray-800 mt-1 flex gap-2">
                    {Object.entries(user.events)
                      .filter(([, value]) => value)
                      .map(([key]) =>
                        key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase()),
                      )
                      .map((event) => (
                        <Badge
                          key={event}
                          variant={"secondary"}
                          className="mr-2 flex gap-2 p-2 border px-3 border-gray-300"
                        >
                          {event}
                          {
                            {
                              "New Order": <StarsIcon className="h-4 w-4" />,
                              "Daily Reports": <ChartBar className="h-4 w-4" />,
                              "Pending Orders Reminders": (
                                <AlarmCheck className="h-4 w-4" />
                              ),
                            }[event]
                          }
                        </Badge>
                      ))}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEditDialog(user)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-gray-600 mt-4 max-w-md">
          You can add up to 4 users to receive WhatsApp notifications , you will
          be cost 1Dh per each 30 messages
        </p>
      </CardFooter>
    </Card>
  );
}
