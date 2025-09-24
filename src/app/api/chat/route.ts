import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});

const requestSchema = z.object({
  messages: z.array(messageSchema),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = requestSchema.parse(body);

    const result = streamText({
      model: openrouter("gpt-3.5-turbo"),
      messages,
      temperature: 0.7,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
