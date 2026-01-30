/**
 * Infrastructure/types.ts - API Client Type Definitions
 *
 * Defines the core types for the REST API client layer.
 * These types ensure type-safe API communication throughout the app.
 *
 * @module Infrastructure
 */

/**
 * Standard API response wrapper.
 *
 * All API calls return either data or an error, never both.
 * This union type allows for clean error handling:
 *
 * ```ts
 * const response = await api.request<User>({ path: '/users/1', method: 'GET' });
 *
 * if (response.error) {
 *   showError(response.error);
 * } else {
 *   setUser(response.data);
 * }
 * ```
 *
 * @template T The expected response data type
 */
export interface TApiResponse<T = unknown> {
  /** The successful response data (undefined on error) */
  data?: T;
  /** Error message (undefined on success) */
  error?: string;
}

/**
 * Configuration for an API request.
 *
 * Used to specify the endpoint, HTTP method, and optional body data.
 */
export interface TRequestConfig {
  /** The API endpoint path (appended to base URL) */
  path: string;
  /** HTTP method */
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  /** Optional request body data (for POST, PUT, PATCH) */
  data?: unknown;
}

/**
 * Interface for the API client.
 *
 * Defines the contract that any API client implementation must follow.
 */
export interface TApiClientInterface {
  /** Make a typed API request */
  request: <T>(config: TRequestConfig) => Promise<TApiResponse<T>>;
}
