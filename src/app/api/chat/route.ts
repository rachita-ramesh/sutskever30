import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getConceptById } from "@/data/concepts";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { messages, conceptId } = await request.json();
    
    const concept = getConceptById(conceptId);
    if (!concept) {
      return NextResponse.json({ error: "Concept not found" }, { status: 404 });
    }

    const systemPrompt = `You are an expert AI tutor. Your goal is to provide clear, accurate, and direct explanations of a core AI concept.

Topic:
- Concept: ${concept.name}
- Description: ${concept.description}
- Category: ${concept.category}
- Difficulty: ${concept.difficulty}
- Reference Paper: "${concept.paperReference.title}" by ${concept.paperReference.authors.join(", ")} (${concept.paperReference.year})

Your Role:
- Explain the concept directly and concisely.
- Be technically accurate.
- Adapt your level of detail based on the user's questions.
- Refer to the key paper when it provides critical context.

Guidelines:
- Avoid conversational filler, platitudes, or overly enthusiastic language ("let's dive in", "fascinating world", etc.).
- Do not use analogies unless the user explicitly asks for one.
- Get straight to the point in your initial explanation.
- Keep responses focused on the user's query.

Begin by providing a direct, textbook-style definition and explanation of the core idea of "${concept.name}".`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const assistantMessage = response.choices[0]?.message?.content;
    
    if (!assistantMessage) {
      return NextResponse.json({ error: "No response generated" }, { status: 500 });
    }

    return NextResponse.json({
      message: assistantMessage,
      concept: concept
    });

  } catch (error) {
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
} 