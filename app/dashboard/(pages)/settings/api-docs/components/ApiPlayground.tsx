import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ApiEndpoint, getEndpointParams } from "../apiDocsConfig";
import { useStore } from "@/store/storeInfos";

interface ApiPlaygroundProps {
  endpoint: ApiEndpoint;
}

export function ApiPlayground({ endpoint }: ApiPlaygroundProps) {
  const { storeId } = useStore();
  const [response, setResponse] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [jsonInput, setJsonInput] = useState("{}");
  const [generatedUrl, setGeneratedUrl] = useState("");

  const paramsConfig = getEndpointParams(endpoint);

  // Initialize JSON input with default values
  useEffect(() => {
    const initialParams: Record<string, unknown> = {};
    paramsConfig.forEach((param) => {
      if (param.name === "storeid") {
        initialParams[param.name] = storeId || "";
      } else {
        initialParams[param.name] = "";
      }
    });
    setJsonInput(JSON.stringify(initialParams, null, 2));
  }, [endpoint, storeId]);

  // Update generated URL when JSON input changes (only for GET requests)
  useEffect(() => {
    if (endpoint.method === "GET") {
      try {
        const params = JSON.parse(jsonInput);
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== "") {
            queryParams.append(key, (value as string).toString());
          }
        });
        setGeneratedUrl(`${endpoint.path}?${queryParams}`);
      } catch  {
        setGeneratedUrl(endpoint.path);
      }
    } else {
      setGeneratedUrl(endpoint.path);
    }
  }, [jsonInput, endpoint.path, endpoint.method]);

  const handleTestApi = async () => {
    setLoading(true);
    try {
      const rawBody = JSON.parse(jsonInput);
      
      // Filter out empty values and create clean body
      const cleanBody = Object.entries(rawBody).reduce((acc, [key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, unknown>);

      const options: RequestInit = {
        method: endpoint.method,
        headers: {
          "Content-Type": "application/json",
        },
      };

      // Add body for POST and PUT requests
      if (endpoint.method === "POST" || endpoint.method === "PUT") {
        options.body = JSON.stringify(cleanBody);
      }

      const response = await fetch(generatedUrl, options);
      const data = await response.json();
      setResponse(data);
    } catch  {
      setResponse({ error: "Failed to fetch data" });
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Playground</CardTitle>
        <CardDescription>
          Test the API endpoints directly from here
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Parameters JSON Input */}
          <div className="space-y-2">
            <div className="text-sm font-medium">
              {endpoint.method === "GET" ? "Query Parameters (JSON):" : "Request Body (JSON):"}
            </div>
            <Textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="h-48 font-mono text-sm"
              placeholder="Enter parameters as JSON"
            />
          </div>

          {/* Generated URL Display */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Endpoint URL:</div>
            <div className="p-3 bg-muted rounded-md font-mono text-sm break-all">
              {generatedUrl}
            </div>
          </div>

          <Button
            onClick={handleTestApi}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Testing..." : "Test API"}
          </Button>

          {response && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Response:</div>
              <Textarea
                value={JSON.stringify(response, null, 2)}
                readOnly
                className="h-48 font-mono text-sm"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 