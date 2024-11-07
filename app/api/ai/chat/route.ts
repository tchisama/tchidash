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
        description: "Get the current time and date now, always use this if its related to time or date",
        parameters: z.object({}),
        execute: async () => {
          const date = new Date();
          return {
            timeAndDate:
              date.toLocaleTimeString() + " on " + date.toDateString(),
          };
        },
      },
      dataCollectionTool : {
  description: 'Collects relevant data from the conversation',
  parameters: z.object({
    data: z.string(),
  }),
  execute: async ({data}) => {
    // Return a response to the user
    console.log("Data", data);
    return 'I\'ve noted the information you provided and will include it in your dashboard. '+data;
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
- Help users with orders,

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

when return the order details in first time , return name , and phone , and address and amount and items , anless the user want more details
and about items always return images and put them in the first line then the name like : [img - name - quantity]
use # ## ### for better display , and <hr>
`
















      // displayOrder:{
      //   description: "return the order details , display ui",
      //   parameters: z.object({
      //     orderId : z.string().describe("The id of the order"),
      //     name: z.string().describe("The name of the user"),
      //     phone: z.string().describe("The phone number of the user"),
      //     address: z.string().describe("The address of the user"),
      //     city: z.string().describe("The city of the user"),
      //     total: z.string().describe("The total of the order"),
      //     status: z.string().describe("The status of the order"),
      //   }),
      //   execute: async function ({ 
      //     orderId, name, phone, address, city, total, status, createdAt
      //    }) {
      //     return {order:{
      //       orderId,
      //       name,
      //       phone,
      //       address,
      //       city,
      //       total,
      //       status,
      //       createdAt
      //     }}
      //   }
      // },