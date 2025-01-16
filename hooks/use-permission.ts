import { hasPermission, Permissions } from "@/lib/permissions/main";
import { useStore } from "@/store/storeInfos";
import { useSession } from "next-auth/react";

export const usePermission = () => {
  const { store } = useStore();
  const { data: session } = useSession();

  // Get the user's roles from the store
  const userRoles =
    store?.employees?.find((employee) => employee.email === session?.user?.email)
      ?.roles || [];

  // Create the user object for permission checking
  const user = {
    id: session?.user?.email ?? "",
    roles: userRoles,
  };

  // Return a function to check permissions
  const checkPermission = (resource: keyof Permissions, action: "view" | "create" | "update" | "delete") => {
    return hasPermission(user, resource, action);
  };

  return checkPermission;
};