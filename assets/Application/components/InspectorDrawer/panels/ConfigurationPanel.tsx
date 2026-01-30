/**
 * ConfigurationPanel.tsx - Block Configuration Inspector
 *
 * Renders the appropriate configuration form based on the currently
 * selected block in the editor. Acts as a form router that maps
 * block types to their corresponding form components.
 *
 * Supported Block Types:
 * - ColumnsContainer, Button, Divider, Heading, Image, Text
 * - BlogPost, HubSpotHeader, HubSpotFooter
 *
 * Form components receive `data` and `setData` props to enable
 * two-way binding between the form and the editor store.
 *
 * @module Application/components/InspectorDrawer/panels
 */
import React from 'react';
import { Stack, Box, Typography } from '@mui/material';
import useEditorStore from '@/Application/store/editorStore';

// Block-specific configuration forms
import ButtonBlockForm from '../forms/ButtonBlockForm';
import ColumnsContainerBlockForm from '../forms/ColumnsContainerBlockForm';
import DividerBlockForm from '../forms/DividerBlockForm';
import HeadingBlockForm from '../forms/HeadingBlockForm';
import ImageBlockForm from '../forms/ImageBlockForm';
import TextBlockForm from '../forms/TextBlockForm';
import BlogPostBlockForm from '../forms/BlogPostBlockForm';
import HubSpotHeaderBlockForm from '../forms/HubSpotHeaderBlockForm';
import HubSpotFooterBlockForm from '../forms/HubSpotFooterBlockForm';


function renderMessage(val: string) {
  return (
    <Box sx={{ m: 3, p: 1, border: '1px dashed', borderColor: 'divider' }}>
      <Typography color="text.secondary">{val}</Typography>
    </Box>
  );
}

export default function ConfigurationPanel() {
  const document = useEditorStore(state => state.document);
  const selectedBlockId = useEditorStore(state => state.selectedBlockId);
  const updateBlock = useEditorStore(state => state.updateBlock);

  if (!selectedBlockId) {
    return renderMessage('Click on a block to inspect.');
  }

  const block = document[selectedBlockId];
  if (!block) {
    return renderMessage(
      `Block with id ${selectedBlockId} was not found. Click on a block to reset.`
    );
  }

  const { data, type } = block;

  // Add safety check for type
  if (!type) {
    return renderMessage('Invalid block type');
  }

  // Format the block type into a title
  const getBlockTitle = () => {
    try {
      // Insert space before capital letters and trim any extra spaces
      return `${type.replace(/([A-Z])/g, ' $1').trim()} Settings`;
    } catch (error) {
      console.error('Error formatting block title:', error);
      return 'Block Settings';
    }
  };

  // Render the appropriate form panel based on block type
  const renderFormPanel = () => {
    const setData = (newData: any) => updateBlock(selectedBlockId, { type, data: newData });

    switch (type) {
      case 'ColumnsContainer':
        return <ColumnsContainerBlockForm data={data} setData={setData} />;
      case 'Button':
        return <ButtonBlockForm data={data} setData={setData} />;
      case 'Divider':
        return <DividerBlockForm data={data} setData={setData} />;
      case 'Heading':
        return <HeadingBlockForm data={data} setData={setData} />;
      case 'Image':
        return <ImageBlockForm data={data} setData={setData} />;
      case 'Text':
        return <TextBlockForm data={data} setData={setData} />;
      case 'BlogPost':
        return <BlogPostBlockForm data={data} setData={setData} />;
      case 'HubSpotHeader':
        return <HubSpotHeaderBlockForm data={data} setData={setData} />;
      case 'HubSpotFooter':
        return <HubSpotFooterBlockForm data={data} setData={setData} />;
      default:
        return <pre>{JSON.stringify(block, null, '  ')}</pre>;
    }
  };

  return (
    <Box>
      <Typography
        variant="overline"
        color="text.secondary"
        sx={{ display: 'block', px: 2, pt: 2, pb: 0.5 }}
      >
        {getBlockTitle()}
      </Typography>
      <Stack spacing={2} sx={{ p: 2 }}>
        {renderFormPanel()}
      </Stack>
    </Box>
  );
}