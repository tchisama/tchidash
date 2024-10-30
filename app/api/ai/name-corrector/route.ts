import { NextRequest } from "next/server";
import { z } from "zod";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";

export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get("name");

  if (!name) {
    return new Response(JSON.stringify({ error: "Name is required" }), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 400,
    });
  }
  const checkName = containsArabic(name);

  if (!checkName) {
    return new Response(
      JSON.stringify({ error: "Name does not contain Arabic characters" }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 400,
      },
    );
  }

  const result = await generateObject({
    model: openai("gpt-3.5-turbo"),
    schema: z.object({
      toEnglishLetters: z.string(),
    }),
    temperature: 0.7,
    prompt: name,
    system:
      "You are given an Arabic 'moroccan' name. Convert it to English letters using typical transliteration. Respond with only the transliterated name, for example, احمد => Ahmed.",
  });
  console.log(result.object);

  return new Response(
    JSON.stringify({
      name,
      checkName,
      englishLetters: result.object.toEnglishLetters,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}

function containsArabic(text: string) {
  const arabicRegex = /[\u0600-\u06FF]/;
  return arabicRegex.test(text);
}
