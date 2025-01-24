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
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { v4 } from "uuid";
import { dbGetDoc, dbUpdateDoc } from "@/lib/dbFuntions/fbFuns";
import Avvvatars from "avvvatars-react";
import { Role, ROLES_NAMES } from "@/lib/permissions/main";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";


const Emplyies = () => {
  const { storeId } = useStore();
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
    roles: [],
  });
  const [showForm, setShowForm] = useState(false); // State to toggle form visibility

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
      });
      setShowForm(false); // Hide the form after saving
    });
  };

  const handleDeleteEmployee = (employeeId: string) => {
    if (!storeId || !store) return;
    let updatedEmployees;
    if (store.employees) {
      updatedEmployees = store.employees.filter(
        (employee) => employee.id !== employeeId,
      );
      dbUpdateDoc(
        doc(db, "stores", storeId),
        {
          employees: updatedEmployees,
          employeesEmails: updatedEmployees.map((employee) => employee.email),
        },
        storeId,
        "",
      );
    }
  };

  return (
    store && (
      <Card >
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
                  {ROLES_NAMES.map((role) => (
                    <Button
                      onClick={() => {
                        setNewEmployee((prev) => ({
                          ...prev,
                          roles: prev.roles.includes(role)
                            ? prev.roles.filter((r) => r !== role) // Remove role if already selected
                            : [...prev.roles, role], // Add role if not selected
                        }));
                      }}
                      variant="ghost"
                      key={role}
                      className="w-full flex justify-between"
                    >
                      {role}{" "}
                      <div>{newEmployee.roles.includes(role) && "✔️"} </div>
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
                  <Avvvatars size={40} value={employee.name} style="shape" />
                </div>
                <div className="flex-1">
                  <p>{employee.name}</p>
                  <p>{employee.email}</p>
                </div>
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

  const handleRoleChange = (role: Role) => {
    const newRoles = updatedEmployee?.roles?.includes(role)
      ? updatedEmployee.roles.filter((r) => r !== role) // Remove role
      : [...updatedEmployee.roles, role]; // Add role

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
                setUpdatedEmployee({ ...updatedEmployee, email: e.target.value })
              }
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  {updatedEmployee?.roles?.length > 0
                    ? updatedEmployee?.roles?.map((role) => (
                        <Badge variant={"outline"} key={role} className="mr-1">
                          {role}
                        </Badge>
                      ))
                    : "Select Roles"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-1 flex flex-col">
                {ROLES_NAMES.map((role) => (
                  <Button
                    onClick={() => handleRoleChange(role)}
                    variant="ghost"
                    key={role}
                    className="w-full flex justify-between"
                  >
                    {role}{" "}
                    <div>{updatedEmployee?.roles?.includes(role) && "✔️"} </div>
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

export { UpdateEmployee, Emplyies };
