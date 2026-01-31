import { describe, expect, it } from 'vitest';
import { create } from 'zustand';

import { createDocumentSlice } from '@/Application/store/slices/documentSlice';
import { createUISlice } from '@/Application/store/slices/uiSlice';
import type { TEditorStore } from '@/Application/store/types';
import type { TEditorConfiguration } from '@/Application/components/Editor/editor-core';
import { ImageBlockPropsDefaults } from '@/Domain/Blocks/block-image';
import { BlogPostBlockPropsDefaults } from '@/Domain/Blocks/block-post';

const baseLayout = {
  padding: { top: 0, right: 0, bottom: 0, left: 0 },
  background: { color: 'transparent' },
};

const createDocument = (): TEditorConfiguration => {
  const imageBlock = {
    type: 'Image' as const,
    data: {
      ...ImageBlockPropsDefaults,
      image: {
        ...ImageBlockPropsDefaults.image,
        width: 300,
      },
    },
  };

  const blogPostBlock = {
    type: 'BlogPost' as const,
    data: {
      ...BlogPostBlockPropsDefaults,
      postType: 'post',
    },
  };

  return {
    root: {
      type: 'EmailLayout',
      data: {
        backdropColor: '#ffffff',
        canvasColor: '#ffffff',
        textColor: '#000000',
        fontFamily: 'MODERN_SANS',
        childrenIds: ['row-1'],
      },
    },
    'row-1': {
      type: 'ColumnsContainer',
      data: {
        fullWidth: false,
        widths: [300, 300],
        childrenIds: [['image-1', 'blog-1'], [], [], []],
        contentAlignment: 'middle',
        layout: baseLayout,
      },
    },
    'image-1': imageBlock,
    'blog-1': blogPostBlock,
  };
};

const createStore = (document: TEditorConfiguration) => {
  const useStore = create<TEditorStore>()((...args) => ({
    ...createDocumentSlice(...args),
    ...createUISlice(...args),
  }));

  useStore.getState().resetDocument(document);
  return useStore;
};

describe('documentSlice.updateBlock', () => {
  it('resizes image and blog post images when columns are resized', () => {
    const document = createDocument();
    const useStore = createStore(document);

    const row = document['row-1'];
    if (row.type !== 'ColumnsContainer') {
      throw new Error('Expected row-1 to be ColumnsContainer');
    }

    const updatedRow = {
      ...row,
      data: {
        ...row.data,
        widths: [400, 200],
      },
    };

    useStore.getState().updateBlock('row-1', updatedRow);

    const updatedImage = useStore.getState().document['image-1'];
    expect(updatedImage.type).toBe('Image');

    if (updatedImage.type === 'Image') {
      const padding = ImageBlockPropsDefaults.layout.padding.left + ImageBlockPropsDefaults.layout.padding.right;
      expect(updatedImage.data.image.width).toBe(400 - padding);
    }

    const updatedBlogPost = useStore.getState().document['blog-1'];
    expect(updatedBlogPost.type).toBe('BlogPost');

    if (updatedBlogPost.type === 'BlogPost') {
      const imageComponent = updatedBlogPost.data.components.find((component) => component.type === 'Image');
      expect(imageComponent).toBeTruthy();

      if (imageComponent && imageComponent.type === 'Image') {
        const padding = ImageBlockPropsDefaults.layout.padding.left + ImageBlockPropsDefaults.layout.padding.right;
        expect(imageComponent.data.image.width).toBe(400 - padding);
      }
    }
  });
});
