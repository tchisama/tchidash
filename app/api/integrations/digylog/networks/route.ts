import axios from "axios";
import { NextResponse } from "next/server";

const baseUrl = "https://api.digylog.com/api/v2/seller";
const referer = "https://apiseller.digylog.com";
const bearerToken =
  "YTk2MDA3Mzc0NjQyZjQxNmI2MjI4ZDQ1MTI0OGJjYjk4YWM1NjcxMGE2NTAyNDc5ODFiOWZjYWMzNjcwNjcyOQ";

export async function GET() {
  try {
    const response = await axios
      .get(`${baseUrl}/networks`, {
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
