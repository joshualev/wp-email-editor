import React, { useState } from 'react';
import { AddOutlined } from '@mui/icons-material';
import { Box, ButtonBase, Typography } from '@mui/material';
import { AddRowBlockMenu } from '@/application/components/editor/editor-block-wrapper/block-builder-layer/add-block-menu/AddBlockMenu';
import { TEditorBlock } from '@/application/components/editor/EditorRegistry';
import useEditorStore from '@/application/store/editorStore';

type Props = {
  rootId: string;
};

export default function EmptyLayout({ rootId }: Props) {
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const addRow = useEditorStore((state) => state.addRow);

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleBlockSelect = (block: TEditorBlock) => {
    addRow({ block });
    setMenuAnchorEl(null);
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
          textAlign: 'center',
          minHeight: '300px',
          bgcolor: 'background.default',
        }}
      >
        <Typography variant="h6" gutterBottom>
          Start Building Your Email
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Add rows to organize your content
        </Typography>

        <ButtonBase
          onClick={handleButtonClick}
          sx={{
            p: 1,
            borderRadius: 1,
            bgcolor: 'background.paper',
            '&:hover': {
              bgcolor: 'action.hover',
            }
          }}
        >
          <AddOutlined
            sx={{
              p: 0.12,
              bgcolor: 'brand.blue',
              borderRadius: '50%',
              color: 'primary.contrastText',
            }}
            fontSize="small"
          />
        </ButtonBase>
      </Box>

      <AddRowBlockMenu
        anchorEl={menuAnchorEl}
        setAnchorEl={setMenuAnchorEl}
        onSelect={handleBlockSelect}
      />
    </>
  );
}