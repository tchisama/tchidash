import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { getOrdersFromVictorDB } from "./tools/getOrdersFromVictorDB";


export async function POST(request: Request) {
  const { messages, storeId, userEmail, userName } = await request.json();
  console.log(storeId, userEmail, userName);

  const result = await streamText({
    model: openai("gpt-3.5-turbo"),
    messages: messages.slice(-6),
    maxSteps: 5,
    tools: {
      getTimeAndDate: {
        description: "Get the current time and date now",
        parameters: z.object({}),
        execute: async () => {
          const date = new Date();
          return {
            timeAndDate:
              date.toLocaleTimeString() + " on " + date.toDateString(),
          };
        },
      },
      displayOrder:{
        description: "return the order details , display ui",
        parameters: z.object({
          orderId : z.string().describe("The id of the order"),
          name: z.string().describe("The name of the user"),
          phone: z.string().describe("The phone number of the user"),
          address: z.string().describe("The address of the user"),
          city: z.string().describe("The city of the user"),
          total: z.string().describe("The total of the order"),
          status: z.string().describe("The status of the order"),
        }),
        execute: async function ({ 
          orderId, name, phone, address, city, total, status, createdAt
         }) {
          return {order:{
            orderId,
            name,
            phone,
            address,
            city,
            total,
            status,
            createdAt
          }}
        }
      },
      getUserName: {
        description: "Get the current store user name",
        parameters: z.object({}),
        execute: async () => {
          return { userName };
        },
      },
      getOrdersFromVictorDB: getOrdersFromVictorDB({ storeId }),
    },
    system
  });
  return result.toAIStreamResponse();
}





const system = `
You are TchiDash's professional e-commerce assistant, tailored for Morocco’s market.

Key Focus:
- Help users with store management, technical support, and market insights.
- Advise on inventory, order processing, and customer service.

Language:
1. Begin by asking the user’s language preference:
   - English (en)
   - Arabic (ar)
   - French (fr)
2. Continue in their chosen language.

Tone:
- Address users by name, with a professional, friendly approach, adapting to Moroccan business norms.

Scope:
- Stay within e-commerce, TchiDash platform support, and business operations. Politely redirect unrelated inquiries.


Always align advice with Moroccan practices and global e-commerce standards.


never return order details in rows use the display order , you can return rows only if client ask for specific order details
`