import React from 'react';

import { BlogPostBlockPropsType } from '@/Domain/Blocks/block-post';

import { ImageBlock } from './ImageBlock';
import { HeadingBlock } from './HeadingBlock';
import { TextBlock } from './TextBlock';
import { ButtonBlock } from './ButtonBlock';

interface BlogPostBlockRenderProps extends BlogPostBlockPropsType {
  isMobile?: boolean;
}

export function BlogPostBlock({ components, isMobile = false }: BlogPostBlockRenderProps) {
  return (
    <>
      {components.map((component, index) => {
        if (component.data.hidden) return null;

        switch (component.type) {
          case 'Image':
            return <ImageBlock key={index} {...component.data} isMobile={isMobile} />;
          case 'Heading':
            return <HeadingBlock key={index} {...component.data} isMobile={isMobile} />;
          case 'Text':
            return <TextBlock key={index} {...component.data} isMobile={isMobile} />;
          case 'Button':
            return <ButtonBlock key={index} {...component.data} isMobile={isMobile} />;
          default:
            return null;
        }
      })}
    </>
  );
}
