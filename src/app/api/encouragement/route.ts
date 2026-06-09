import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { dailyVerses, affirmations, prayerPrompts } from "@/data/verses";

const client = new Anthropic();

function findRelevantVerse(feeling: string) {
  const keywords: Record<string, string[]> = {
    anxiety: ["anxiety", "anxious", "worried", "worry", "stress", "stressed", "overwhelm", "panic"],
    fear: ["fear", "afraid", "scared", "terrified", "nervous"],
    grief: ["grief", "loss", "death", "died", "mourning", "sad", "sadness"],
    loneliness: ["lonely", "alone", "isolated", "forgotten", "abandoned"],
    depression: ["hopeless", "depressed", "despair", "dark", "empty"],
    healing: ["sick", "ill", "pain", "hurt", "broken", "wounded"],
    strength: ["weak", "tired", "exhausted", "weary", "giving up"],
    hope: ["hopeless", "future", "discouraged"],
    confidence: ["confidence", "doubt", "uncertain", "insecure", "shame"],
    marriage: ["marriage", "spouse", "husband", "wife", "relationship"],
    parenting: ["child", "children", "parent", "kids", "son", "daughter"],
  };

  const lowerFeeling = feeling.toLowerCase();
  let matchedTopic = "peace";

  for (const [topic, words] of Object.entries(keywords)) {
    if (words.some(w => lowerFeeling.includes(w))) {
      matchedTopic = topic;
      break;
    }
  }

  const matches = dailyVerses.filter(v => v.topic.includes(matchedTopic));
  const pool = matches.length > 0 ? matches : dailyVerses.filter(v => v.topic.includes("hope") || v.topic.includes("peace"));
  return pool[Math.floor(Math.random() * pool.length)];
}

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    const verse = findRelevantVerse(message);
    const affirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
    const prayer = prayerPrompts[Math.floor(Math.random() * prayerPrompts.length)];

    const systemPrompt = `You are a compassionate Christian encouragement counselor who speaks with warmth, biblical wisdom, and genuine empathy.

When someone shares their struggles with you:
1. First, acknowledge their feelings with genuine empathy (2-3 sentences)
2. Offer biblical perspective and hope (2-3 sentences)
3. End with a short, powerful encouragement

Keep your response to 3-4 sentences total. Speak warmly, as a trusted friend who knows God's Word.
Do NOT include Bible verses in your text response — those will be displayed separately.
Do NOT be preachy or lecture. Be genuinely caring and human.`;

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      system: systemPrompt,
      messages: [{ role: "user", content: message }],
    });

    const encouragement = response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({
      encouragement,
      verse,
      affirmation,
      prayer,
    });
  } catch (error) {
    console.error("Encouragement API error:", error);
    const verse = findRelevantVerse("peace");
    return NextResponse.json({
      encouragement: "God sees you in this moment and He cares deeply for you. You are not walking through this alone — His presence goes before you and behind you. Take a breath and know that He is working, even now.",
      verse,
      affirmation: affirmations[0],
      prayer: prayerPrompts[0],
    });
  }
}
