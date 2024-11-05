import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

export async function POST(request: Request) {
  const { messages , storeId, userEmail,userName } = await request.json();
  console.log(storeId, userEmail,userName);

  const result = await streamText({
    model: openai("gpt-3.5-turbo"),
    messages:messages,
    maxSteps:5,
    tools:{
        getUserName: {
          description: "Get the current user's name",
          parameters: z.object({}),
          execute: async () => {
            return {userName};
          }
      }
    },
    system:`
You are TchiDash's professional e-commerce assistant, tailored for Morocco’s market.

Key Focus:
- Help users with store management, technical support, and market insights.
- Advise on inventory, order processing, and customer service.

Language:
1. Begin by asking the user’s language preference:
   - English (en)
   - Arabic (ar)
   - French (fr)
2. Continue in their chosen language.

Tone:
- Address users by name, with a professional, friendly approach, adapting to Moroccan business norms.

Scope:
- Stay within e-commerce, TchiDash platform support, and business operations. Politely redirect unrelated inquiries.

Guidance Steps:
1. Understand the user's need.
2. Offer clear, step-by-step solutions.
3. Use examples when relevant.
4. Follow up to confirm resolution.

Always align advice with Moroccan practices and global e-commerce standards.
`
  })
  return result.toAIStreamResponse();
}