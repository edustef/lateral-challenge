'use server';

import { headers } from 'next/headers';
import { serverEnv } from '@/lib/env.server';
import { logger } from '@/lib/logger';
import { rateLimit } from '@/lib/rate-limit';
import {
  OPENAI_FUNCTION_SCHEMA,
  SYSTEM_PROMPT,
  type SearchParserResult,
} from '@/lib/search-parser-schema';

/** 10 AI search requests per IP per 60 seconds. */
const AI_SEARCH_LIMIT = { windowMs: 60_000, maxRequests: 10 };

export async function parseNaturalQuery(input: string): Promise<SearchParserResult | null> {
  const log = logger('parseNaturalQuery');

  const trimmed = input.trim();
  if (!trimmed) {
    log.info('skipped (empty query)');
    return null;
  }

  // Rate limit by IP before calling OpenAI
  const h = await headers();
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const limit = rateLimit(`ai-search:${ip}`, AI_SEARCH_LIMIT);
  if (!limit.success) {
    log.warn('rate limited', { ip, retryAfterMs: limit.retryAfterMs });
    return null;
  }

  const truncated = trimmed.slice(0, 500);

  try {
    log.info('start', { input: truncated.slice(0, 80) });

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
      log.error('API error', { status: res.status, statusText: res.statusText });
      return null;
    }

    const data = await res.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      log.error('no tool call in response');
      return null;
    }

    const parsed: SearchParserResult = JSON.parse(toolCall.function.arguments);

    log.info('ok', { duration: log.elapsed(), result: parsed });

    return parsed;
  } catch (err) {
    log.error('failed, falling back to text search', {
      duration: log.elapsed(),
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  }
}
