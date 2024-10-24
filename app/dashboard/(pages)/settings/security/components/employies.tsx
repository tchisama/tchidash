"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { db } from "@/firebase";
import { useStore } from "@/store/storeInfos";
import { Employee, Store } from "@/types/store";
import { useQuery } from "@tanstack/react-query";
import { doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { v4 } from "uuid";
import { useSession } from "next-auth/react";
import { dbGetDoc, dbUpdateDoc } from "@/lib/dbFuntions/fbFuns";

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
  const { data: session } = useSession();
  const { data: store } = useQuery({
    queryKey: ["store", storeId],
    queryFn: async () => {
      if (!storeId) return null;
      const store: Store = await dbGetDoc(doc(db, "stores"), storeId, "").then(
        (doc) => {
          if (!doc) return {} as Store;
          return { ...doc.data(), id: doc.id } as Store;
        },
      );
      return store;
    },
    refetchOnWindowFocus: false,
  });
  const [, setSaved] = useState(false);
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

    dbUpdateDoc(
      doc(db, "stores", storeId),
      {
        employees: [...(store?.employees || []), uploadedEmployee],
        employeesEmails: [
          ...(store?.employeesEmails || []),
          uploadedEmployee.email,
        ],
      },
      storeId,
      "",
    ).then(() => {
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
    store &&
    session &&
    session.user &&
    store.ownerEmail === session.user.email && (
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
          <Separator className="mb-2 mt-4" />
          <div className="p-2  mt-2">
            {store?.employees &&
              store?.employees.map((employee) => (
                <div
                  key={employee.id}
                  className="flex px-4 items-center p-2 border rounded-xl justify-between"
                >
                  <div>
                    <p>{employee.name}</p>
                    <p>{employee.email}</p>
                  </div>
                  <UpdateAccesses employee={employee} store={store} />
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    )
  );
};

const UpdateAccesses = ({
  employee,
  store,
}: {
  employee: Employee;
  store: Store;
}) => {
  const { storeId } = useStore();
  const [newEmployee, setNewEmployee] = useState<Employee>({
    name: "",
    id: "",
    email: "",
    access: {},
  });
  useEffect(() => {
    setNewEmployee(employee);
  }, [employee]);
  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="outline">Access</Button>
      </PopoverTrigger>
      <PopoverContent className="p-1 flex flex-col">
        {accesses.map((access) => (
          <Button
            onClick={() => {
              const updatedEmployee = {
                ...newEmployee,
                access: {
                  ...newEmployee.access,
                  [access.key]: !newEmployee.access[access.key],
                },
              };

              setNewEmployee(updatedEmployee);
              if (!storeId) return;
              if (!store) return;
              if (!store.employees) return;
              dbUpdateDoc(
                doc(db, "stores", storeId),
                {
                  employees: store.employees.map((e) =>
                    e.id === employee.id ? updatedEmployee : e,
                  ),
                },
                storeId,
                "",
              );
            }}
            variant="ghost"
            key={access.key}
            className="w-full flex justify-between"
          >
            {access.name} <div>{newEmployee.access[access.key] && "✔️"} </div>
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  );
};

export { Emplyies };
