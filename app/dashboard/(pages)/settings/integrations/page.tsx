"use client";
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
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Store } from "@/types/store";
import { usePermission } from "@/hooks/use-permission";
import {
  BellRing,
  Bot,
  Layout,
  MessageSquare,
  Package,
  StoreIcon,
} from "lucide-react";

interface Integration {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string; // Add this
}

const integrations: Integration[] = [
  {
    id: "digylog",
    title: "DigyLog",
    description: "DigyLog is a Moroccan Shipping Provider",
    color: "#4ade80", // green-400
    icon: <Package className="w-[30px] h-[30px]" />,
  },
  {
    id: "pos",
    title: "POS",
    description: "Point of Sale integration for managing in-store sales",
    color: "#f59e0b", // amber-500
    icon: <StoreIcon className="w-[30px] h-[30px]" />,
  },
  {
    id: "landing-page-builder",
    title: "Landing Page Builder",
    description:
      "Create beautiful landing pages for your products and campaigns",
    color: "#3b82f6", // blue-500
    icon: <Layout className="w-[30px] h-[30px]" />,
  },
  {
    id: "whatsapp-notification",
    title: "WhatsApp Notification",
    description: "Receive notifications on WhatsApp on certain events",
    color: "#10b981", // emerald-500
    icon: <BellRing className="w-[30px] h-[30px]" />,
  },
  {
    id: "whatsapp",
    title: "WhatsApp",
    description: "Send messages to customers on WhatsApp",
    color: "#22c55e", // green-500
    icon: <MessageSquare className="w-[30px] h-[30px]" />,
  },
  {
    id: "ai-assistant",
    title: "AI Assistant",
    description: "Chat with our AI assistant to get answers to your questions",
    color: "#8b5cf6", // violet-500
    icon: <Bot className="w-[30px] h-[30px]" />,
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
            <div
              className="p-2 rounded-md"
              style={{
                backgroundColor: integration.color + "10",
                border: 1,
                borderColor: integration.color + "20",
                borderStyle: "solid",
              }} // light bg with transparency
            >
              {React.cloneElement(integration.icon as React.ReactElement, {
                style: { color: integration.color },
                strokeWidth: 1.5,
                width: 20,
                height: 20,
                className: "w-[25px] h-[25px]",
              })}
            </div>
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
