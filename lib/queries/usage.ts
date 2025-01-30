// Function to auto-upload usage with minimal input
export const trackUserUsage = async ({}: {
  userEmail: string;
  storeId: string;
  action: "upload" | "download" | "delete";
  data: unknown;
  clctn: string;
  endpoint: string;
}): Promise<void> => {
  return;
};
