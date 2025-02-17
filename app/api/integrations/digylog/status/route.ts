import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const baseUrl = "https://api.digylog.com/api/v2/seller";
const referer = "https://apiseller.digylog.com";

export async function GET(request: NextRequest) {
  const bearerToken = request.nextUrl.searchParams.get("token");
  try {
    const response = await axios
      .get(`${baseUrl}/statuses`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Referer: referer,
          Authorization: `Bearer ${bearerToken}`,
        },
      })
      .then((res) => res.data)
      .catch((err) => {
        console.log(err);
      });

    return NextResponse.json({ status: "success", data: response });
  } catch (error) {
    console.error("Error sending data to Digylog");
    return NextResponse.json({ status: JSON.stringify(error) });
  }
}
