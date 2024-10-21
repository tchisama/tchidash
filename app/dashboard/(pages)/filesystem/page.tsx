import React from "react";
import FilesystemInterface from "./[folderId]/components/foldersCard";

function page() {
  return (
    <div>
      <FilesystemInterface folderId={"/"} />
    </div>
  );
}

export default page;
