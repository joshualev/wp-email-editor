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

const createImageBlock = (width = 300, padding = ImageBlockPropsDefaults.layout.padding) => ({
  type: 'Image' as const,
  data: {
    ...ImageBlockPropsDefaults,
    layout: {
      ...ImageBlockPropsDefaults.layout,
      padding,
    },
    image: {
      ...ImageBlockPropsDefaults.image,
      width,
    },
  },
});

const createBlogPostBlock = (imagePadding = ImageBlockPropsDefaults.layout.padding) => {
  const components = BlogPostBlockPropsDefaults.components.map((component) => {
    if (component.type !== 'Image') {
      return {
        ...component,
        data: {
          ...component.data,
        },
      };
    }

    return {
      ...component,
      data: {
        ...component.data,
        layout: {
          ...component.data.layout,
          padding: imagePadding,
        },
      },
    };
  });

  return {
    type: 'BlogPost' as const,
    data: {
      ...BlogPostBlockPropsDefaults,
      postType: 'post',
      components,
    },
  };
};

const createDocument = (): TEditorConfiguration => {
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
    'image-1': createImageBlock(300),
    'blog-1': createBlogPostBlock(),
  };
};

const createTwoRowDocument = (): TEditorConfiguration => {
  return {
    root: {
      type: 'EmailLayout',
      data: {
        backdropColor: '#ffffff',
        canvasColor: '#ffffff',
        textColor: '#000000',
        fontFamily: 'MODERN_SANS',
        childrenIds: ['row-1', 'row-2'],
      },
    },
    'row-1': {
      type: 'ColumnsContainer',
      data: {
        fullWidth: false,
        widths: [300, 300],
        childrenIds: [['image-1'], [], [], []],
        contentAlignment: 'middle',
        layout: baseLayout,
      },
    },
    'row-2': {
      type: 'ColumnsContainer',
      data: {
        fullWidth: false,
        widths: [300, 300],
        childrenIds: [['image-2'], [], [], []],
        contentAlignment: 'middle',
        layout: baseLayout,
      },
    },
    'image-1': createImageBlock(300),
    'image-2': createImageBlock(250),
  };
};

const createMoveItemDocument = (): TEditorConfiguration => {
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
        widths: [400, 200],
        childrenIds: [['image-1'], [], [], []],
        contentAlignment: 'middle',
        layout: baseLayout,
      },
    },
    'image-1': createImageBlock(300),
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

  it('does not resize images in other rows when a row is resized', () => {
    const document = createTwoRowDocument();
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

    const beforeImage = useStore.getState().document['image-2'];
    if (beforeImage.type !== 'Image') {
      throw new Error('Expected image-2 to be Image');
    }

    useStore.getState().updateBlock('row-1', updatedRow);

    const afterImage = useStore.getState().document['image-2'];
    if (afterImage.type === 'Image') {
      expect(afterImage.data.image.width).toBe(beforeImage.data.image.width);
    }
  });

  it('resizes moved images to the target column width', () => {
    const document = createMoveItemDocument();
    const useStore = createStore(document);

    useStore.getState().moveItem({
      sourceId: 'image-1',
      targetRowId: 'row-1',
      targetColumnIndex: 1,
    });

    const updatedImage = useStore.getState().document['image-1'];
    if (updatedImage.type === 'Image') {
      const padding = ImageBlockPropsDefaults.layout.padding.left + ImageBlockPropsDefaults.layout.padding.right;
      expect(updatedImage.data.image.width).toBe(200 - padding);
    }
  });

  it('resizes blog post images using the image component padding', () => {
    const imagePadding = { top: 0, right: 30, bottom: 0, left: 10 };
    const document: TEditorConfiguration = {
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
          childrenIds: [['blog-1'], [], [], []],
          contentAlignment: 'middle',
          layout: baseLayout,
        },
      },
      'blog-1': createBlogPostBlock(imagePadding),
    };

    const useStore = createStore(document);
    const row = document['row-1'];
    if (row.type !== 'ColumnsContainer') {
      throw new Error('Expected row-1 to be ColumnsContainer');
    }

    const updatedRow = {
      ...row,
      data: {
        ...row.data,
        widths: [450, 150],
      },
    };

    useStore.getState().updateBlock('row-1', updatedRow);

    const updatedBlogPost = useStore.getState().document['blog-1'];
    if (updatedBlogPost.type === 'BlogPost') {
      const imageComponent = updatedBlogPost.data.components.find((component) => component.type === 'Image');
      if (imageComponent && imageComponent.type === 'Image') {
        const padding = imagePadding.left + imagePadding.right;
        expect(imageComponent.data.image.width).toBe(450 - padding);
      }
    }
  });
});
