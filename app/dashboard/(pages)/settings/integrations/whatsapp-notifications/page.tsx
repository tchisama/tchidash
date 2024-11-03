"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlarmCheck, ChartBar, MoreVertical, StarsIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@radix-ui/react-separator";
import { UserDialog } from "./user-dialog";

interface User {
  id: number;
  name: string;
  whatsappNumber: string;
  events: {
    newOrder: boolean;
    dailyReports: boolean;
    pendingOrdersReminders: boolean;
  };
}

export default function Component() {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "John Doe",
      whatsappNumber: "+1234567890",
      events: {
        newOrder: true,
        dailyReports: false,
        pendingOrdersReminders: true,
      },
    },
    {
      id: 2,
      name: "Jane Smith",
      whatsappNumber: "+0987654321",
      events: {
        newOrder: false,
        dailyReports: true,
        pendingOrdersReminders: false,
      },
    },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleAddUser = (newUser: Omit<User, "id">) => {
    setUsers([...users, { ...newUser, id: users.length + 1 }]);
  };

  const handleEditUser = (editedUser: User) => {
    setUsers(
      users.map((user) => (user.id === editedUser.id ? editedUser : user)),
    );
  };

  const handleDelete = (id: number) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  return (
    <div className="w-full max-w-5xl  ">
      <h1 className="text-2xl font-bold mb-4">WhatsApp Configs</h1>
      <p className="text-gray-600 mb-4">
        Configure the WhatsApp notifications for each user , you have Up to 4
        users
      </p>

      <Button
        className="mb-4"
        onClick={() => {
          setEditingUser(null);
          setIsDialogOpen(true);
        }}
      >
        Add User
      </Button>

      <UserDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={editingUser ? handleEditUser : handleAddUser}
        initialData={editingUser}
      />

      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-start justify-between p-4 bg-white rounded-lg shadow"
          >
            <div className="flex-1">
              <div className="flex gap-2">
                <p className="font-bold ">{user.whatsappNumber}</p>
                <span> | </span>
                <h3 className="">{user.name}</h3>
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
      <p className="text-gray-600 mt-4 max-w-md">
        You can add up to 4 users to receive WhatsApp notifications , you will
        be cost 1Dh per each 30 messages
      </p>
    </div>
  );
}
