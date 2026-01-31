/**
 * Wordpress/dto.ts - WordPress REST API Data Transfer Objects
 *
 * Defines TypeScript interfaces that match the WordPress REST API
 * response shapes. These DTOs represent the raw API data before
 * transformation to domain objects.
 *
 * DTO Pattern:
 * ------------
 * DTOs (Data Transfer Objects) are used to:
 * - Type the raw API responses
 * - Decouple internal types from external API shapes
 * - Enable safe transformation to domain objects
 *
 * The transform layer converts these DTOs to domain types.
 *
 * @see TransformWordPressPostDtoToDomain For DTO → domain conversion
 * @module Infrastructure/WordPress
 */

/**
 * WordPress post type identifier.
 * Matches the post type slug (e.g., 'post', 'page', 'tribe_events').
 */
export type TWordPressPostType = string;

/**
 * WordPress post type definition from /wp/v2/types endpoint.
 */
export interface WordPressPostTypeDto {
  /** Post type slug (e.g., 'post', 'tribe_events') */
  slug: string;
  /** Human-readable name (e.g., 'Posts', 'Events') */
  name: string;
  /** REST API base path (e.g., 'posts', 'tribe_events') */
  rest_base: string;
}

/**
 * WordPress post data from /wp/v2/{post_type} endpoint.
 *
 * Uses `_embed=true` to include featured media data.
 * The `meta` field includes custom fields from plugins like
 * The Events Calendar.
 */
export interface WordPressPostDto {
  /** WordPress post ID */
  id: number;
  /** Post type slug */
  type: TWordPressPostType;
  /** Post title (contains HTML entities) */
  title: {
    rendered: string;
  };
  /** Post excerpt (contains HTML) */
  excerpt: {
    rendered: string;
  };
  /** Embedded data (requires ?_embed=true) */
  _embedded?: {
    /** Featured image data */
    'wp:featuredmedia'?: Array<{
      source_url: string;
    }>;
  };
  /** Post permalink URL */
  link: string;
  /** Post publish date (ISO 8601 format) */
  date: string;
  /** Custom post meta fields */
  meta?: {
    /** The Events Calendar: event start date */
    _EventStartDate?: string;
    /** The Events Calendar: event end date */
    _EventEndDate?: string;
  };
}

/**
 * WordPress settings object structure.
 *
 * The plugin stores its settings under a namespaced key to avoid
 * conflicts with other plugins.
 */
export interface WordPressSettingsDto {
  'wp-hubspot-edm-editor_data': {
    /** HubSpot Private App access token */
    hubspotAccessToken?: string;
    /** HubDB table ID for newsletter storage */
    hubspotHubDBTableId?: string;
    /** HubDB table name */
    hubspotHubDBTableName?: string;
    /** Enabled WordPress post types */
    postTypes?: string[];
  };
}
