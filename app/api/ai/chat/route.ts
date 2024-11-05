import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { dbIndex } from "@/lib/db/pinecone";
import { generateEmbedding } from "@/lib/ai/openai/embedding";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

export async function POST(request: Request) {
  const { messages, storeId, userEmail, userName } = await request.json();
  console.log(storeId, userEmail, userName);

  const result = await streamText({
    model: openai("gpt-3.5-turbo"),
    messages: messages,
    maxSteps: 6,
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
      getUserName: {
        description: "Get the current user's name",
        parameters: z.object({}),
        execute: async () => {
          return { userName };
        },
      },
      getOrdersFromVictorDB: {
        description:
          "Get the orders from Victor's database, the result is just the closest match , you need to double check it" +
          "you will be returned with orders in this format :" +
          "Order ID: xx \n Customer Name: xx \n Customer Phone: xx \n Customer Email: xx \n Customer Address: xx \n Order Total: xx \n Order Status: xx \n Shipping Cost: xx \n Order Items: xx \n Order Note : xx \n Created At: xx",
        parameters: z.object({
          prompt: z
            .string()
            .describe(
              "The prompt to use for the query , the search is not smart enough to calculate stuff you need to do it before creating the prompt",
            ),
        }),
        execute: async ({ prompt }) => {
          const getEmbededPrompt = await generateEmbedding({ text: prompt });
          console.log("PROMPT", prompt);
          const queryResults = await dbIndex.namespace("orders").query({
            topK: 3,
            vector: getEmbededPrompt,
            // filter by storeId
            filter: {
              storeId: { $eq: storeId },
            },
            includeMetadata: true,
          });
          const SIMILARITY_THRESHOLD = 0.2;
          console.log("Query results", queryResults.matches);
          const filteredResults = queryResults.matches.filter((match) => {
            if (!match?.score) return false;
            return match.score > SIMILARITY_THRESHOLD;
          });
          console.log("Query results", queryResults.matches.length);
          if (queryResults.matches.length === 0) {
            return { orders: [] };
          }
          const orders = await Promise.all(
            filteredResults.map(async (order) => {
              const orderData = await getDoc(doc(db, "orders", order.id)).then(
                (doc) => {
                  if (doc.exists()) {
                    return {
                      order: `
Order ID: ${doc.id}
Customer Name: ${doc.data().customer.name}
Customer Phone: ${doc.data().customer.phoneNumber}
Customer Email: ${doc.data().customer.email ?? "no email"}
Customer Address: ${doc.data().customer.shippingAddress.address}, ${doc.data().customer.shippingAddress.city} 
Order Total: ${doc.data().totalPrice} Dh
Order Status: ${doc.data().orderStatus}
Shipping Cost: ${doc.data().shippingInfo.cost ?? "Free"}
Order Items: ${doc
                        .data()
                        .items.map(
                          (item: {
                            title: string;
                            quantity: number;
                            totalPrice: number;
                          }) =>
                            ` - ${item.title} x ${item.quantity} = ${item.totalPrice} Dh`,
                        )
                        .join("\n")}
Order Note : ${doc.data().note?.content ?? "No note"}
Created At: ${doc.data().createdAt.toDate().toLocaleDateString()} at ${doc.data().createdAt.toDate().toLocaleTimeString()}
`,
                    };
                  } else {
                    return null;
                  }
                },
              );
              return orderData;
            }),
          );

          return { orders };
        },
      },
    },
    system: `
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
`,
  });
  return result.toAIStreamResponse();
}
