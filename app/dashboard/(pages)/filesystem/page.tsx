"use client"
import React from "react";
import FilesystemInterface from "./[folderId]/components/foldersCard";
import { usePermission } from "@/hooks/use-permission";

function Page() {
  // Check if the user has view permission
  const hasViewPermission = usePermission();

   if (!hasViewPermission("customers", "view")) {
    return <div>You dont have permission to view this page</div>;
  }
  return (
    <div>
      <FilesystemInterface folderId={"/"} />
    </div>
  );
}

export default Page;
