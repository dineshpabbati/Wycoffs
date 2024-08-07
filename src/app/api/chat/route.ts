import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export async function POST(req: Request) {
    const { messages } = await req.json();
    console.log('Received messages:', messages);

    const result = await streamText({
        model: openai('gpt-3.5-turbo-0125'),
        messages,
    });

    console.log('Result:', result);

    return result.toDataStreamResponse();
}
