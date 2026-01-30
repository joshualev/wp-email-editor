/**
 * queryKeyFactory.ts - TanStack Query Key Management
 *
 * Centralized query key definitions for TanStack Query (React Query).
 * Using a factory pattern ensures consistent cache keys across the app
 * and prevents key collisions.
 *
 * Why Query Keys Matter:
 * ----------------------
 * TanStack Query uses keys to:
 * - Cache and deduplicate requests
 * - Invalidate related queries
 * - Identify queries for refetching
 *
 * Key Structure:
 * --------------
 * Keys are arrays that become more specific with each element:
 * - ['newsletter'] - all newsletter queries
 * - ['newsletter', 'fetch'] - just the fetch query
 * - ['wordpress', 'posts', 'post', 'search'] - specific search
 *
 * Usage:
 * ------
 * ```ts
 * // In a query hook:
 * useQuery({
 *   queryKey: queryKeys.newsletter.fetch,
 *   queryFn: () => newsletterApi.fetchNewsletter()
 * });
 *
 * // Invalidating cache:
 * queryClient.invalidateQueries({ queryKey: queryKeys.newsletter.all });
 * ```
 *
 * @module lib
 */
export const queryKeys = {
  /** Newsletter-related query keys */
  newsletter: {
    /** Base key for all newsletter queries */
    all: ['newsletter'],
    /** Key for fetching newsletter data */
    fetch: ['newsletter', 'fetch'],
    /** Keys for mutation operations */
    mutations: {
      validate: ['newsletter', 'auth', 'validate'],
      create: ['newsletter', 'create'],
      update: ['newsletter', 'update']
    }
  },
  /** Settings-related query keys */
  settings: {
    all: ['settings']
  },
  /** WordPress API query keys */
  wordpress: {
    /** Dynamic key for post searches (varies by type and query) */
    posts: (postType: string, searchQuery: string) => ['wordpress', 'posts', postType, searchQuery],
    /** Key for fetching available post types */
    postTypes: ['wordpress', 'postTypes']
  }
} as const;