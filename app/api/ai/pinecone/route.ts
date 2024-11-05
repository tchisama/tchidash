import { dbIndex } from "@/lib/db/pinecone";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  console.log(body);
  await dbIndex.namespace("orders").upsert([body]);
  return NextResponse.json("Order created successfully");
}

export async function GET() {
  // return hello world
  //
  return NextResponse.json({ message: "Hello, world!" });
}
