import { useStore } from "@/store/storeInfos";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase"; // Adjust path based on your project

// Section and Actions Type Safety
type Section = keyof typeof sectionActions;

type SectionActions = {
  [K in Section]: (typeof sectionActions)[K][number];
};

type RuleSection<S extends Section = Section> = {
  section: S;
  actions: SectionActions[S][];
};

export type Rule = {
  id: string;
  name: string;
  sections: RuleSection[];
  storeId: string;
};

export type actions = "view" | "create" | "update" | "delete" | "change state";

// Predefined Section Actions Map
export const sectionActions = {
  orders: ["view", "update", "change state", "delete", "create"],
  products: ["view", "create", "update", "delete"],
  analytics: ["view"],
  inventory: ["view", "update", "create", "delete"],
  customers: ["view", "update", "delete"],
  messages: ["view", "create", "delete", "update"],
  reviews: ["view", "create", "delete", "update"],
  settings: ["update", "view"],
  settings_security: ["update", "view"],
  settings_integrations: ["update", "view"],
  settings_advanced: ["update", "view"],
  notifications: ["view"],
  employees: ["view", "create", "update", "delete"],
  pos: ["view", "create", "update", "delete"],
  landing_page: ["view", "create", "update", "delete"],
};

export const usePermission = () => {
  const { storeId, store } = useStore();
  const { data: session } = useSession();

  // Fetch Rules from Firestore
  const { data: rules = [] } = useQuery({
    queryKey: ["rules", storeId],
    queryFn: async () => {
      if (!storeId) return [];
      try {
        const snapshot = await getDocs(
          query(collection(db, "rules"), where("storeId", "==", storeId)),
        );
        return snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Rule[];
      } catch (error) {
        console.error("Error fetching rules:", error);
        return [];
      }
    },
    enabled: !!storeId,
  });

  const employee = store?.employees?.find(
    (employee) => employee.email === session?.user?.email,
  );

  if (employee?.email === store?.ownerEmail) {
    return () => true;
  }
  if (employee?.active === false) {
    return () => false;
  }

  // Get user's assigned rules based on email
  const userRules = rules.filter((rule) => employee?.roles.includes(rule.id));

  // Check permission function
  const checkPermission = (
    resource: Section,
    action: SectionActions[Section],
  ) => {
    if (session?.user?.email === store?.ownerEmail) return true;
    return userRules.some((rule) =>
      rule.sections.some(
        (section) =>
          section.section === resource && section.actions.includes(action),
      ),
    );
  };

  return checkPermission;
};
