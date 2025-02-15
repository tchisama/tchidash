import { useStore } from "@/store/storeInfos";

/**
 * Custom hook to fetch multiple integrations by their names.
 * @param names - An array of integration names to retrieve.
 * @returns An object containing the requested integrations.
 */
export const useIntegrations = () => {
  const { store } = useStore();

  return function getIntegration(name: "digylog" | "whatsapp") {
    if (!store) return undefined;
    if (!store.integrations) return undefined;
    return store?.integrations.find((integration) => integration.name === name);
  };
};
