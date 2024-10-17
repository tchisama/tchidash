"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { db } from "@/firebase";
import { useStore } from "@/store/storeInfos";
import { Employee, Store } from "@/types/store";
import { useQuery } from "@tanstack/react-query";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { v4 } from "uuid";

const accesses = [
  {
    name: "Dashboard",
    key: "dashboard",
  },
  {
    name: "Orders",
    key: "orders",
  },
  {
    name: "Products",
    key: "products",
  },
  {
    name: "Customers",
    key: "customers",
  },
  {
    name: "Reviews",
    key: "reviews",
  },
  {
    name: "Analytics",
    key: "analytics",
  },
  {
    name: "Contacts",
    key: "contacts",
  },
  {
    name: "Settings",
    key: "settings",
  },
];

const Emplyies = () => {
  const { storeId } = useStore();
  const { data: store } = useQuery({
    queryKey: ["store", storeId],
    queryFn: async () => {
      if (!storeId) return null;
      const store: Store = await getDoc(doc(db, "stores", storeId)).then(
        (doc) => {
          return { ...doc.data(), id: doc.id } as Store;
        },
      );
      return store;
    },
    refetchOnWindowFocus: false,
  });
  const [saved, setSaved] = useState(false);
  const [newEmployee, setNewEmployee] = useState<Employee>({
    name: "",
    id: "",
    email: "",
    access: {},
  });

  useEffect(() => {
    if (!store) return;
    if (!store?.apiKeys) return;
  }, [store]);

  const handleSave = () => {
    if (!storeId) return;
    if (!newEmployee.name) return;
    if (!newEmployee.email) return;
    const uploadedEmployee = {
      ...newEmployee,
      id: v4(),
    };

    updateDoc(doc(db, "stores", storeId), {
      employees: [...(store?.employees || []), uploadedEmployee],
      employeesEmails: [
        ...(store?.employeesEmails || []),
        uploadedEmployee.email,
      ],
    } as Store).then(() => {
      setSaved(true);
      setNewEmployee({
        name: "",
        id: "",
        email: "",
        access: {},
      });
    });
  };

  useEffect(() => {
    if (!store) return;
    if (!store.settings) return;
    setSaved(false);
  }, [setSaved, store]);

  return (
    <Card x-chunk="dashboard-04-chunk-1">
      <CardHeader>
        <CardTitle>Emploies</CardTitle>
        <CardDescription>
          Manage your store&apos;s security settings here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-4 flex flex-col items-start gap-2 border bg-slate-100 rounded-xl">
          <Input
            value={newEmployee.name}
            placeholder="Name"
            className="bg-white"
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, name: e.target.value })
            }
          />
          <Input
            value={newEmployee.email}
            placeholder="Email"
            className="bg-white"
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, email: e.target.value })
            }
          />
          <Popover>
            <PopoverTrigger>
              <div className="w-[400px] flex justify-start">
                <Button variant="outline" className="space-y-1 space-x-1">
                  {Object.keys(newEmployee.access).filter(
                    (key) => newEmployee.access[key],
                  ).length > 0
                    ? Object.keys(newEmployee.access)
                        .filter((key) => newEmployee.access[key])
                        .map((a) => (
                          <Badge variant={"outline"} key={a}>
                            {a}
                          </Badge>
                        ))
                    : "Select Access"}
                </Button>
              </div>
            </PopoverTrigger>
            <PopoverContent className="p-1 flex flex-col">
              {accesses.map((access) => (
                <Button
                  onClick={() => {
                    setNewEmployee({
                      ...newEmployee,
                      access: {
                        ...newEmployee.access,
                        [access.key]: !newEmployee.access[access.key],
                      },
                    });
                  }}
                  variant="ghost"
                  key={access.key}
                  className="w-full flex justify-between"
                >
                  {access.name}{" "}
                  <div>{newEmployee.access[access.key] && "✔️"} </div>
                </Button>
              ))}
            </PopoverContent>
          </Popover>
          <Button
            onClick={() => {
              handleSave();
            }}
          >
            Add Employee
          </Button>
        </div>
        <Separator />
        <div className="p-2 mt-2">
          {store?.employees &&
            store?.employees.map((employee) => (
              <div
                key={employee.id}
                className="flex items-center justify-between"
              >
                <div>
                  <p>{employee.email}</p>
                </div>
                <Button variant="outline" className="text-sm">
                  Remove
                </Button>
              </div>
            ))}
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button onClick={handleSave}>
          {!saved ? "Save" : "Saved"}
          {saved && <CheckCircle className="ml-2 h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  );
};

export { Emplyies };
