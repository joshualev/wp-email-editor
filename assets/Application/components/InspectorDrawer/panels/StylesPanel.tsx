/**
 * StylesPanel.tsx - Global Email Layout Styles Inspector
 *
 * Provides controls for configuring the root EmailLayout block,
 * which affects the entire email canvas. Always edits the 'root'
 * block regardless of what block is selected in the editor.
 *
 * Configuration Options (via EmailLayoutBlockForm):
 * - Canvas background color
 * - Content width settings
 * - Global padding and margins
 * - Full-width toggle
 *
 * @module Application/components/InspectorDrawer/panels
 */
import React from 'react';

import useEditorStore from '@/Application/store/editorStore';

import EmailLayoutBlockForm from '../forms/EmailLayoutBlockForm';
import { Box, Stack, Typography } from '@mui/material';

export default function StylesPanel() {
  const document = useEditorStore(state => state.document);
  const updateBlock = useEditorStore(state => state.updateBlock);

  const block = document.root;
  if (!block) {
    return <p>Block not found</p>;
  }

  const { data, type } = block;
  if (type !== 'EmailLayout') {
    throw new Error('Expected "root" element to be of type EmailLayout');
  }

  return (
    <Box>
      <Typography variant="overline" color="text.secondary" sx={{ display: 'block', px: 2, pt: 2, pb: 0.5 }}>
        Email Canvas Settings
      </Typography>
      <Stack spacing={2} sx={{ p: 2 }}>
        <EmailLayoutBlockForm
          key="root"
          data={data}
          setData={(newData) => updateBlock('root', { type: 'EmailLayout', data: newData })}
        />
      </Stack>
    </Box>
  );
}