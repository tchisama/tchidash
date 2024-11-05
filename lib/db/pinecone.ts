import { Pinecone } from "@pinecone-database/pinecone";

const pc = new Pinecone({
  apiKey: "3677fe11-f970-410e-a000-75274239d95e",
});
export const dbIndex = pc.index("tchidash");
