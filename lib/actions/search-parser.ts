'use server';

import { headers } from 'next/headers';
import { serverEnv } from '@/lib/env.server';
import { rateLimit } from '@/lib/rate-limit';
import {
  isSimpleQuery,
  OPENAI_FUNCTION_SCHEMA,
  SYSTEM_PROMPT,
  type SearchParserResult,
} from '@/lib/search-parser-schema';

/** 10 AI search requests per IP per 60 seconds. */
const AI_SEARCH_LIMIT = { windowMs: 60_000, maxRequests: 10 };

export async function parseNaturalQuery(input: string): Promise<SearchParserResult | null> {
  const start = performance.now();
  const actionName = 'parseNaturalQuery';

  const trimmed = input.trim();
  if (!trimmed || isSimpleQuery(trimmed)) {
    console.log(`[action] ${actionName} skipped (simple query)`, { input: trimmed });
    return null;
  }

  // Rate limit by IP before calling OpenAI
  const h = await headers();
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const limit = rateLimit(`ai-search:${ip}`, AI_SEARCH_LIMIT);
  if (!limit.success) {
    console.warn(`[action] ${actionName} rate limited`, { ip, retryAfterMs: limit.retryAfterMs });
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

    const parsed: SearchParserResult = JSON.parse(toolCall.function.arguments);

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
