/**
 * Wordpress/transform.ts - WordPress DTO Transformation Layer
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
 * - Post-type-specific fields in different locations
 *
 * Domain objects provide:
 * - Flat, predictable structure
 * - Clean text (HTML stripped)
 * - Consistent field names
 * - Type-specific fields populated appropriately
 *
 * Post Type Handling:
 * -------------------
 * Different post types have different fields:
 * - posts: Standard date field
 * - sponsored_content: Sponsor name field
 * - tribe_events: Event start/end dates from meta
 *
 * @module Infrastructure/Wordpress
 */
import { TWordPressPost } from '@/Domain/types'
import { WordPressPostDto } from '@/Infrastructure/Wordpress/dto';

import { formatDate, stripHtml } from '@/utils/format'

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
});

/**
 * Add standard post date field.
 * @param baseDetails Partial domain object to extend
 * @param post WordPress post DTO
 */
const addPostDetails = (baseDetails: Partial<TWordPressPost>, post: WordPressPostDto): void => {
  baseDetails.date = formatDate(post.date);
};

/**
 * Add sponsored content specific fields.
 * @param baseDetails Partial domain object to extend
 */
const addSponsoredContentDetails = (baseDetails: Partial<TWordPressPost>): void => {
  baseDetails.sponsor_name = 'to be added';
};

/**
 * Add event-specific date fields from The Events Calendar meta.
 * @param baseDetails Partial domain object to extend
 * @param post WordPress post DTO with event meta
 */
const addEventDetails = (baseDetails: Partial<TWordPressPost>, post: WordPressPostDto): void => {
  baseDetails.event_start_date = formatDate(post.meta?._EventStartDate);
  baseDetails.event_end_date = formatDate(post.meta?._EventEndDate);
};

/**
 * Transform a WordPress post DTO to a domain object.
 *
 * Applies post-type-specific transformations to include
 * the relevant fields for each content type.
 *
 * @param post WordPress post DTO from API
 * @returns Transformed domain post object
 */
export const TransformWordPressPostDtoToDomain = (post: WordPressPostDto): TWordPressPost => {
  const baseDetails = getBaseDetails(post);

  // Apply post-type-specific field additions
  switch (post.type) {
    case 'posts':
      addPostDetails(baseDetails, post);
      break;
    case 'sponsored_content':
      addPostDetails(baseDetails, post);
      addSponsoredContentDetails(baseDetails);
      break;
    case 'tribe_events':
      addEventDetails(baseDetails, post);
      break;
  }

  return baseDetails as TWordPressPost;
};
