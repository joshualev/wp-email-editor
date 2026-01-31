/**
 * newsletter/api.ts - Newsletter API Client
 *
 * Provides methods for communicating with the newsletter REST API endpoints.
 * This is the primary interface between the React frontend and the PHP backend.
 *
 * Endpoint Mapping:
 * -----------------
 * | Method            | Endpoint                  | Description               |
 * |-------------------|---------------------------|---------------------------|
 * | validateApiKey    | POST /newsletter/validate | Validate HubSpot API key  |
 * | createNewsletter  | POST /newsletter/create   | Create HubDB table        |
 * | fetchNewsletter   | GET  /newsletter/fetch    | Load newsletter data      |
 * | updateNewsletter  | POST /newsletter/update   | Save newsletter to HubDB  |
 *
 * Data Flow (Save):
 * -----------------
 * 1. Editor calls updateNewsletter(config)
 * 2. Transform converts blocks to HubDB row format
 * 3. API sends to WordPress REST endpoint
 * 4. PHP controller syncs with HubSpot HubDB
 *
 * @see newsletterTransform For data transformation
 * @see NewsletterController (PHP) For backend handling
 * @module infrastructure/newsletter
 */
import type { TEditorConfiguration } from '@/application/components/editor/editor-core';

import { createApiClient } from '@/infrastructure/client';
import { newsletterTransform } from '@/infrastructure/newsletter/transform';
import type { NewsletterTypes } from '@/infrastructure/newsletter/types';

/** API client configured for the newsletter REST namespace */
const api = createApiClient(`/wp-hubspot-edm-editor/v1`);

/**
 * Newsletter API methods.
 *
 * Each method corresponds to a REST endpoint and handles
 * request formatting and response parsing.
 */
export const newsletterApi = {
  /**
   * Validate a HubSpot API key.
   * Stores the key in WordPress options if valid.
   */
  validateApiKey: (apiKey: string) =>
    api.request<void>({
      path: '/newsletter/validate',
      method: 'POST',
      data: { apiKey }
    }),

  /**
   * Create a new HubDB table for newsletter storage.
   * @param params Table name and label
   */
  createNewsletter: (params: NewsletterTypes['CreateParams']) =>
    api.request({
      path: '/newsletter/create',
      method: 'POST',
      data: params
    }),

  /**
   * Fetch the current newsletter configuration from HubDB.
   * Returns the document in editor format.
   */
  fetchNewsletter: () =>
    api.request<TEditorConfiguration>({
      path: '/newsletter/fetch',
      method: 'GET'
    }).then(response => response.data || response),

  /**
   * Save the newsletter configuration to HubDB.
   * Transforms the editor config to HubDB row format before sending.
   */
  updateNewsletter: async (config: TEditorConfiguration) => {
    // Transform editor blocks to HubDB row format
    const payload = newsletterTransform.toPayload(config);

    return api.request({
      path: '/newsletter/update',
      method: 'POST',
      data: payload
    });
  }
};
