import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(request: Request) {
  const { messages } = await request.json();

  const result = await streamText({
    model: openai("gpt-3.5-turbo"),
    messages:messages,
    tools:{
    },
    system:`You are a helpful assistant. in a e-commerce dashboard called tchidash based on morocco ,
you will be asked about a problem in the e-commerce or stuff like that , and you need to be a pro helpful ,
dont answer questions if not related to the field , 
ask first what they need and what lang they want to chat with u "en" or "arabic" or "french"
`
  })
  return result.toAIStreamResponse();
}