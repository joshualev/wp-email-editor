/**
 * NewsletterPublish.tsx - Save/Publish Newsletter Button
 *
 * Toolbar button that saves the current newsletter configuration to
 * the HubSpot Custom Object table. Validates BlogPost blocks before
 * saving to ensure all posts have valid WordPress IDs.
 *
 * Validation:
 * - Checks all BlogPost blocks have wordpressId and postType
 * - Displays error toast if validation fails
 *
 * API Integration:
 * - Uses newsletterApi.updateNewsletter() to persist changes
 * - Shows loading state during API call
 * - Displays success/error toasts for user feedback
 *
 * @module Application/components/Toolbar/buttons
 */
import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { SaveOutlined } from '@mui/icons-material';
import toast from 'react-hot-toast';

import type { TEditorConfiguration } from '@/Application/components/Editor/editor-core';
import useEditorStore from '@/Application/store/editorStore';
import { newsletterApi } from '@/Infrastructure/Newsletter/api';
import { queryKeys } from '@/lib/queryKeyFactory';
import { useMutation } from '@tanstack/react-query';

export default function SaveNewsletter() {
  const document = useEditorStore((state) => state.document);
  const isHubSpotConfigured = useEditorStore((state) => state.isHubSpotConfigured);

  const validateBlogPosts = () => {
    const blogPosts = Object.values(document).filter((block) => block.type === 'BlogPost');

    for (const post of blogPosts) {
      if (!post.data.wordpressId || !post.data.postType) {
        return {
          isValid: false,
          error: `Invalid blog post configuration: Missing ${!post.data.wordpressId ? ' wordpressId' : ' postType'}`
        };
      }
    }
    return { isValid: true };
  };

  const { mutate, isPending } = useMutation({
    mutationKey: queryKeys.newsletter.mutations.update,
    mutationFn: (document: TEditorConfiguration) => {
      return newsletterApi.updateNewsletter(document);
    },
    onSuccess: () => {
      toast.success('Newsletter saved successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to save newsletter');
    },
  });

  const handleSave = React.useCallback(() => {
    const validation = validateBlogPosts();
    if (validation.isValid) {
      mutate(document);
    } else {
      toast.error(validation.error || 'Invalid blog post configuration');
    }
  }, [document, mutate]);

  return (
    <Tooltip
      title={
        isPending
          ? 'Saving...'
          : isHubSpotConfigured
            ? 'Save Newsletter'
            : 'Connect HubSpot HubDB to enable saving'
      }
    >
      <span>
        <IconButton onClick={handleSave} disabled={isPending || !isHubSpotConfigured}>
          <SaveOutlined fontSize="small" />
        </IconButton>
      </span>
    </Tooltip>
  );
};
