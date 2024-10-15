import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    // Parse the request to extract the image URL
    const { image } = await req.json();

    if (!image) {
      return new NextResponse("No image URL provided", { status: 400 });
    }

    // Fetch the image from the provided URL
    const imageResponse = await fetch(image);

    if (!imageResponse.ok) {
      return new NextResponse("Failed to fetch image", { status: 500 });
    }

    // Extract the content type and image buffer
    const contentType =
      imageResponse.headers.get("content-type") || "image/jpeg";
    const imageBuffer = await imageResponse.arrayBuffer();

    // Return the image as a response
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(imageBuffer.byteLength),
      },
    });
  } catch {
    return new NextResponse("Error fetching image", { status: 500 });
  }
}
