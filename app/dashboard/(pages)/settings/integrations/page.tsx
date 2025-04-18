"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useStore } from "@/store/storeInfos";
import { dbUpdateDoc } from "@/lib/dbFuntions/fbFuns";
import { doc } from "firebase/firestore";
import { db } from "@/firebase";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Store } from "@/types/store";
import { usePermission } from "@/hooks/use-permission";

// Define the structure of an integration
interface Integration {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

// Sample data for integrations
const integrations: Integration[] = [
  {
    id: "digylog",
    title: "DigyLog",
    description: "DigyLog is a Moroccan Shipping Provider",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/tchidash-fd7aa.appspot.com/o/294424033_375002151434645_2765565352434267578_n%201.png?alt=media&token=99502b5f-b5c9-4ba0-acf5-a810eb4e3a34",
  },
  {
    id: "pos",
    title: "POS",
    description: "Point of Sale integration for managing in-store sales",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/tchidash-fd7aa.appspot.com/o/pos-icon.png?alt=media&token=pos-token",
  },
  {
    id: "landing-page-builder",
    title: "Landing Page Builder",
    description: "Create beautiful landing pages for your products and campaigns",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/tchidash-fd7aa.appspot.com/o/landing-page-icon.png?alt=media&token=landing-page-token",
  },
  {
    id: "whatsapp-notification",
    title: "WhatsApp Notification",
    description: "receive notifications on WhatsApp on sertain events",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/tchidash-fd7aa.appspot.com/o/whatsapp-logo-whatsapp-logo-transparent-whatsapp-icon-transparent-free-free-png.webp?alt=media&token=38019c55-c90f-42ba-8d26-3bc025a758a4",
  },
  {
    id: "whatsapp",
    title: "WhatsApp",
    description: "Send messages to customers on WhatsApp",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/tchidash-fd7aa.appspot.com/o/whatsapp-logo-whatsapp-logo-transparent-whatsapp-icon-transparent-free-free-png.webp?alt=media&token=38019c55-c90f-42ba-8d26-3bc025a758a4",
  },
  {
    id: "ai-assistant",
    title: "AI Assistant",
    description: "Chat with our AI assistant to get answers to your questions",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/tchidash-fd7aa.appspot.com/o/generate-ai-artificial-intelligence-logo-600nw-2492648973.webp?alt=media&token=5c8559fc-9ad5-48f5-9c2f-67d4a56aba58",
  },
];

export default function IntegrationsPage() {
  const { store } = useStore();

  // Check if the user has view permission
  const hasViewPermission = usePermission();

  if (!hasViewPermission("settings_integrations", "view")) {
    return <div>You dont have permission to view this page</div>;
  }

  return (
    store && (
      <div className="w-full ">
        <h1 className="text-3xl font-bold mb-8 text-start">Integrations</h1>
        <div className="grid grid-cols-1 md:grid-cols-2  xl:grid-cols-3 gap-6">
          {integrations.map((integration) => (
            <IntegrationCard key={integration.id} integration={integration} />
          ))}
        </div>
      </div>
    )
  );
}

const IntegrationCard = ({ integration }: { integration: Integration }) => {
  const { store, setStore } = useStore();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!store) return;
    console.log(store);
    setEnabled(
      (store?.integrations ?? []).find((i) => i.name === integration.id)
        ?.enabled ?? false,
    );

    if (!store.integrations) {
      const newUpdate = {
        ...store,
        integrations: [
          {
            name: integration.id,
            enabled: false,
          },
        ],
      } as Store;
      setStore(newUpdate);
      dbUpdateDoc(
        doc(db, "stores", store.id),
        {
          integrations: newUpdate.integrations ?? [],
        },
        store.id,
        "",
      );
    }
  }, [store, setEnabled, integration.id]);

  return (
    store && (
      <Card key={integration.id} className="flex flex-col">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Image
              src={integration.imageUrl}
              alt={`${integration.title} logo`}
              width={80}
              height={80}
              className="rounded-md w-[70px] h-[70px]"
            />
            <CardTitle>{integration.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription>{integration.description}</CardDescription>
        </CardContent>
        <CardFooter className="mt-auto">
          <div className="flex space-x-2">
            <Button
              variant={!enabled ? "default" : "outline"}
              onClick={() => {
                // Handle enabling/disabling integrations
                if (!store.integrations) return;
                if (
                  !store.integrations.find((i) => i.name === integration.id)
                ) {
                  const newUpdate = {
                    ...store,
                    integrations: [
                      ...(store.integrations ?? []),
                      {
                        name: integration.id,
                        enabled: true,
                      },
                    ],
                  } as Store;
                  setStore(newUpdate);
                  dbUpdateDoc(
                    doc(db, "stores", store.id),
                    {
                      integrations: newUpdate.integrations ?? [],
                    },
                    store.id,
                    "",
                  );
                  return;
                }

                const newUpdate = {
                  ...store,
                  integrations: (store?.integrations ?? []).map((i) =>
                    i.name === integration.id
                      ? {
                          ...i,
                          enabled: !enabled,
                        }
                      : i,
                  ),
                } as Store;
                setStore(newUpdate);
                dbUpdateDoc(
                  doc(db, "stores", store.id),
                  {
                    integrations: newUpdate.integrations ?? [],
                  },
                  store.id,
                  "",
                );
              }}
            >
              {enabled ? "Disable" : "Enable"}
            </Button>
            {enabled && (
              <Link href={`/dashboard/settings/integrations/${integration.id}`}>
                <Button variant="outline">Configure</Button>
              </Link>
            )}
          </div>
        </CardFooter>
      </Card>
    )
  );
};
