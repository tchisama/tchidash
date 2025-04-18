"use client";
import React from "react";
import { SecuritySettings } from "./components/SecuritySettings";
import { Emplyies } from "./components/employies";
import { usePermission } from "@/hooks/use-permission";

function Page() {
  // Check if the user has view permission
  const hasViewPermission = usePermission();

  if (!hasViewPermission("settings_security", "view")) {
    return <div>You dont have permission to view this page</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {hasViewPermission("employees", "view") && <Emplyies />}
      <SecuritySettings />
    </div>
  );
}

export default Page;
