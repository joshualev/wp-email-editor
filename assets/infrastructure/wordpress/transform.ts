/**
 * wordpress/transform.ts - WordPress DTO Transformation Layer
 *
 * Transforms WordPress REST API responses (DTOs) into domain objects.
 * Handles the conversion of API-specific data structures to clean
 * domain models used throughout the application.
 *
 * Why Transform?
 * --------------
 * WordPress API responses contain:
 * - Nested structures (title.rendered, _embedded['wp:featuredmedia'])
 * - HTML entities and markup
 * - Optional metadata fields in different locations
 *
 * Domain objects provide:
 * - Flat, predictable structure
 * - Clean text (HTML stripped)
 * - Consistent field names
 * - Optional metadata fields populated when present
 *
 * @module infrastructure/wordpress
 */
import { TWordPressPost } from '@/domain/types'
import { WordPressPostDto } from '@/infrastructure/wordpress/dto';

import { formatDate, stripHtml } from '@/lib/format'

/**
 * Extract featured image URL from embedded media.
 *
 * WordPress embeds media data when ?_embed=true is used.
 * The featured image is the first item in wp:featuredmedia.
 *
 * @param post WordPress post DTO with embedded data
 * @returns Image URL or undefined if no featured image
 */
const getImageUrl = (post: WordPressPostDto): string | undefined => {
  return post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
};

/**
 * Extract common post details shared by all post types.
 *
 * Strips HTML from title and excerpt for clean text display.
 *
 * @param post WordPress post DTO
 * @returns Partial domain object with common fields
 */
const getBaseDetails = (post: WordPressPostDto): Partial<TWordPressPost> => ({
  wordpressId: post.id.toString(),
  postType: post.type,
  permalink: post.link,
  image: getImageUrl(post),
  title: stripHtml(post.title.rendered),
  excerpt: stripHtml(post.excerpt.rendered),
  publish_date: formatDate(post.date),
  meta: post.meta,
});

/**
 * Transform a WordPress post DTO to a domain object.
 *
 * Applies standard transformations and includes optional metadata
 * fields when present in the response.
 *
 * @param post WordPress post DTO from API
 * @returns Transformed domain post object
 */
export const TransformWordPressPostDtoToDomain = (post: WordPressPostDto): TWordPressPost => {
  const baseDetails = getBaseDetails(post);
  return baseDetails as TWordPressPost;
};
