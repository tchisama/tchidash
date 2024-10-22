"use client";
import * as React from "react";
import { Upload, FolderPlus } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useStore } from "@/store/storeInfos";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "@/firebase";
import { FileSystemItem, FolderType, ImageItemType } from "@/types/filesytem";
import UploadImageProvider from "@/components/UploadImageProvider";
import { v4 } from "uuid";
import { ImageCard } from "./ImageCard";
import { FolderCard } from "./FolderCard";
import FilesystemExplorer from "@/components/FilesystemExplorer";

export default function FilesystemInterface({
  folderId,
}: {
  folderId: string;
}) {
  const [newFolderName, setNewFolderName] = React.useState("");
  const { storeId } = useStore();
  const queryClient = useQueryClient();
  const { data: items, error } = useQuery({
    queryKey: ["filesystem", storeId, folderId],
    queryFn: async () => {
      const q = query(
        collection(db, "filesystem"),
        where("storeId", "==", storeId),
        where("parentFolderId", "==", folderId ?? "/"),
        orderBy("createdAt"),
      );
      const snapshot = await getDocs(q);
      const data: FileSystemItem[] = [];
      snapshot.forEach((doc) => {
        data.push({ ...(doc.data() as FileSystemItem), id: doc.id });
      });
      return data;
    },
  });

  const createFolder = async () => {
    if (!newFolderName || !storeId) return;

    const newFolder: FolderType = {
      name: newFolderName,
      parentFolderId: folderId ?? "/",
      storeId,
      id: "", // The id will be set by Firestore
      path: "/",
      folderType: "regular",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      tags: [],
      type: "folder",
    };

    const docRef = await addDoc(collection(db, "filesystem"), newFolder);
    const addedFolder = { ...newFolder, id: docRef.id };

    queryClient.setQueryData(
      ["filesystem", storeId, folderId],
      (oldData: FileSystemItem[] | undefined) => {
        if (!oldData) return [addedFolder];
        return [...oldData, addedFolder];
      },
    );

    setNewFolderName("");
  };

  const createImage = async (
    url: string,
    size: number,
    width: number,
    height: number,
    format: "jpg" | "png" | "gif" | "webp",
    path: string,
  ) => {
    if (!storeId) return;
    const newImage: ImageItemType = {
      name: ImageName,
      parentFolderId: folderId ?? "/",
      storeId,
      id: "",
      storagePath: path,
      url,
      size: size,
      format,
      width,
      height,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      type: "image",
    };

    const docRef = await addDoc(collection(db, "filesystem"), newImage);
    const addedImage = { ...newImage, id: docRef.id };

    queryClient.setQueryData(
      ["filesystem", storeId, folderId],
      (oldData: FileSystemItem[] | undefined) => {
        if (!oldData) return [addedImage];
        return [...oldData, addedImage];
      },
    );
    setImageName(v4());
  };

  const [ImageName, setImageName] = React.useState(v4());

  const deleteItem = (id: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      deleteDoc(doc(db, "filesystem", id));
      queryClient.setQueryData(
        ["filesystem", storeId, folderId],
        (oldData: FileSystemItem[] | undefined) => {
          if (!oldData) return [];
          return oldData.filter((item) => item.id !== id);
        },
      );
    }
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex justify-between">
        <div className="ml-auto flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"outline"}>
                <FolderPlus className="mr-2 h-4 w-4" /> Create Folder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
              </DialogHeader>
              <Input
                placeholder="Folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    variant={"outline"}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setNewFolderName("");
                    }}
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button onClick={createFolder}>Create</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <UploadImageProvider
            name={ImageName}
            folder={storeId ?? ""}
            callback={(url, size, width, height, format, path) => {
              createImage(
                url,
                size,
                width,
                height,
                format as "jpg" | "png" | "gif" | "webp",
                path,
              );
            }}
          >
            <span className={buttonVariants({ variant: "default" })}>
              <Upload className="mr-2 h-4 w-4" /> Upload Image
            </span>
          </UploadImageProvider>
          <FilesystemExplorer />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7">
        {items &&
          items.map((item) =>
            item.type === "folder" ? (
              <FolderCard key={item.id} item={item} deleteItem={deleteItem} />
            ) : (
              <ImageCard key={item.id} item={item} />
            ),
          )}
      </div>
    </div>
  );
}
