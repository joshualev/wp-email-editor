import { beforeEach, describe, expect, it, vi } from 'vitest';

let capturedBaseUrl: string | null = null;
const requestMock = vi.fn();

vi.mock('@/Infrastructure/client', () => ({
  createApiClient: (baseUrl: string) => {
    capturedBaseUrl = baseUrl;
    return { request: requestMock };
  }
}));

describe('newsletterApi', () => {
  beforeEach(() => {
    capturedBaseUrl = null;
    requestMock.mockReset();
    vi.resetModules();
  });

  it('uses the wp-hubspot-edm-editor namespace and correct fetch path', async () => {
    requestMock.mockResolvedValueOnce({ data: {} });

    const { newsletterApi } = await import('@/Infrastructure/Newsletter/api');
    await newsletterApi.fetchNewsletter();

    expect(capturedBaseUrl).toBe('/wp-hubspot-edm-editor/v1');
    expect(requestMock).toHaveBeenCalledWith({
      path: '/newsletter/fetch',
      method: 'GET'
    });
  });
});
