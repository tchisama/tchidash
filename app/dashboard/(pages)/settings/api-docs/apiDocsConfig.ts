import { z } from "zod";

// Base schema for common parameters
const baseParamsSchema = z.object({
  storeid: z.string().describe("Your store ID"),
});

// Product schemas
const productParamsSchema = baseParamsSchema.extend({
  category: z.string().optional().describe("Filter by category ID"),
  minPrice: z.number().optional().describe("Minimum price"),
  maxPrice: z.number().optional().describe("Maximum price"),
  limit: z.number().optional().describe("Limit number of results"),
  status: z.enum(["active", "inactive", "draft", "deleted"]).optional().describe("Filter by status"),
});

// API Endpoint configuration type
export interface ApiEndpoint {
  name: string;
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  description: string;
  paramsSchema: z.ZodType<Record<string, unknown>>;
  responseExample?: Record<string, unknown>;
  requiresAuth?: boolean;
}

// API Group configuration type
export interface ApiGroup {
  name: string;
  description: string;
  endpoints: ApiEndpoint[];
}

// API Documentation configuration
export const apiDocsConfig: ApiGroup[] = [
  {
    name: "Products",
    description: "Endpoints for managing products in your store",
    endpoints: [
      {
        name: "List Products",
        path: "/api/v1/products",
        method: "GET",
        description: "Retrieve a list of products with optional filtering",
        paramsSchema: productParamsSchema,
        responseExample: {
          products: [
            {
              id: "product_id",
              name: "Product Name",
              price: 99.99,
              category: "category_id",
              status: "active",
              storeId: "store_id"
            }
          ]
        }
      },
      {
        name: "Get Single Product",
        path: "/api/v1/product",
        method: "GET",
        description: "Retrieve a single product by ID",
        paramsSchema: z.object({
          id: z.string().describe("Product ID")
        }),
        responseExample: {
          product: {
            id: "product_id",
            name: "Product Name",
            price: 99.99,
            category: "category_id",
            status: "active",
            storeId: "store_id"
          }
        }
      },
      {
        name: "Create Product",
        path: "/api/v1/products",
        method: "POST",
        description: "Create a new product",
        paramsSchema: z.object({
          name: z.string().describe("Product name"),
          price: z.number().describe("Product price"),
          category: z.string().describe("Category ID"),
          status: z.enum(["active", "inactive", "draft"]).describe("Product status"),
          storeId: z.string().describe("Store ID"),
          description: z.string().optional().describe("Product description"),
          images: z.array(z.string()).optional().describe("Product images URLs")
        }),
        responseExample: {
          id: "new_product_id",
          name: "New Product",
          price: 99.99,
          category: "category_id",
          status: "active",
          storeId: "store_id"
        }
      },
      {
        name: "Update Product",
        path: "/api/v1/products",
        method: "PUT",
        description: "Update an existing product",
        paramsSchema: z.object({
          id: z.string().describe("Product ID to update"),
          name: z.string().optional().describe("Product name"),
          price: z.number().optional().describe("Product price"),
          category: z.string().optional().describe("Category ID"),
          status: z.enum(["active", "inactive", "draft"]).optional().describe("Product status"),
          description: z.string().optional().describe("Product description"),
          images: z.array(z.string()).optional().describe("Product images URLs")
        }),
        responseExample: {
          message: "Product updated",
          id: "product_id"
        }
      },
      {
        name: "Delete Product",
        path: "/api/v1/products",
        method: "DELETE",
        description: "Delete a product",
        paramsSchema: z.object({
          id: z.string().describe("Product ID to delete")
        }),
        responseExample: {
          message: "Product deleted",
          id: "product_id"
        }
      }
    ]
  },
  {
    name: "Categories",
    description: "Endpoints for managing product categories in your store",
    endpoints: [
      {
        name: "List Categories",
        path: "/api/v1/categories",
        method: "GET",
        description: "Retrieve a list of categories with optional filtering",
        paramsSchema: z.object({
          storeid: z.string().describe("Your store ID"),
          status: z.enum(["active", "inactive"]).optional().describe("Filter by status")
        }),
        responseExample: {
          categories: [
            {
              id: "category_id",
              name: "Category Name",
              description: "Category Description",
              status: "active",
              storeId: "store_id",
              createdAt: "2024-03-21T12:00:00Z",
              updatedAt: "2024-03-21T12:00:00Z"
            }
          ]
        }
      },
      {
        name: "Get Single Category",
        path: "/api/v1/category",
        method: "GET",
        description: "Retrieve a single category by ID",
        paramsSchema: z.object({
          id: z.string().describe("Category ID"),
          storeid: z.string().describe("Your store ID")
        }),
        responseExample: {
          category: {
            id: "category_id",
            name: "Category Name",
            description: "Category Description",
            status: "active",
            storeId: "store_id",
            createdAt: "2024-03-21T12:00:00Z",
            updatedAt: "2024-03-21T12:00:00Z"
          }
        }
      },
      {
        name: "Create Category",
        path: "/api/v1/categories",
        method: "POST",
        description: "Create a new category",
        paramsSchema: z.object({
          name: z.string().describe("Category name"),
          description: z.string().optional().describe("Category description"),
          status: z.enum(["active", "inactive"]).default("active").describe("Category status"),
          storeId: z.string().describe("Store ID")
        }),
        responseExample: {
          id: "new_category_id",
          name: "New Category",
          description: "Category Description",
          status: "active",
          storeId: "store_id"
        }
      },
      {
        name: "Update Category",
        path: "/api/v1/categories",
        method: "PUT",
        description: "Update an existing category",
        paramsSchema: z.object({
          id: z.string().describe("Category ID to update"),
          name: z.string().optional().describe("Category name"),
          description: z.string().optional().describe("Category description"),
          status: z.enum(["active", "inactive"]).optional().describe("Category status"),
          storeId: z.string().describe("Store ID")
        }),
        responseExample: {
          message: "Category updated",
          id: "category_id",
          name: "Updated Category",
          description: "Updated Description",
          status: "active"
        }
      },
      {
        name: "Delete Category",
        path: "/api/v1/categories",
        method: "DELETE",
        description: "Delete a category",
        paramsSchema: z.object({
          id: z.string().describe("Category ID to delete"),
          storeid: z.string().describe("Your store ID")
        }),
        responseExample: {
          message: "Category deleted",
          id: "category_id"
        }
      }
    ]
  }
];

// Helper function to get endpoint by path and method
export function getEndpoint(path: string, method: string): ApiEndpoint | undefined {
  for (const group of apiDocsConfig) {
    const endpoint = group.endpoints.find(
      (ep) => ep.path === path && ep.method === method
    );
    if (endpoint) return endpoint;
  }
  return undefined;
}

// Helper function to get all available parameters for an endpoint
export function getEndpointParams(endpoint: ApiEndpoint) {
  const shape = endpoint.paramsSchema._def.shape();
  return Object.entries(shape).map(([key, schema]: [string, unknown]) => ({
    name: key,
    required: !schema.isOptional(),
    description: schema.description || "",
    type: schema._def.typeName,
  }));
} 