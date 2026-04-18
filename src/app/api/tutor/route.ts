import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

type InMessage = { role: "user" | "assistant"; content: string };

export async function POST(request: NextRequest) {
  try {
    const { messages } = (await request.json()) as { messages: InMessage[] };

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 600,
      temperature: 0.7,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const textBlock = response.content.find((b) => b.type === "text");
    const text = textBlock?.type === "text" ? textBlock.text : "";

    return NextResponse.json({ completion: text });
  } catch (error) {
    console.error("Tutor API error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
