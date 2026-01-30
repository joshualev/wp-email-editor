/**
 * Wordpress/api.ts - WordPress REST API Client
 *
 * Provides methods for communicating with the WordPress REST API.
 * Used primarily for fetching posts and post types to embed in
 * BlogPost blocks.
 *
 * API Endpoints Used:
 * -------------------
 * - GET /wp/v2/{post_type} - Fetch posts with optional search
 * - GET /wp/v2/types - Get available post types
 * - GET/POST /wp/v2/settings - Plugin settings (uses WordPress Settings API)
 *
 * Post Type Support:
 * ------------------
 * The app supports multiple WordPress post types:
 * - post: Standard blog posts
 * - whats-hot: Custom featured content
 * - sponsored_content: Sponsored articles
 * - tribe_events: The Events Calendar events
 *
 * @module Infrastructure/Wordpress
 */
import { TWordPressPostType, WordPressPostDto, WordPressPostTypeDto } from '@/Infrastructure/Wordpress/dto';
import { TransformWordPressPostDtoToDomain } from '@/Infrastructure/Wordpress/transform';
import { createApiClient } from '@/Infrastructure/client';

/** API client configured for WordPress REST API v2 */
const api = createApiClient('wp/v2');

/**
 * Post types to exclude from the available types list.
 * These are WordPress internal types not suitable for newsletter content.
 */
const EXCLUDED_POST_TYPES = [
  'page',
  'attachment',
  'nav_menu_item',
  'wp_block',
  'wp_template',
  'wp_template_part',
  'wp_navigation',
  'wp_font_family',
  'wp_font_face',
  'wp_global_styles',
  'revision',
  'custom_css',
  'customize_changeset',
  'oembed_cache',
  'user_request',
  'wp_pattern'
];

/**
 * WordPress REST API methods.
 */
export const wordpressApi = {
  /**
   * Get plugin settings from WordPress.
   * Uses the Settings API endpoint.
   */
  getSettings: () =>
    api.request<unknown>({
      path: '/settings',
      method: 'GET'
    }),

  /**
   * Update plugin settings in WordPress.
   * Merges with existing settings to prevent data loss.
   */
  updateSettings: async (settings: any) => {
    // Fetch current settings to merge with new values
    const currentSettings = await wordpressApi.getSettings();
    const currentData = (currentSettings.data as Record<string, any>)?.["wp-hubspot-edm-editor_data"] || {};

    const updatedSettings = {
      "wp-hubspot-edm-editor_data": {
        ...currentData,
        ...settings
      }
    };

    return api.request<unknown>({
      path: '/settings',
      method: 'POST',
      data: updatedSettings
    });
  },

  /**
   * Fetch posts with optional search query.
   *
   * Uses `_embed=true` to include featured images and other embedded data.
   * Transforms WordPress DTOs to domain objects.
   *
   * @param searchQuery Optional search string
   * @param postType The WordPress post type to fetch
   * @returns Array of transformed post objects
   */
  fetchPosts: (searchQuery: string | null, postType: TWordPressPostType) =>
    api.request<WordPressPostDto[]>({
      path: `/${postType}?per_page=20&_embed=true${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}`,
      method: 'GET'
    }).then(response => {
      if (response.error) return [];
      return Array.isArray(response.data)
        ? response.data.map(TransformWordPressPostDtoToDomain)
        : [];
    }),

  /**
   * Fetch multiple posts by their IDs.
   *
   * Used when syncing BlogPost blocks to refresh post data.
   *
   * @param postIds Array of WordPress post IDs
   * @param postType The WordPress post type
   * @returns Array of transformed post objects
   */
  fetchAllPosts: (postIds: number[], postType: TWordPressPostType) =>
    api.request<WordPressPostDto[]>({
      path: `/${postType}?include=${postIds.join(',')}&_embed=true&per_page=${postIds.length}`,
      method: 'GET'
    }).then(response => {
      if (response.error) return [];
      return Array.isArray(response.data)
        ? response.data.map(TransformWordPressPostDtoToDomain)
        : [];
    }),

  /**
   * Fetch available post types for the BlogPost block selector.
   *
   * Filters out WordPress internal types that aren't suitable
   * for newsletter content.
   *
   * @returns Array of post type definitions
   */
  fetchPostTypes: () =>
    api.request<WordPressPostTypeDto[]>({
      path: '/types',
      method: 'GET'
    }).then(response => {
      if (response.error) return [];
      // Response is an object, not array - convert to array and filter
      const types = Object.values(response.data as Record<string, WordPressPostTypeDto>);
      return types
        .filter(type => !EXCLUDED_POST_TYPES.includes(type.slug))
        .map(type => ({
          slug: type.slug,
          name: type.name,
          restBase: type.rest_base
        }));
    })
};
