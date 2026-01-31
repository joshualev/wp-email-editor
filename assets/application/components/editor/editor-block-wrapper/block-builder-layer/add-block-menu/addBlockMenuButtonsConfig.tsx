import React from 'react';

import {
  HMobiledataOutlined,
  HorizontalRuleOutlined,
  ImageOutlined,
  LibraryAddOutlined,
  NotesOutlined,
  SmartButtonOutlined,
} from '@mui/icons-material';

import { Square, Columns2, Columns3, Columns4 } from 'lucide-react';

import { TEditorBlock } from '@/application/components/editor/editor-core';

import { ImageBlockPropsDefaults } from '@/domain/blocks/block-image';
import { HeadingBlockPropsDefaults } from '@/domain/blocks/block-heading';
import { TextBlockPropsDefaults } from '@/domain/blocks/block-text';
import { ButtonBlockPropsDefaults } from '@/domain/blocks/block-button';
import { DividerBlockPropsDefaults } from '@/domain/blocks/block-divider';
import { BlogPostBlockPropsDefaults } from '@/domain/blocks/block-post';


type TButtonProps = {
  label: string;
  icon: JSX.Element;
  block: () => TEditorBlock;
};

export const COMPONENT_BUTTONS_CONFIG: TButtonProps[] = [
  {
    label: 'Heading',
    icon: <HMobiledataOutlined />,
    block: () => ({
      type: 'Heading',
      data: HeadingBlockPropsDefaults,
    }),
  },
  {
    label: 'Text',
    icon: <NotesOutlined />,
    block: () => ({
      type: 'Text',
      data: TextBlockPropsDefaults,
    }),
  },
  {
    label: 'Button',
    icon: <SmartButtonOutlined />,
    block: () => ({
      type: 'Button',
      data: ButtonBlockPropsDefaults,
    }),
  },
  {
    label: 'Image',
    icon: <ImageOutlined />,
    block: () => ({
      type: 'Image',
      data: ImageBlockPropsDefaults,
    }),
  },
  {
    label: 'Divider',
    icon: <HorizontalRuleOutlined />,
    block: () => ({
      type: 'Divider',
      data: DividerBlockPropsDefaults,
    }),
  },
  {
    label: 'BlogPost',
    icon: <LibraryAddOutlined />,
    block: () => ({
      type: 'BlogPost',
      data: BlogPostBlockPropsDefaults,
    }),
  },
];




export default COMPONENT_BUTTONS_CONFIG;



export const ROW_BUTTONS_CONFIG: TButtonProps[] = [
  {
    label: 'Single Column',
    icon: <Square />,
    block: () => ({
      type: 'ColumnsContainer',
      data: {
        widths: [600],
        contentAlignment: 'top',
        childrenIds: [[], [], [], []],
        layout: {
          background: { color: '#FFFFFF' },
          padding: { top: 10, bottom: 10, left: 0, right: 0 },
        },
        hidden: false,
      }
    }),
  },
  {
    label: 'Two Columns',
    icon: <Columns2 />,
    block: () => ({
      type: 'ColumnsContainer',
      data: {
        widths: [300, 300],
        contentAlignment: 'top',
        childrenIds: [[], [], [], []],
        layout: {
          background: { color: '#FFFFFF' },
          padding: { top: 10, bottom: 10, left: 0, right: 0 },
        },
        hidden: false,
      }
    }),
  },
  {
    label: 'Three Columns',
    icon: <Columns3 />,
    block: () => ({
      type: 'ColumnsContainer',
      data: {
        widths: [200, 200, 200],
        contentAlignment: 'top',
        childrenIds: [[], [], [], []],
        layout: {
          background: { color: '#FFFFFF' },
          padding: { top: 10, bottom: 10, left: 0, right: 0 },
        },
        hidden: false,
      }
    }),
  },
  {
    label: 'Four Columns',
    icon: <Columns4 />,
    block: () => ({
      type: 'ColumnsContainer',
      data: {
        widths: [150, 150, 150, 150],
        contentAlignment: 'top',
        childrenIds: [[], [], [], []],
        layout: {
          background: { color: '#FFFFFF' },
          padding: { top: 10, bottom: 10, left: 0, right: 0 },
        },
        hidden: false,
      }
    }),
  },
];