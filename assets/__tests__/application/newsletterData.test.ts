import { describe, expect, it } from 'vitest';

import { normalizeNewsletterData } from '@/Application/utils/newsletterData';
import { EMPTY_DOCUMENT } from '@/Application/store/slices/documentSlice';

const fallback = EMPTY_DOCUMENT;

describe('normalizeNewsletterData', () => {
  it('treats empty arrays as empty newsletters', () => {
    const result = normalizeNewsletterData([], fallback);
    expect(result.status).toBe('empty');
    expect(result.document).toBe(fallback);
  });

  it('treats error responses as unconfigured', () => {
    const result = normalizeNewsletterData({ error: 'Missing HubDB table' }, fallback);
    expect(result.status).toBe('unconfigured');
    expect(result.document).toBe(fallback);
  });

  it('accepts valid newsletter configurations', () => {
    const result = normalizeNewsletterData(fallback, fallback);
    expect(result.status).toBe('configured');
  });

  it('falls back on invalid data without throwing', () => {
    const result = normalizeNewsletterData({ foo: 'bar' }, fallback);
    expect(result.status).toBe('invalid');
    expect(result.document).toBe(fallback);
  });
});
