import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
// import { google } from "@ai-sdk/google";
import { z } from "zod";
import { getOrdersFromVictorDB } from "./tools/getOrdersFromVictorDB";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
export async function POST(request: Request) {
  const { messages, storeId, userEmail, userName } = await request.json();
  console.log(storeId, userEmail, userName);

  const result = await streamText({
    model: openai("gpt-4o-mini"),
    // model : google("gemini-1.5-pro"),
    messages: messages.slice(-6),
    maxSteps: 5,
    tools: {
      getLanguage: {
        description: "Get the language of the conversation",
        parameters: z.object({}),
        execute: async () => {
          const storeData = await getDoc(doc(db, "data-collection", storeId));
          if (storeData.exists()) {
            return {
              language: storeData.data().language,
            };
          } else {
            return {
              language: "not selected , use english by default",
            };
          }
        },
      },
      getTimeAndDate: {
        description:
          "Get the current time and date now, always use this if its related to time or date",
        parameters: z.object({}),
        execute: async () => {
          const date = new Date();
          return {
            timeAndDate:
              date.toLocaleTimeString() + " on " + date.toDateString(),
          };
        },
      },
      dataCollectionTool: {
        description: "Collects relevant data from the conversation",
        parameters: z.object({
          data: z
            .array(
              z
                .object({
                  content: z
                    .string()
                    .describe(
                      "The data to collect , always give data and details about it",
                    ),
                  type: z
                    .enum([
                      "store",
                      "users",
                      "orders",
                      "products",
                      "problems",
                      "events",
                      "language",
                      "other",
                    ])
                    .describe("The type of data to collect"),
                })
                .describe("The data to collect from the conversation"),
            )
            .describe("The data array each item for an idea "),
        }),
        execute: async ({ data }) => {
          const storeData = await getDoc(doc(db, "data-collection", storeId));
          console.log(data);
          for (const item of data) {
            if (storeData.exists()) {
              if (item.type == "language") {
                await updateDoc(doc(db, "data-collection", storeId), {
                  language: item.content,
                });
                continue;
              }
              await updateDoc(doc(db, "data-collection", storeId), {
                [item.type]: [
                  ...(storeData.data()[item.type] ?? []),
                  item.content,
                ],
              });
            } else {
              await setDoc(doc(db, "data-collection", storeId), {
                [item.type]: [item.content],
              });
            }
          }

          return {
            message: `thank you for sharing with me`,
          };
        },
      },
      getStoreData: {
        description: "Get the store data",
        parameters: z.object({
          type: z
            .enum([
              "store",
              "users",
              "orders",
              "products",
              "problems",
              "events",
              "language",
              "other",
            ])
            .describe("The type of data to collect"),
        }),
        execute: async ({ type }) => {
          const storeData = await getDoc(doc(db, "data-collection", storeId));
          if (storeData.exists()) {
            if (!storeData.data()[type]) {
              return {
                [type]: [],
              };
            }
            return storeData.data()[type];
          } else {
            return {
              [type]: [],
            };
          }
        },
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
    system,
  });
  return result.toAIStreamResponse();
}

const system = `
# You are TchiDash's professional e-commerce assistant, tailored for Morocco's market

## Key Focus:
- Help users with orders
- Use emojis with clean markdown formatting , use tables but in max 4 columns
- Automatically collect relevant data from users about themselves or the store

## Language:
1. get Language
2. if none, can choose any of the following languages:
   - English (en)
   - Arabic (ar) 
   - Darija (darija) // its moroccan arabic with english litters and numbers
   - French (fr)
3. Save the selected language in the db
4. Continue in their chosen language.

## Tone:
- some times Address users by name, with a professional "hi my friend name ",

## Scope:
- Stay within e-commerce, TchiDash platform support, and business operations. Politely redirect unrelated inquiries.
- Always align advice with Moroccan practices and global e-commerce standards.
- always check database if there is any data related to user message

## Order Details:
- IF YOU NEED ORDERS BASED ON THE TIME USE THE CURRENT DATE TIME FUNCTION
- When returning order details make sure its (react-markdown table) include the customer's name, phone, address, total amount, and list of items make sure the items in another table 
- For item details, always include images (images are inline CSS).

## Data Collection:
- Automatically collect any relevant information the user shares about themselves or the store, such as events, problems, or other important details.
- Provide a friendly response acknowledging the collection of this data and its inclusion in the user's dashboard.

`;

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
