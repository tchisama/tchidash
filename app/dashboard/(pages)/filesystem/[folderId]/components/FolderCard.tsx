import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { Trash } from "lucide-react";
import Link from "next/link";
import Folder from "@/public/images/svgs/icons/folder.svg";
import { FileSystemItem } from "@/types/filesytem";

export const FolderCard = ({
  item,
  deleteItem,
}: {
  item: FileSystemItem;
  deleteItem: (id: string) => void;
}) => {
  return (
    item.type === "folder" && (
      <Link key={item.id} href={`/dashboard/filesystem/${item.id}`} passHref>
        <Card key={item.id} className="overflow-hidden group relative ">
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
            <Image width={48} height={48} src={Folder} alt="Folder" />
            <span className="text-center text-sm absolute bottom-4">
              {item.name}
            </span>
          </CardContent>
        </Card>
      </Link>
    )
  );
};
