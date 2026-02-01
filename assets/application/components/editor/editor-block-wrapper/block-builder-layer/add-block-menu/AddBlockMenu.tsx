import React from 'react';

import { Box, Menu } from '@mui/material';

import { TEditorBlock } from '@/application/components/editor/EditorRegistry';

import AddBlockMenuButton from './AddBlockMenuButton';
import { COMPONENT_BUTTONS_CONFIG, ROW_BUTTONS_CONFIG } from './addBlockMenuButtonsConfig';

type BlocksMenuProps = {
  anchorEl: HTMLElement | null;
  setAnchorEl: (v: HTMLElement | null) => void;
  onSelect: (block: TEditorBlock) => void;
};

export function AddRowBlockMenu({ anchorEl, setAnchorEl, onSelect }: BlocksMenuProps) {
  const onClose = () => {
    setAnchorEl(null);
  };

  const onClick = (block: TEditorBlock) => {
    onSelect(block);
    setAnchorEl(null);
  };

  if (anchorEl === null) {
    return null;
  }

  return (
    <Menu
      open
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      transformOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Box sx={{ p: 1, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
        {ROW_BUTTONS_CONFIG.map((k, i) => (
          <AddBlockMenuButton
            key={i}
            label={k.label}
            icon={k.icon}
            onClick={() => onClick(k.block())}
          />
        ))}
      </Box>
    </Menu>
  );
}

export function AddComponentBlockMenu({ anchorEl, setAnchorEl, onSelect }: BlocksMenuProps) {
  const onClose = () => {
    setAnchorEl(null);
  };

  const onClick = (block: TEditorBlock) => {
    onSelect(block);
    setAnchorEl(null);
  };

  if (anchorEl === null) {
    return null;
  }

  return (
    <Menu
      open
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      transformOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Box sx={{ p: 1, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
        {COMPONENT_BUTTONS_CONFIG.map((k, i) => (
          <AddBlockMenuButton
            key={i}
            label={k.label}
            icon={k.icon}
            onClick={() => onClick(k.block())}
          />
        ))}
      </Box>
    </Menu>
  );
}
