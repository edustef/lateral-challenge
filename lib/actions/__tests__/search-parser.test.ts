import { describe, it, expect, vi, beforeEach } from 'vitest';
import { parseNaturalQuery } from '../search-parser';

// Mock the global fetch
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

// Mock the server env
vi.mock('@/lib/env.server', () => ({
  serverEnv: { openaiApiKey: 'test-key' },
}));

function mockOpenAIResponse(args: Record<string, unknown>) {
  return {
    ok: true,
    json: async () => ({
      choices: [{
        message: {
          tool_calls: [{
            function: { arguments: JSON.stringify(args) },
          }],
        },
      }],
    }),
  };
}

beforeEach(() => {
  mockFetch.mockReset();
});

describe('parseNaturalQuery', () => {
  it('returns null for simple queries', async () => {
    const result = await parseNaturalQuery('treehouse');
    expect(result).toBeNull();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('calls OpenAI for complex queries and returns parsed result', async () => {
    mockFetch.mockResolvedValueOnce(mockOpenAIResponse({
      stay_type: 'cabin',
      tags: ['romantic', 'off-grid'],
      travel_type: 'duo',
      max_price: 150,
      amenities: ['hot-tub'],
      locations: null,
      countries: null,
      sort: null,
      summary: 'Cozy cabins for two under $150/night with a hot tub',
    }));

    const result = await parseNaturalQuery('romantic cabin with hot tub under $150');
    expect(result).toEqual({
      stay_type: 'cabin',
      tags: ['romantic', 'off-grid'],
      travel_type: 'duo',
      max_price: 150,
      amenities: ['hot-tub'],
      locations: null,
      countries: null,
      sort: null,
      summary: 'Cozy cabins for two under $150/night with a hot tub',
    });
  });

  it('falls back to null on API error', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500, statusText: 'Internal Server Error' });

    const result = await parseNaturalQuery('cabin with hot tub under $200');
    expect(result).toBeNull();
  });

  it('falls back to null on network error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await parseNaturalQuery('cabin with hot tub under $200');
    expect(result).toBeNull();
  });

  it('truncates input longer than 500 chars', async () => {
    const longInput = 'find me a cabin ' + 'a'.repeat(600);
    mockFetch.mockResolvedValueOnce(mockOpenAIResponse({
      stay_type: 'cabin',
      summary: 'Cabins',
    }));

    await parseNaturalQuery(longInput);

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    const userMessage = body.messages[1].content;
    expect(userMessage.length).toBeLessThanOrEqual(500);
  });
});
