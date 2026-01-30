/**
 * Newsletter.tsx - Main Newsletter Editor Page
 *
 * This is the primary page component that orchestrates the newsletter
 * editor experience. It handles data loading, layout, and coordinates
 * between the editor canvas and inspector drawer.
 *
 * Component Hierarchy:
 * --------------------
 * Newsletter
 * ├── InspectorDrawer     - Right sidebar for block configuration
 * └── Editor              - Main canvas area
 *     ├── Toolbar         - Save button, screen size toggle
 *     └── EditorBlock     - Recursive block renderer
 *
 * Data Flow:
 * ----------
 * 1. TanStack Query fetches newsletter from REST API on mount
 * 2. Data is validated against EditorConfigurationSchema (Zod)
 * 3. Valid data resets the Zustand document store
 * 4. Editor renders blocks from the store
 *
 * Responsive Drawer:
 * ------------------
 * The inspector drawer uses MUI transitions to smoothly animate
 * open/close. The main content area adjusts its margin to accommodate.
 *
 * @module Application/pages
 */
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeyFactory';
import { newsletterApi } from '@/Infrastructure/Newsletter/api';
import useEditorStore from '@/Application/store/editorStore';
import { EditorConfigurationSchema } from '@/Application/components/Editor/editor-core';

import { Box, Stack, useTheme, CircularProgress } from '@mui/material';
import InspectorDrawer, { INSPECTOR_DRAWER_WIDTH } from '@/Application/components/InspectorDrawer';
import Editor from '@/Application/components/Editor/Editor';

/**
 * Creates a CSS transition for drawer-related margin changes.
 *
 * Uses MUI's theme transitions for consistent animation timing.
 *
 * @param cssProperty The CSS property to transition (e.g., 'margin-right')
 * @param open Whether the drawer is currently open
 * @returns CSS transition string
 */
function useDrawerTransition(cssProperty: 'margin-right', open: boolean) {
  const { transitions } = useTheme();
  return transitions.create(cssProperty, {
    easing: !open ? transitions.easing.sharp : transitions.easing.easeOut,
    duration: !open ? transitions.duration.leavingScreen : transitions.duration.enteringScreen,
  });
}

/**
 * Newsletter editor page component.
 *
 * Handles:
 * - Loading newsletter data from the API
 * - Displaying loading/error states
 * - Orchestrating the editor layout
 */
export default function Newsletter() {
  // Access the inspectorDrawerOpen state from uiSlice
  const isInspectorDrawerOpen = useEditorStore((state) => state.isInspectorDrawerOpen);
  const resetDocument = useEditorStore((state) => state.resetDocument);

  const marginRightTransition = useDrawerTransition('margin-right', isInspectorDrawerOpen);

  const { data, isPending, isSuccess, isError, error } = useQuery({
    queryKey: queryKeys.newsletter.fetch,
    queryFn: () => newsletterApi.fetchNewsletter(),
    retry: false,
  });

  // Reset document only once when data is initially fetched
  React.useEffect(() => {
    if (data) {
      const parseResult = EditorConfigurationSchema.safeParse(data);
      if (parseResult.success) {
        resetDocument(parseResult.data);
      } else {
        console.error('Invalid newsletter data:', parseResult.error);
      }
    }
  }, [data, resetDocument]);

  if (isPending) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <div>Error: {error.message}</div>
      </Box>
    );
  }

  if (isSuccess) {
    return (
      <>
        <InspectorDrawer />
        <Stack
          sx={{
            marginRight: isInspectorDrawerOpen ? `${INSPECTOR_DRAWER_WIDTH}px` : 0,
            marginLeft: 0,
            transition: marginRightTransition,
          }}
        >
          <Editor />
        </Stack>
      </>
    );
  }

  return null; // Fallback
}