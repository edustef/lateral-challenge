import { describe, it, expect } from 'vitest';
import { sanitizeSearchInput } from './search-parser-schema';

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
