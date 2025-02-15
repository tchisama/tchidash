import { NextResponse, NextRequest } from "next/server";
import {
  DIGYLOG_BASE_URL,
  DIGYLOG_REFERER,
  getDigylogCredantials,
} from "../orders/route";

export async function POST(request: NextRequest) {
  console.log("POST /labels");

  try {
    // Parse the request body
    const body = await request.json();
    console.log("Received body:", body);

    // Validate required parameters
    if (!body.orders || !body.format) {
      return NextResponse.json(
        {
          status: "error",
          message: "Missing required fields (bl, orders, format)",
        },
        { status: 400 },
      );
    }

    const { orders, format, storeId } = body;

    // Validate format
    const validFormats = [1, 2, 3, 4, 5];
    if (!validFormats.includes(format)) {
      return NextResponse.json(
        {
          status: "error",
          message: "Invalid format. Allowed values: 1, 2, 3, 4, 5",
        },
        { status: 400 },
      );
    }

    // Split orders into an array
    const orderList = orders.map((order: string) => order.trim());
    console.log("Orders:", orderList);
    console.log("Format:", format);

    if (!storeId) return NextResponse.json({ status: "no storeId" });
    const { token, errors } = await getDigylogCredantials(storeId ?? "");
    if (errors) return NextResponse.json({ status: errors });

    // Fetch the PDF from Digylog
    const pdfBuffer = await fetchPDFFromDigylog(orderList, format, token);

    // Return the PDF as a response
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="labels_${orderList[0]}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 },
    );
  }
}

// Function to fetch PDF from Digylog
async function fetchPDFFromDigylog(
  orders: string[],
  format: number,
  token: string,
): Promise<Buffer> {
  // Prepare the request body for Digylog
  const requestBody = {
    orders: orders,
    format,
  };

  console.log("Request body:", {
    orders: orders.join(","),
    format,
    token,
  });

  // Make a POST request to Digylog
  const response = await fetch(DIGYLOG_BASE_URL + "/labels", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/pdf",
      Referer: DIGYLOG_REFERER,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestBody),
  });

  // Check if the request was successful
  if (!response.ok) {
    throw new Error(`Failed to fetch PDF from Digylog: ${response.statusText}`);
  }

  // Get the PDF as a buffer
  const pdfBuffer = await response.arrayBuffer();
  return Buffer.from(pdfBuffer);
}
