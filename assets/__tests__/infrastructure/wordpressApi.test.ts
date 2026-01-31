import { beforeEach, describe, expect, it, vi } from 'vitest';

let capturedBaseUrl: string | null = null;
const requestMock = vi.fn();

vi.mock('@/infrastructure/client', () => ({
  createApiClient: (baseUrl: string) => {
    capturedBaseUrl = baseUrl;
    return { request: requestMock };
  }
}));

describe('wordpressApi', () => {
  beforeEach(() => {
    capturedBaseUrl = null;
    requestMock.mockReset();
    vi.resetModules();
  });

  it('merges settings updates without dropping existing fields', async () => {
    requestMock
      .mockResolvedValueOnce({
        data: {
          'wp-hubspot-edm-editor_data': {
            hubspotAccessToken: 'old-token',
            postTypes: ['post']
          }
        }
      })
      .mockResolvedValueOnce({ data: {} });

    const { wordpressApi } = await import('@/infrastructure/wordpress/api');
    await wordpressApi.updateSettings({ hubspotAccessToken: 'new-token' });

    expect(capturedBaseUrl).toBe('wp/v2');
    expect(requestMock).toHaveBeenCalledTimes(2);
    expect(requestMock.mock.calls[1][0]).toEqual({
      path: '/settings',
      method: 'POST',
      data: {
        'wp-hubspot-edm-editor_data': {
          hubspotAccessToken: 'new-token',
          postTypes: ['post']
        }
      }
    });
  });
});
