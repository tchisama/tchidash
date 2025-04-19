"use client";

import { usePermission } from "@/hooks/use-permission";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { apiDocsConfig } from "./apiDocsConfig";
import { ApiPlayground } from "./components/ApiPlayground";

export default function ApiDocsPage() {
  const [selectedGroup, setSelectedGroup] = useState(apiDocsConfig[0].name);
  const [selectedEndpoint, setSelectedEndpoint] = useState(apiDocsConfig[0].endpoints[0]);
  const hasViewPermission = usePermission();

  if (!hasViewPermission("settings", "view")) {
    return <div>You don{"'"}t have permission to view this page</div>;
  }

  const currentGroup = apiDocsConfig.find((group) => group.name === selectedGroup);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-8">API Documentation</h1>
      
      <Tabs value={selectedGroup} onValueChange={setSelectedGroup} className="w-full">
        <TabsList>
          {apiDocsConfig.map((group) => (
            <TabsTrigger key={group.name} value={group.name}>
              {group.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {currentGroup && (
          <TabsContent value={currentGroup.name}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Documentation Section */}
              <Card>
                <CardHeader>
                  <CardTitle>{currentGroup.name} API Documentation</CardTitle>
                  <CardDescription>
                    {currentGroup.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {currentGroup.endpoints.map((endpoint) => (
                      <div
                        key={`${endpoint.method}-${endpoint.path}`}
                        className={`p-4 rounded-lg border ${
                          selectedEndpoint === endpoint
                            ? "border-primary bg-primary/5"
                            : "border-border"
                        } cursor-pointer`}
                        onClick={() => setSelectedEndpoint(endpoint)}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-mono text-sm px-2 py-1 rounded bg-muted">
                            {endpoint.method}
                          </span>
                          <span className="font-mono text-sm">{endpoint.path}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {endpoint.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Playground Section */}
              <ApiPlayground endpoint={selectedEndpoint} />
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
} 