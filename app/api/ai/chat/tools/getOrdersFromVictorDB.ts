import { db } from "@/firebase";
import { generateEmbedding } from "@/lib/ai/openai/embedding";
import { dbIndex } from "@/lib/db/pinecone";
import { doc, getDoc } from "firebase/firestore";
import { z } from "zod";

export const getOrdersFromVictorDB
 =({storeId}:{
  storeId:string
})=>({         description:
          "Get the orders from Victor's database, the result is just the closest match , you need to double check it" +
          "you will be returned with orders in this orders :" +
          "if the last result is one order please use the tool return the order details , display ui "
          ,
        parameters: z.object({
          prompt: z
            .string()
            .describe(
              "The prompt to use for the query , the search is not smart enough to calculate stuff you need to do it before creating the prompt",
            ),
        }),
        execute: async ({ prompt }:{prompt:string}) => {
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
          const filteredResults = queryResults.matches.filter((match:{
            score?: number;
          }) => {
            if (!match?.score) return false;
            return match.score > SIMILARITY_THRESHOLD;
          });
          console.log("Query results", queryResults.matches.length);
          if (queryResults.matches.length === 0) {
            return { orders: [] };
          }
          const orders = await Promise.all(
            filteredResults.map(async (order:{
              id: string;
            }) => {
              const orderData = await getDoc(doc(db, "orders", order.id)).then(
                (doc) => {
                  if (doc.exists()) {
                    return {
                      order: `
Order ID: ${order.id}
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
      })