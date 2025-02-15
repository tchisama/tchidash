import { NextRequest, NextResponse } from "next/server";
import {
  DIGYLOG_BASE_URL,
  DIGYLOG_REFERER,
  getDigylogCredantials,
} from "../orders/route";
import axios from "axios";
// register new webhook
//

// PUT /webhook Add or Update webhook
// Property Type Value Description
// url string required url of your webhook

// register new webhook
export async function POST(request: NextRequest) {
  const storeId = request.nextUrl.searchParams.get("storeId");
  console.log(storeId);

  if (!storeId) {
    return NextResponse.json({ status: "no storeId" });
  }

  const { token, errors } = await getDigylogCredantials(storeId);

  if (errors) {
    return NextResponse.json({ status: errors });
  }

  const url = "https://dash.tchisama.com/api/integrations/digylog/webhook";

  try {
    const response = await axios
      .put(
        `${DIGYLOG_BASE_URL}/webhook`,
        {
          url,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Referer: DIGYLOG_REFERER,
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => res.data);

    return NextResponse.json({ status: "success", data: response });
  } catch (error) {
    console.error("Error sending data to Digylog");
    console.log(JSON.stringify(error, null, 2));
    return NextResponse.json({ status: error }, { status: 500 });
  }
}

export async function PUT() {
  console.log("PUT /webhook");
  return NextResponse.json({ status: "success" });
}
