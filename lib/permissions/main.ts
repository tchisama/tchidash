import { Customer } from "@/types/customer";
import { InventoryItemMove } from "@/types/inventory";
import { ContactMessage } from "@/types/messages";
import { Order } from "@/types/order";
import { Product } from "@/types/product";
import { Review } from "@/types/reviews";

export type Permissions = {
  orders: {
    dataType: Order;
    action: "view" | "create" | "update" | "delete";
  };
  products: {
    dataType: Product;
    action: "view" | "create" | "update" | "delete";
  };
  inventory: {
    dataType: InventoryItemMove;
    action: "view" | "create" | "update" | "delete";
  };
  messages: {
    dataType: ContactMessage;
    action: "view" | "create" | "update" | "delete";
  };
  reviews: {
    dataType: Review;
    action: "view" | "create" | "update" | "delete";
  };
  customers: {
    dataType: Customer;
    action: "view" | "create" | "update" | "delete";
  };
  settings: {
    dataType: null;
    action: "view" | "update";
  };
  settings_security: {
    dataType: null;
    action: "view" | "update";
  };
  settings_integrations: {
    dataType: null;
    action: "view" | "update";
  };
  settings_advanced: {
    dataType: null;
    action: "view" | "update";
  };
  notifications: {
    dataType: null;
    action: "view";
  };
  employees: {
    dataType: null;
    action: "view" | "create" | "update" | "delete";
  };
  pos: {
    dataType: null;
    action: "view" | "create" | "update" | "delete";
  };
  landing_page: {
    dataType: null;
    action: "view" | "create" | "update" | "delete";
  };
};

export type Role =
  | "super_admin"
  | "admin"
  | "order_manager"
  | "inventory_manager"
  | "product_manager"
  | "employees_manager"
  | "pos_manager"
  | "marketing_manager";
export const ROLES_NAMES = [
  "super_admin",
  "admin",
  "order_manager",
  "inventory_manager",
  "product_manager",
  "employees_manager",
  "pos_manager",
  "marketing_manager",
] as const;
// make me a enum

type User = {
  id: string;
  roles: Role[];
};
type PermissionCheck<Key extends keyof Permissions> =
  | boolean
  | ((user: User, data: Permissions[Key]["dataType"]) => boolean);

type RolesWithPermissions = {
  [R in Role]: Partial<{
    [Key in keyof Permissions]: Partial<{
      [Action in Permissions[Key]["action"]]: PermissionCheck<Key>;
    }>;
  }>;
};

const ROLES: RolesWithPermissions = {
  super_admin: {
    orders: { view: true, create: true, update: true, delete: true },
    products: { view: true, create: true, update: true, delete: true },
    inventory: { view: true, create: true, update: true, delete: true },
    messages: { view: true, create: true, update: true, delete: true },
    reviews: { view: true, create: true, update: true, delete: true },
    customers: { view: true, create: true, update: true, delete: true },
    settings: { view: true, update: true },
    settings_security: { view: true, update: true },
    employees: { view: true, create: true, update: true, delete: true },
    settings_integrations: { view: true, update: true },
    settings_advanced: { view: true, update: true },
    notifications: { view: true },
    pos: { view: true, create: true, update: true, delete: true },
    landing_page: { view: true, create: true, update: true, delete: true },
  },
  admin: {
    orders: { view: true, create: true, update: true, delete: true },
    products: { view: true, create: true, update: true, delete: true },
    inventory: { view: true, create: true, update: true, delete: true },
    messages: { view: true, create: true, update: true, delete: true },
    reviews: { view: true, create: true, update: true, delete: true },
    customers: { view: true, create: true, update: true, delete: true },
    settings: { view: true, update: true },
    notifications: { view: true },
    settings_security: { view: true, update: true },
    pos: { view: true, create: true, update: true, delete: false },
    landing_page: { view: true, create: true, update: true, delete: false },
  },
  order_manager: {
    orders: { view: true, create: true, update: true, delete: false },
    notifications: { view: true },
  },
  product_manager: {
    products: { view: true, create: true, update: true, delete: false },
    notifications: { view: true },
  },
  inventory_manager: {
    inventory: { view: true, create: true, update: true, delete: false },
    notifications: { view: true },
  },
  employees_manager: {
    employees: { view: true, create: true, update: true, delete: true },
    notifications: { view: true },
  },
  pos_manager: {
    pos: { view: true, create: true, update: true, delete: false },
    orders: { view: true, create: true, update: true, delete: false },
    products: { view: true },
    inventory: { view: true, create: true, update: true, delete: false },
    notifications: { view: true },
  },
  marketing_manager: {
    landing_page: { view: true, create: true, update: true, delete: true },
    products: { view: true },
    notifications: { view: true },
  },
};

export function hasPermission<Resource extends keyof Permissions>(
  user: User,
  resource: Resource,
  action: Permissions[Resource]["action"],
  data?: Permissions[Resource]["dataType"],
) {
  return user.roles.some((role) => {
    const permission = (ROLES as RolesWithPermissions)[role][resource]?.[
      action
    ];
    if (permission == null) return false;

    if (typeof permission === "boolean") return permission;
    return data != null && permission(user, data);
  });
}
