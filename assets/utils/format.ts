/**
 * utils/format.ts - String and Date Formatting Utilities
 *
 * Provides helper functions for formatting and sanitizing data.
 * Used primarily when transforming WordPress API responses.
 *
 * @module utils
 */

/**
 * Format an ISO date string to YYYY-MM-DD format.
 *
 * Converts full ISO timestamps to simple date strings suitable
 * for display in the newsletter.
 *
 * @example
 * formatDate('2024-01-15T10:30:00Z')  // '2024-01-15'
 * formatDate(undefined)                // undefined
 *
 * @param date ISO 8601 date string or undefined
 * @returns Formatted date string or undefined
 */
export const formatDate = (date?: string): string | undefined =>
  date ? new Date(date).toISOString().split('T')[0] : undefined;

/**
 * Decode HTML entities in a string.
 *
 * WordPress often returns text with HTML entities like:
 * - &nbsp; (non-breaking space)
 * - &hellip; (ellipsis)
 * - &amp; (ampersand)
 * - &#8217; (right single quote)
 *
 * This function decodes them to their actual characters.
 *
 * @example
 * decodeHtmlEntities('Hello&nbsp;World')  // 'Hello World'
 * decodeHtmlEntities('Rock &amp; Roll')    // 'Rock & Roll'
 *
 * @param text String containing HTML entities
 * @returns String with decoded characters
 */
export const decodeHtmlEntities = (text: string): string => {
  // Use a textarea element to leverage browser's HTML parsing
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
};

/**
 * Remove HTML tags and decode entities from a string.
 *
 * Useful for extracting clean text from WordPress content
 * fields like title.rendered and excerpt.rendered.
 *
 * @example
 * stripHtml('<p>Hello <strong>World</strong></p>')  // 'Hello World'
 * stripHtml('<a href="#">Link&nbsp;Text</a>')       // 'Link Text'
 *
 * @param html String containing HTML markup
 * @returns Plain text with HTML removed and entities decoded
 */
export const stripHtml = (html: string): string => {
  // Remove all HTML tags using regex
  const stripped = html.replace(/<\/?[^>]+(>|$)/g, "").trim();
  // Then decode any remaining HTML entities
  return decodeHtmlEntities(stripped);
};
