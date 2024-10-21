import React, { useEffect } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRightIcon } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { FolderType } from "@/types/filesytem";

function BreadcrumbCom() {
  const pathname = usePathname();
  const [path, setPath] = React.useState<{ name: string; href: string }[]>([]);
  useEffect(() => {
    setPath(
      pathname?.split("/").map((item, index) => ({
        name:
          pathname.split("/")[index - 1] == "filesystem" ? "... loading" : item,
        href: item,
      })),
    );
  }, [pathname]);
  useEffect(() => {
    if (path.length > 3 && path[2].href === "filesystem") {
      getDoc(doc(db, "filesystem", path[3].href)).then((doc) => {
        const folder = { ...doc.data(), id: doc.id } as FolderType;
        if (!folder) return;
        setPath((p) =>
          p.map((item) => {
            if (item.href === folder.id) {
              return {
                name: folder.name,
                href: item.href,
              };
            }
            return item;
          }),
        );
      });
    }
  }, [path]);
  return (
    <Breadcrumb className="hidden md:flex ">
      <BreadcrumbList>
        {path?.map((item, index) => (
          <>
            <BreadcrumbItem key={index}>
              <BreadcrumbLink asChild>
                <Link
                  className=""
                  href={`${path
                    .slice(0, index + 1)
                    .map((item) => item.href)
                    .join("/")}`}
                >
                  {item.name}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {index < path.length - 1 && index !== 0 && (
              <BreadcrumbSeparator key={index}>
                <ChevronRightIcon size={28} />
              </BreadcrumbSeparator>
            )}
          </>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default BreadcrumbCom;

