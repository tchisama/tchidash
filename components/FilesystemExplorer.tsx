import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "./ui/button";
import { useState } from "react";
import { FileSystemItem, FolderType, ImageItemType } from "@/types/filesytem";
import { collection, getDocs, orderBy, query, where, Timestamp, doc } from "firebase/firestore";
import { db } from "@/firebase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useStore } from "@/store/storeInfos";
import Folder from "@/public/images/svgs/icons/folder.svg";
import { Upload, FolderPlus } from "lucide-react";
import { v4 } from "uuid";
import UploadImageProvider from "@/components/UploadImageProvider";
import { dbAddDoc, dbDeleteDoc } from "@/lib/dbFuntions/fbFuns";

import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { ArrowLeft, Download, Trash } from "lucide-react";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";

export default function FilesystemExplorer({
  callback,
  children,
}: {
  callback: (url: string) => void;
  children: React.ReactNode;
}) {
  const [currentFolder, setCurrentFolder] = useState<string>("/");
  const [parentFolder, setParentFolder] = useState<string>("/");
  const { storeId } = useStore();
  const [selectedItem, setSelectedItem] = useState<FileSystemItem | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [imageName, setImageName] = useState(v4());
  const queryClient = useQueryClient();

  const {
    data: items,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["filesystem", storeId, currentFolder ?? "/"],
    queryFn: async () => {
      const q = query(
        collection(db, "filesystem"),
        where("storeId", "==", storeId),
        where("parentFolderId", "==", currentFolder ?? "/"),
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
      parentFolderId: currentFolder ?? "/",
      storeId,
      id: "", // The id will be set by Firestore
      path: "/",
      folderType: "regular",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      tags: [],
      type: "folder",
    };

    const docRef = await dbAddDoc(
      collection(db, "filesystem"),
      newFolder,
      storeId,
      "",
    );
    const addedFolder = { ...newFolder, id: docRef.id };

    queryClient.setQueryData(
      ["filesystem", storeId, currentFolder],
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
      name: imageName,
      parentFolderId: currentFolder ?? "/",
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

    const docRef = await dbAddDoc(
      collection(db, "filesystem"),
      newImage,
      storeId,
      "",
    );
    const addedImage = { ...newImage, id: docRef.id };

    queryClient.setQueryData(
      ["filesystem", storeId, currentFolder],
      (oldData: FileSystemItem[] | undefined) => {
        if (!oldData) return [addedImage];
        return [...oldData, addedImage];
      },
    );
    setImageName(v4());
  };

  const deleteItem = (id: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      if (!storeId) return;
      dbDeleteDoc(doc(db, "filesystem", id), storeId, "");
      queryClient.setQueryData(
        ["filesystem", storeId, currentFolder],
        (oldData: FileSystemItem[] | undefined) => {
          if (!oldData) return [];
          return oldData.filter((item) => item.id !== id);
        },
      );
    }
  };

  if (error) return <p>Error loading data.</p>;

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild className="cursor-pointer">
          {children}
        </AlertDialogTrigger>
        <AlertDialogContent className="min-w-[80vw] min-h-[80vh] flex flex-col">
          <AlertDialogHeader>
            <AlertDialogTitle>Filesystem Explorer</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="flex justify-between items-center">
            {currentFolder !== "/" && (
              <div className="">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setCurrentFolder(parentFolder);
                  }}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
              </div>
            )}
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
                name={imageName}
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
            </div>
          </div>
          <Separator className={"w-full mb-2"} />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7">
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              items?.map((item) =>
                item.type === "image" ? (
                  <Card
                    onClick={() => {
                      if (selectedItem?.id === item.id) {
                        setSelectedItem(null);
                      } else {
                        setSelectedItem(item);
                      }
                    }}
                    key={item.id}
                    className={cn(
                      "overflow-hidden cursor-pointer duration-200 group relative",
                      selectedItem?.id === item.id
                        ? "border-2 border-primary p-1"
                        : "",
                    )}
                  >
                    <CardContent className="flex flex-col gap-4 aspect-square relative items-center justify-center p-0">
                      <Image
                        key={item.id}
                        width={300}
                        height={300}
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-sm"
                      />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            className="absolute right-2 top-2"
                            size={"icon"}
                            variant={"outline"}
                          >
                            <DotsVerticalIcon />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              deleteItem(item.id);
                            }}
                            className="flex gap-2"
                          >
                            <Trash className=" h-4 w-4 " />
                            Delete
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            className="flex gap-2"
                          >
                            <Download className="h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardContent>
                  </Card>
                ) : (
                  <Card
                    draggable={true}
                    onClick={() => {
                      setCurrentFolder(item.id);
                      setParentFolder(
                        items.find((i) => i.id === item.id)?.parentFolderId ??
                          "/",
                      );
                    }}
                    key={item.id}
                    className="overflow-hidden shadow-none bg-slate-50 hover:bg-slate-100 cursor-pointer group relative "
                  >
                    <CardContent className="flex flex-col gap-4 aspect-square relative items-center justify-center p-0">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            className="absolute right-2 top-2"
                            size={"icon"}
                            variant={"outline"}
                          >
                            <DotsVerticalIcon />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            className="flex gap-2"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              deleteItem(item.id);
                            }}
                          >
                            <Trash className=" h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Image
                        draggable={false}
                        width={48}
                        height={48}
                        src={Folder}
                        alt="Folder"
                      />
                      <span className="text-center text-sm absolute bottom-4">
                        {item.name}
                      </span>
                    </CardContent>
                  </Card>
                ),
              )
            )}
          </div>
          <AlertDialogFooter className="mt-auto">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={!selectedItem}
              onClick={() => {
                if (selectedItem) {
                  if (selectedItem.type === "image") {
                    callback(selectedItem.url);
                  }
                }
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}