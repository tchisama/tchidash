import { db } from "@/firebase";
import { generateEmbedding } from "@/lib/ai/openai/embedding";
import { dbIndex } from "@/lib/db/pinecone";
import { doc, getDoc } from "firebase/firestore";
import { z } from "zod";

export const getOrdersFromVictorDB
 =({storeId}:{
  storeId:string
})=>({         description:
          "Get the orders from Victor's database, the result is just the closest match , you need to double check it and return only the correct" +
          "if the last result is one order please use the tool return the order details , display ui "
          ,
        parameters: z.object({
          prompt: z
            .string()
            .describe(
              "The prompt to use for the query , the search is not smart enough to calculate stuff you need to do it before creating the prompt",
            ),
          dateRange:z.object({
            startDate:z.string().describe("starting date-time in format ISO 8601"),
            endDate:z.string().describe("ending date-time in format ISO 8601")
          }).optional().describe("The date range to filter the orders ,IMPORTANT : use this only if you know exact dates ortherwise leave it empty, default is all times")
        }),
        execute: async ({ prompt ,dateRange}:{prompt:string,
          dateRange:{
            startDate:string;
            endDate:string
          }
        }) => {
          const getEmbededPrompt = await generateEmbedding({ text: prompt });
          console.log("PROMPT", prompt);
          console.log("DATE RANGE", dateRange);

          const filter:{
            [key: string]: unknown
          }={
            storeId: { $eq: storeId },
          };
          if (dateRange) {
            filter.createdAt = {
              $gte: new Date(dateRange.startDate).getTime(),
              $lte: new Date(dateRange.endDate).getTime()
            };
          }
          const queryResults = await dbIndex.namespace("orders").query({
            topK: 3,
            vector: getEmbededPrompt,
            // filter by storeId
            filter,
            includeMetadata: true,
          });
          const SIMILARITY_THRESHOLD = 0.1;
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
                      ... doc.data(),
                      id: doc.id,
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