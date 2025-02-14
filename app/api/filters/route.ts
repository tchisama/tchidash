import { fetchFirestoreDocs } from "@/app/actions/CollectionFeltring";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { collectionName, filters } = await req.json();

    console.log(collectionName, filters);

    if (!collectionName) {
      return NextResponse.json(
        { error: "collectionName is required" },
        { status: 400 },
      );
    }

    const data = await fetchFirestoreDocs(collectionName, filters);

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching Firestore docs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
