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
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { v4 } from "uuid";
import { dbUpdateDoc } from "@/lib/dbFuntions/fbFuns";
import Avvvatars from "avvvatars-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import UploadImageProvider from "@/components/UploadImageProvider";
import { Upload } from "lucide-react";
import { Rule } from "@/hooks/use-permission";
import { Switch } from "@/components/ui/switch";

const Emplyies = () => {
  const { storeId, store, setStore } = useStore();
  const [, setSaved] = useState(false);
  const [newEmployee, setNewEmployee] = useState<Employee>({
    name: "",
    id: "",
    email: "",
    roles: [],
    imageUrl: "", // Initialize imageUrl
  });
  const [showForm, setShowForm] = useState(false);

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
        roles: [],
        imageUrl: "", // Reset imageUrl
      });
      setShowForm(false);
    });
  };

  const handleDeleteEmployee = (employeeId: string) => {
    if (!storeId) return;
    dbUpdateDoc(
      doc(db, "stores", storeId),
      {
        employees: (store?.employees || []).filter(
          (employee) => employee.id !== employeeId,
        ),
        employeesEmails: (store?.employeesEmails || []).filter(
          (email) => email !== employeeId,
        ),
      },
      storeId,
      "",
    );
  };

  const { data: rules = [] } = useQuery({
    queryKey: ["rules", storeId],
    queryFn: async () => {
      if (!storeId) return [];
      try {
        const snapshot = await getDocs(
          query(collection(db, "rules"), where("storeId", "==", storeId)),
        );
        return snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Rule[];
      } catch (error) {
        console.error("Error fetching rules:", error);
        return [];
      }
    },
    enabled: !!storeId,
  });

  return (
    store && (
      <Card>
        <CardHeader>
          <CardTitle>Employees</CardTitle>
          <CardDescription>
            Manage your store&apos;s employees and their roles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Add Employee Button */}
          <Button onClick={() => setShowForm(!showForm)} className="mb-4">
            {showForm ? "Cancel" : "Add Employee"}
          </Button>

          {/* Add Employee Form (Conditionally Rendered) */}
          {showForm && (
            <div className="p-4 flex flex-col items-start gap-2 border bg-slate-100 rounded-xl mb-4">
              {/* Image Upload */}
              <div className="flex gap-2 items-center flex-row-reverse">
                <UploadImageProvider
                  name={newEmployee.name || "employee"}
                  folder={storeId ?? ""}
                  callback={(url) => {
                    setNewEmployee((prev) => ({ ...prev, imageUrl: url }));
                  }}
                >
                  <div className="h-10 w-10 border rounded-md bg-white flex items-center justify-center">
                    <Upload className="h-4 w-4" />
                  </div>
                </UploadImageProvider>
                {newEmployee.imageUrl && (
                  <img
                    src={newEmployee.imageUrl}
                    alt="Employee"
                    className="w-16 h-16 rounded-2xl"
                  />
                )}
              </div>
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
              {/* Role Selection */}
              <Popover>
                <PopoverTrigger>
                  <div className="w-[400px] flex justify-start">
                    <Button variant="outline" className="space-y-1 space-x-1">
                      {newEmployee.roles.length > 0
                        ? newEmployee.roles.map((role) => (
                            <Badge variant={"outline"} key={role}>
                              {role}
                            </Badge>
                          ))
                        : "Select Roles"}
                    </Button>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="p-1 flex relative z-10 flex-col">
                  {rules.map((role) => (
                    <Button
                      onClick={() => {
                        setNewEmployee((prev) => ({
                          ...prev,
                          roles: prev.roles.includes(role.id)
                            ? prev.roles.filter((r) => r !== role.id)
                            : [...prev.roles, role.id],
                        }));
                      }}
                      variant="ghost"
                      key={role.id}
                      className="w-full flex justify-between"
                    >
                      {role.name}{" "}
                      <div>{newEmployee.roles.includes(role.id) && "✔️"} </div>
                    </Button>
                  ))}
                </PopoverContent>
              </Popover>
              <Button onClick={handleSave}>Save Employee</Button>
            </div>
          )}

          <Separator className="mb-2 mt-4" />

          {/* Employee List */}
          <div className="p-2 mt-2 space-y-2">
            {store?.employees?.map((employee) => (
              <div
                key={employee.id}
                className="flex px-4 gap-4 items-center p-2 border rounded-xl"
              >
                <div>
                  {employee.imageUrl ? (
                    <img
                      src={employee.imageUrl}
                      alt={employee.name}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <Avvvatars size={40} value={employee.name} style="shape" />
                  )}
                </div>
                <div className="flex-1">
                  <p>{employee.name}</p>
                  <p>{employee.email}</p>
                </div>
                <Switch
                  checked={employee.active}
                  onCheckedChange={(v) => {
                    if (!storeId) return;
                    setStore({
                      ...store,
                      employees: store?.employees?.map((e) =>
                        e.id === employee.id ? { ...e, active: v } : e,
                      ),
                    });

                    dbUpdateDoc(
                      doc(db, "stores", storeId),
                      {
                        employees: store?.employees?.map((e) =>
                          e.id === employee.id ? { ...e, active: v } : e,
                        ),
                      },
                      storeId,
                      "",
                    );
                  }}
                />
                <UpdateEmployee
                  employee={employee}
                  store={store}
                  onDelete={() => handleDeleteEmployee(employee.id)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  );
};

const UpdateEmployee = ({
  employee,
  store,
  onDelete,
}: {
  employee: Employee;
  store: Store;
  onDelete: () => void;
}) => {
  const { storeId } = useStore();
  const [updatedEmployee, setUpdatedEmployee] = useState<Employee>(employee);

  const handleRoleChange = (role: string) => {
    const newRoles = updatedEmployee?.roles?.includes(role)
      ? updatedEmployee.roles.filter((r) => r !== role)
      : [...updatedEmployee.roles, role];
    setUpdatedEmployee((prev) => ({ ...prev, roles: newRoles }));
  };

  const handleSave = () => {
    if (!storeId || !store || !store.employees) return;

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
  };

  const { data: rules = [] } = useQuery({
    queryKey: ["rules", storeId],
    queryFn: async () => {
      if (!storeId) return [];
      try {
        const snapshot = await getDocs(
          query(collection(db, "rules"), where("storeId", "==", storeId)),
        );
        return snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Rule[];
      } catch (error) {
        console.error("Error fetching rules:", error);
        return [];
      }
    },
    enabled: !!storeId,
  });

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Update</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Employee</DialogTitle>
            <DialogDescription>
              Edit the employees details and roles.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2 justify-start ">
              {updatedEmployee.imageUrl && (
                <img
                  src={updatedEmployee.imageUrl}
                  alt="Employee"
                  className="w-16 h-16 rounded-2xl"
                />
              )}
              <UploadImageProvider
                name={updatedEmployee.name || "employee"}
                folder={storeId ?? ""}
                callback={(url) => {
                  setUpdatedEmployee((prev) => ({ ...prev, imageUrl: url }));
                }}
              >
                <div className="h-10 w-10 border rounded-md bg-white flex items-center justify-center">
                  <Upload className="h-4 w-4" />
                </div>
              </UploadImageProvider>
            </div>
            <Input
              value={updatedEmployee.name}
              placeholder="Name"
              onChange={(e) =>
                setUpdatedEmployee({ ...updatedEmployee, name: e.target.value })
              }
            />
            <Input
              value={updatedEmployee.email}
              placeholder="Email"
              onChange={(e) =>
                setUpdatedEmployee({
                  ...updatedEmployee,
                  email: e.target.value,
                })
              }
            />
            {/* Image Upload */}
            {/* Role Selection */}
            <Button
              onClick={() =>
                setUpdatedEmployee((prev) => ({ ...prev, roles: [] }))
              }
            >
              Clean Roles
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  {updatedEmployee?.roles?.length > 0
                    ? updatedEmployee?.roles?.map((role) => (
                        <Badge variant={"outline"} key={role} className="mr-1">
                          {rules.find((r) => r.id === role)?.name}
                        </Badge>
                      ))
                    : "Select Roles"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-1 flex flex-col">
                {rules.map((role) => (
                  <Button
                    onClick={() => handleRoleChange(role.id)}
                    variant="ghost"
                    key={role.id}
                    className="w-full flex justify-between"
                  >
                    {role.name}{" "}
                    <div>
                      {updatedEmployee?.roles?.includes(role.id) && "✔️"}{" "}
                    </div>
                  </Button>
                ))}
              </PopoverContent>
            </Popover>
            <div className="flex gap-2">
              <DialogClose>
                <Button onClick={handleSave}>Save</Button>
              </DialogClose>
              <DialogClose>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Button variant="destructive" onClick={onDelete}>
        Delete
      </Button>
    </>
  );
};

export { Emplyies };

