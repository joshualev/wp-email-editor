/**
 * Toolbar/index.tsx - Main Editor Toolbar Component
 *
 * Provides the primary toolbar for the EDM editor interface, positioned
 * at the top of the editor area. Contains action buttons and view controls.
 *
 * Features:
 * - Newsletter settings and publish actions
 * - Blog post data synchronization
 * - Responsive preview toggle (desktop/mobile)
 * - Inspector drawer visibility control
 *
 * Behavior:
 * - Toolbar is sticky positioned below the WordPress admin bar
 * - Inspector toggle is hidden when in mobile preview mode
 * - Screen size toggle affects all editor block rendering
 *
 * @module application/components/toolbar
 */
import React from 'react';
import { MonitorOutlined, PhoneIphoneOutlined, AppRegistrationOutlined, LastPageOutlined } from '@mui/icons-material';
import { Stack, ToggleButton, ToggleButtonGroup, Tooltip, IconButton } from '@mui/material';

import useEditorStore from '@/application/store/editorStore';

import { NewsletterPublish, NewsletterSettings, FetchLatestPostData } from './buttons';

function ToggleInspectorPanelButton() {
  const isInspectorDrawerOpen = useEditorStore(state => state.isInspectorDrawerOpen);
  const toggleInspectorDrawer = useEditorStore(state => state.toggleInspectorDrawer);
  const selectedScreenSize = useEditorStore(state => state.selectedScreenSize);
  const isMobileView = selectedScreenSize === 'mobile';

  const handleClick = () => {
    if (!isMobileView) {
      toggleInspectorDrawer();
    }
  };

  // Hide the button entirely when in mobile view
  if (isMobileView) {
    return null;
  }

  return (
    <IconButton onClick={handleClick}>
      {isInspectorDrawerOpen ? (
        <LastPageOutlined fontSize="small" />
      ) : (
        <AppRegistrationOutlined fontSize="small" />
      )}
    </IconButton>
  );
}

export default function Toolbar() {
  const selectedScreenSize = useEditorStore(state => state.selectedScreenSize);
  const setSelectedScreenSize = useEditorStore(state => state.setSelectedScreenSize);

  const handleScreenSizeChange = (_: unknown, value: 'desktop' | 'mobile' | null) => {
    if (value) {
      setSelectedScreenSize(value);
    } else {
      setSelectedScreenSize('desktop');
    }
  };

  return (
    <Stack
      sx={{
        height: 49,
        borderBottom: 1,
        borderColor: 'divider',
        backgroundColor: 'white',
        position: 'sticky',
        top: 32,
        zIndex: 'appBar',
        px: 1,
      }}
      direction="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <Stack
        px={2}
        direction="row"
        gap={2}
        width="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Stack direction="row" spacing={2}>
          <NewsletterSettings />
          <NewsletterPublish />
          <FetchLatestPostData />
        </Stack>

        <Stack direction="row" spacing={2}>
          <ToggleButtonGroup
            value={selectedScreenSize}
            exclusive
            size="small"
            onChange={handleScreenSizeChange}
          >
            <ToggleButton value="desktop">
              <Tooltip title="Desktop view">
                <MonitorOutlined fontSize="small" />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="mobile">
              <Tooltip title="Mobile view">
                <PhoneIphoneOutlined fontSize="small" />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Stack>
      <ToggleInspectorPanelButton />
    </Stack>
  );
}