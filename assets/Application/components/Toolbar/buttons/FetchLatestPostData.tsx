/**
 * FetchLatestPostData.tsx - WordPress Post Sync Button
 *
 * Toolbar button that synchronizes BlogPost blocks with the latest
 * data from WordPress. Updates post titles, excerpts, featured images,
 * and other metadata from the WordPress REST API.
 *
 * Sync Process:
 * 1. Finds all BlogPost blocks in the document
 * 2. Fetches current data for each post's wordpressId
 * 3. Updates block components (Image, Heading, Text) with fresh data
 *
 * Use Cases:
 * - Updating preview after WordPress post edits
 * - Refreshing featured images or excerpts
 * - Bulk updating multiple blog post blocks
 *
 * @module Application/components/Toolbar/buttons
 */
import React, { useState } from 'react';
import { IconButton, Tooltip, CircularProgress } from '@mui/material';
import { Sync as SyncIcon } from '@mui/icons-material';
import useEditorStore from '@/Application/store/editorStore';
import toast from 'react-hot-toast';

export default function FetchLatestPostData() {
  const syncBlogPosts = useEditorStore((state) => state.syncBlogPosts);
  const [isLoading, setIsLoading] = useState(false);

  const handleFetch = async () => {
    setIsLoading(true);
    try {
      await syncBlogPosts();
      toast.success('Latest post data fetched successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch latest post data.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tooltip title={isLoading ? 'Fetching Latest Posts...' : 'Fetch Latest Post Data'}>
      <span>
        <IconButton onClick={handleFetch} disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} /> : <SyncIcon fontSize="small" />}
        </IconButton>
      </span>
    </Tooltip>
  );
};
