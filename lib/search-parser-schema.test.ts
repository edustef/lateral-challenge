import { describe, it, expect } from 'vitest';
import { isSimpleQuery, sanitizeSearchInput } from './search-parser-schema';

describe('isSimpleQuery', () => {
  it('returns true for single word', () => {
    expect(isSimpleQuery('treehouse')).toBe(true);
  });

  it('returns true for two words without trigger words', () => {
    expect(isSimpleQuery('Asheville NC')).toBe(true);
  });

  it('returns true for "hot tub" (no trigger words)', () => {
    expect(isSimpleQuery('hot tub')).toBe(true);
  });

  it('returns false for queries with digits', () => {
    expect(isSimpleQuery('under 200')).toBe(false);
  });

  it('returns false for queries with price symbols', () => {
    expect(isSimpleQuery('cabin $200')).toBe(false);
  });

  it('returns false for queries with trigger words', () => {
    expect(isSimpleQuery('cabin with hot tub')).toBe(false);
  });

  it('returns false for queries with 3+ words', () => {
    expect(isSimpleQuery('cozy mountain cabin')).toBe(false);
  });

  it('returns false for questions', () => {
    expect(isSimpleQuery('where can I stay')).toBe(false);
  });

  it('returns true for empty string', () => {
    expect(isSimpleQuery('')).toBe(true);
  });

  it('handles extra whitespace', () => {
    expect(isSimpleQuery('  treehouse  ')).toBe(true);
  });
});

describe('sanitizeSearchInput', () => {
  it('escapes percent signs', () => {
    expect(sanitizeSearchInput('100%')).toBe('100\\%');
  });

  it('escapes underscores', () => {
    expect(sanitizeSearchInput('my_cabin')).toBe('my\\_cabin');
  });

  it('passes normal text through', () => {
    expect(sanitizeSearchInput('treehouse')).toBe('treehouse');
  });

  it('truncates to 500 characters', () => {
    const long = 'a'.repeat(600);
    expect(sanitizeSearchInput(long).length).toBe(500);
  });
});
