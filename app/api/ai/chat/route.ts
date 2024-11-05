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
    maxSteps: 5,
    tools: {
      getUserName: {
        description: "Get the current user's name",
        parameters: z.object({}),
        execute: async () => {
          return { userName };
        },
      },
      getOrdersFromVictorDB: {
        description:
          "Get the orders from Victor's database, the result is just the closest match , you need to double check it",
        parameters: z.object({
          prompt: z.string().describe("The prompt to use for the query"),
        }),
        execute: async ({ prompt }) => {
          const getEmbededPrompt = await generateEmbedding({ text: prompt });
          console.log(prompt);
          const queryResults = await dbIndex.namespace("orders").query({
            topK: 5,
            vector: getEmbededPrompt,
            includeValues: true,
          });
          if (queryResults.matches.length === 0) {
            return { orders: [] };
          }
          // const orders = queryResults.matches.map(async (order) => {
          //   console.log(order.id);
          //   const orderData = await getDoc(doc(db, "orders", order.id)).then(
          //     (doc) => {
          //       if (doc.exists()) {
          //         return { ...doc.data(), id: doc.id };
          //       } else {
          //         return null;
          //       }
          //     },
          //   );
          //   return orderData;
          // });
          const orders = await Promise.all(
            queryResults.matches.map(async (order) => {
              console.log(order.id);
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

          console.log(orders);
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
