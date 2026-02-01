/**
 * InspectorDrawer.tsx - Side Panel Inspector Component
 *
 * A persistent drawer on the right side of the editor that provides
 * block configuration and styling controls. Contains tabbed panels
 * for different editing modes.
 *
 * Tabs:
 * - Styles: Global email layout settings (EmailLayoutBlockForm)
 * - Inspect: Selected block configuration (type-specific forms)
 * - Code: JSON view of document structure (read-only)
 *
 * Behavior:
 * - Automatically hides when in mobile preview mode
 * - Width is fixed at 350px when open
 * - Positioned below WordPress admin bar (top: 32px)
 * - Persists open/closed state in editor store
 *
 * @module application/components/inspector-drawer
 */
import React from 'react';

import { Box, Drawer, Tab, Tabs } from '@mui/material';

import useEditorStore from '@/application/store/editorStore';

import ConfigurationPanel from './panels/ConfigurationPanel';
import StylesPanel from './panels/StylesPanel';
import JsonPanel from './panels/JsonPanel'

export const INSPECTOR_DRAWER_WIDTH = 350;

export default function InspectorDrawer() {
  const selectedSidebarTab = useEditorStore(state => state.selectedSidebarTab);
  const isInspectorDrawerOpen = useEditorStore(state => state.isInspectorDrawerOpen);
  const selectedScreenSize = useEditorStore(state => state.selectedScreenSize);
  const setSidebarTab = useEditorStore(state => state.setSidebarTab);

  // Hide drawer when in mobile preview mode
  if (selectedScreenSize === 'mobile') {
    return null;
  }

  const renderCurrentBlockForm = () => {
    switch (selectedSidebarTab) {
      case 'block-configuration':
        return <ConfigurationPanel />;
      case 'styles':
        return <StylesPanel />;
      case 'json':
        return <JsonPanel />;
      default:
        return null
    }
  };

  return (
    <Drawer
      variant="persistent"
      anchor="right"
      open={isInspectorDrawerOpen}
      sx={{
        width: isInspectorDrawerOpen ? INSPECTOR_DRAWER_WIDTH : 0,
        '& .MuiDrawer-paper': {
          width: INSPECTOR_DRAWER_WIDTH,
          right: 0,
          top: 32,
          height: 'calc(100% - 32px)',
          overflowX: 'hidden',
        },
      }}
    >
      <Box sx={{ width: INSPECTOR_DRAWER_WIDTH, height: 49, borderBottom: 1, borderColor: 'divider' }}>
        <Box px={2}>
          <Tabs value={selectedSidebarTab} onChange={(_, v) => setSidebarTab(v)}>
            <Tab value="styles" label="Styles" />
            <Tab value="block-configuration" label="Inspect" />
            <Tab value="json" label="Code" />
          </Tabs>
        </Box>
      </Box>
      <Box sx={{ width: INSPECTOR_DRAWER_WIDTH, overflowY: 'auto', scrollbarGutter: 'stable', height: 'calc(100% - 49px)', overflow: 'auto' }}>
        {renderCurrentBlockForm()}
      </Box>
    </Drawer>
  );
}
