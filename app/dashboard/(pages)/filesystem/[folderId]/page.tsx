import React from "react";
import FilesystemInterface from "./components/foldersCard";

function page({ params }: { params: { folderId: string } }) {
  return (
    <div>
      <FilesystemInterface folderId={params.folderId ?? "/"} />
    </div>
  );
}

export default page;
