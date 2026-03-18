'use server';

import { serverEnv } from '@/lib/env.server';
import {
  isSimpleQuery,
  OPENAI_FUNCTION_SCHEMA,
  SYSTEM_PROMPT,
  type ConciergeResult,
} from '@/lib/concierge-schema';

export async function parseNaturalQuery(input: string): Promise<ConciergeResult | null> {
  const start = performance.now();
  const actionName = 'parseNaturalQuery';

  const trimmed = input.trim();
  if (!trimmed || isSimpleQuery(trimmed)) {
    console.log(`[action] ${actionName} skipped (simple query)`, { input: trimmed });
    return null;
  }

  const truncated = trimmed.slice(0, 500);

  try {
    console.log(`[action] ${actionName} start`, { input: truncated.slice(0, 80) });

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${serverEnv.openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: truncated },
        ],
        tools: [{ type: 'function', function: OPENAI_FUNCTION_SCHEMA }],
        tool_choice: { type: 'function', function: { name: 'extract_search_filters' } },
        temperature: 0,
      }),
    });

    if (!res.ok) {
      console.error(`[action] ${actionName} API error:`, res.status, res.statusText);
      return null;
    }

    const data = await res.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      console.error(`[action] ${actionName} no tool call in response`);
      return null;
    }

    const parsed: ConciergeResult = JSON.parse(toolCall.function.arguments);

    console.log(`[action] ${actionName} ok`, {
      duration: Math.round(performance.now() - start) + 'ms',
      result: parsed,
    });

    return parsed;
  } catch (err) {
    console.error(`[action] ${actionName} error, falling back to text search`, {
      duration: Math.round(performance.now() - start) + 'ms',
      error: err,
    });
    return null;
  }
}
