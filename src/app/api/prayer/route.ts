import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(request: Request) {
  try {
    const { topic } = await request.json();

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 250,
      system: "You are a compassionate Christian prayer writer. Write heartfelt, biblical prayers that feel personal and sincere. Keep prayers to 3-4 sentences. End with 'In Jesus' name, Amen.' Reference Scripture naturally without quoting chapter/verse explicitly. Be warm, authentic, and faith-filled.",
      messages: [{
        role: "user",
        content: `Write a personal prayer for someone dealing with: ${topic.replace(/^[^\s]+\s/, "")}`,
      }],
    });

    const prayer = response.content[0].type === "text" ? response.content[0].text : "";
    return NextResponse.json({ prayer });
  } catch (error) {
    console.error("Prayer API error:", error);
    return NextResponse.json({
      prayer: "Heavenly Father, we come to You with open hearts, trusting in Your love and faithfulness. Meet us in this moment, provide what only You can provide, and let Your peace guard our hearts and minds. We trust You with every detail. In Jesus' name, Amen.",
    });
  }
}
