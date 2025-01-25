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




export async function GET(req: NextRequest) {
  try {
    // Extract the image URL from the query parameters
    const imageUrl = req.nextUrl.searchParams.get("url");

    if (!imageUrl) {
      return new NextResponse("No image URL provided", { status: 400 });
    }

    // Fetch the image from the provided URL
    const imageResponse = await fetch(imageUrl);

    if (!imageResponse.ok) {
      return new NextResponse("Failed to fetch image", { status: 500 });
    }

    // Extract the content type and image buffer
    const contentType =
      imageResponse.headers.get("content-type") || "image/jpeg";
    const imageBuffer = await imageResponse.arrayBuffer();

    // Return the image as a response with CORS headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(imageBuffer.byteLength),
        "Access-Control-Allow-Origin": "*", // Allow all origins
        "Access-Control-Allow-Methods": "GET, OPTIONS", // Allow GET and OPTIONS
        "Access-Control-Allow-Headers": "Content-Type", // Allow Content-Type header
      },
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    return new NextResponse("Error fetching image", { status: 500 });
  }
}

// Add OPTIONS method to handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}