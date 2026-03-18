import { serverEnv } from "@/lib/env.server";

/**
 * Classify review content using OpenAI gpt-4o-mini.
 * Returns true if the content is appropriate, false if inappropriate.
 * Fails open: if the API call fails, the review is treated as appropriate.
 */
export async function moderateContent(text: string): Promise<boolean> {
  if (!text || !text.trim()) return true;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${serverEnv.openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a content moderator for a travel accommodation platform. Classify the following review as 'appropriate' or 'inappropriate'. A review is inappropriate if it contains hate speech, harassment, spam, sexually explicit content, or personal attacks. Respond with ONLY the word 'appropriate' or 'inappropriate'.",
          },
          {
            role: "user",
            content: text,
          },
        ],
        temperature: 0,
        max_tokens: 10,
      }),
    });

    if (!res.ok) {
      console.error(
        "[moderation] OpenAI API error:",
        res.status,
        res.statusText
      );
      return true; // fail open
    }

    const data = await res.json();
    const classification = (data.choices?.[0]?.message?.content ?? "")
      .toLowerCase()
      .trim();

    const isAppropriate = classification === "appropriate";
    console.log(
      `[moderation] result: ${isAppropriate ? "appropriate" : "inappropriate"} for review text "${text.slice(0, 50)}"`
    );
    return isAppropriate;
  } catch (err) {
    console.error("[moderation] failed, approving by default:", err);
    return true; // fail open
  }
}
