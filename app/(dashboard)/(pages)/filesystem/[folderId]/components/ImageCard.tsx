import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { FileSystemItem } from "@/types/filesytem";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
} from "firebase/storage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { doc } from "firebase/firestore";
import { db } from "@/firebase";
import { useQueryClient } from "@tanstack/react-query";
import { dbDeleteDoc } from "@/lib/dbFuntions/fbFuns";
import { useStore } from "@/store/storeInfos";

const storage = getStorage();

export const ImageCard = ({ item }: { item: FileSystemItem }) => {
  const { storeId } = useStore();
  const queryClient = useQueryClient();
  const deleteImage = () => {
    if (item.type === "folder") return;
    const ImageRef = ref(storage, item.storagePath);
    deleteObject(ImageRef)
      .then(() => {
        if (!storeId) return;
        dbDeleteDoc(doc(db, "filesystem", item.id), storeId, "");
        queryClient.setQueryData(
          ["filesystem", item.storeId, item.parentFolderId],
          (oldData: FileSystemItem[] | undefined) => {
            if (!oldData) return;
            return oldData.filter((i) => i.id !== item.id);
          },
        );
      })
      .catch((error) => {
        console.error("Error removing image: ", error);
      });
  };
  const downloadImage = () => {
    if (item.type === "folder") return;

    const imageRef = ref(storage, item.storagePath);

    getDownloadURL(imageRef)
      .then((url) => {
        // Create an anchor element to trigger the download
        window.open(url, "_blank");
      })
      .catch((error) => {
        console.error("Error downloading image: ", error);
      });
  };

  return (
    item.type === "image" && (
      <Popover>
        <PopoverTrigger className=" p-0">
          <Card key={item.id} className="overflow-hidden">
            <CardContent className="flex w-full flex-col gap-4 aspect-square relative items-center justify-center p-0">
              <Image
                key={item.id}
                width={300}
                height={300}
                src={item.url}
                alt={item.name}
                className="w-full h-full object-cover"
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
                      deleteImage();
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
                      downloadImage();
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
        </PopoverTrigger>
        <PopoverContent className="h-fit w-[300px] flex flex-col gap-1 z-10">
          <p className="flex justify-between">
            Size: <strong className="text-sm">{item.size.toFixed(2)} MB</strong>
          </p>
          <p className="flex justify-between ">
            Dimensions:{" "}
            <span className="text-sm">
              {item.width} x {item.height}
            </span>
          </p>
          <p className="flex justify-between">
            Created at:{" "}
            <div className="flex items-end flex-col">
              <span className="text-sm">
                {item.createdAt.toDate().toLocaleDateString()}
              </span>
            </div>
          </p>
        </PopoverContent>
      </Popover>
    )
  );
};
