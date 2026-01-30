/**
 * client.ts - API Client Factory
 *
 * Creates a typed API client for communicating with the WordPress REST API.
 * Uses WordPress's built-in apiFetch which automatically handles:
 * - Nonce authentication
 * - Base URL resolution
 * - CSRF protection
 *
 * Usage:
 * ------
 * ```ts
 * const api = createApiClient('/my-plugin/v1');
 *
 * const response = await api.request<UserData>({
 *   path: '/users/1',
 *   method: 'GET'
 * });
 *
 * if (response.data) {
 *   console.log(response.data.name);
 * } else {
 *   console.error(response.error);
 * }
 * ```
 *
 * @module Infrastructure
 */
import apiFetch from '@wordpress/api-fetch';
import { TRequestConfig, TApiResponse } from './types';

/**
 * Creates an API client bound to a specific base URL.
 *
 * The returned client provides a type-safe `request` method that
 * wraps WordPress's apiFetch with consistent error handling.
 *
 * @param baseUrl The REST API namespace (e.g., '/my-plugin/v1')
 * @returns An API client with a typed request method
 */
export const createApiClient = (baseUrl: string) => {
  /**
   * Make a REST API request.
   *
   * @param config Request configuration (path, method, data)
   * @returns Promise resolving to either { data } or { error }
   */
  const request = async <T>({ path, method, data }: TRequestConfig): Promise<TApiResponse<T>> => {
    try {
      const response = await apiFetch({
        path: `${baseUrl}${path}`,
        method,
        data
      });

      return { data: response as T };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'API request failed';
      return { error: errorMessage };
    }
  };

  return { request };
};
