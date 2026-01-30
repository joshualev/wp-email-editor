/**
 * block-image/index.tsx - Image Block Component
 *
 * Renders images with aspect ratio control and optional link wrapping.
 * Includes WordPress VIP image cropping for email-safe 600px widths.
 *
 * Features:
 * - Automatic aspect ratio cropping via VIP params
 * - Configurable border radius (none/small/medium/large/full)
 * - Responsive horizontal alignment (desktop vs mobile)
 * - Optional link URL wrapping
 * - Custom width with max-width constraint
 *
 * VIP Crop Integration:
 * The component generates crop URLs with ?w=600&h=X&crop=1 params
 * for WordPress VIP hosted images, ensuring consistent rendering.
 *
 * Schema: ImageBlockSchema (from ./schema.ts)
 * - type: 'Image' (discriminator)
 * - data.image: URL, alt text, dimensions, alignment, link
 * - data.layout: Padding and background
 *
 * @module Domain/Blocks/block-image
 */
import React, { CSSProperties } from 'react';
import { z } from 'zod';
import { IMAGE_BLOCK_SCHEMA, IMAGE_ASPECT_RATIO } from './schema';
import { getPadding, getBorderRadius } from '../helpers/utils';
import { getResponsiveAlignment } from '../helpers/layout';

export const ImageBlockSchema = IMAGE_BLOCK_SCHEMA;
export const ImageBlockPropsSchema = IMAGE_BLOCK_SCHEMA.shape.data;
export type ImageBlockType = z.infer<typeof ImageBlockSchema>;
export type ImageBlockPropsType = z.infer<typeof ImageBlockPropsSchema>;

// WordPress VIP crop params - always uses 600px width for email compatibility
const VIP_CROP_WIDTH = 600;

/**
 * Generates a WordPress VIP crop URL with width=600 and height calculated from aspect ratio
 * @param url - The original image URL
 * @param aspectRatio - The aspect ratio (width/height) to apply
 * @returns The URL with VIP crop parameters appended
 */
function getVipCropUrl(url: string, aspectRatio: number): string {
  if (!url) return url;

  // Calculate height based on 600px width and aspect ratio
  const height = Math.round(VIP_CROP_WIDTH / aspectRatio);

  // Parse the URL to add/update query params
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.set('w', VIP_CROP_WIDTH.toString());
    urlObj.searchParams.set('h', height.toString());
    urlObj.searchParams.set('crop', '1');
    return urlObj.toString();
  } catch {
    // If URL parsing fails, append params manually
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}w=${VIP_CROP_WIDTH}&h=${height}&crop=1`;
  }
}


export const ImageBlockPropsDefaults: ImageBlockPropsType = {
  hidden: false,
  layout: {
    padding: { top: 5, right: 10, bottom: 5, left: 10 },
    background: { color: 'transparent' }
  },
  image: {
    url: "https://placehold.co/600x450",
    alt: "Image Block",
    aspectRatio: "square",
    linkUrl: "",
    width: 300,
    height: undefined,
    alignment: {
      horizontal: {
        desktop: "left",
        mobile: "center"
      },
      vertical: "middle"
    },
    borderRadius: 'small',
  },
};

function getAspectRatio(ratio: keyof typeof IMAGE_ASPECT_RATIO | number): number {
  if (typeof ratio === 'number') return ratio;
  return IMAGE_ASPECT_RATIO[ratio] ?? IMAGE_ASPECT_RATIO.square;
}

interface ImageBlockRenderProps extends ImageBlockPropsType {
  isMobile?: boolean;
}

export function ImageBlock({ image, layout, hidden, isMobile = false }: ImageBlockRenderProps) {
  if (hidden) return null;

  const padding = getPadding(layout.padding);
  const aspectRatio = getAspectRatio(image.aspectRatio);
  const horizontalAlign = getResponsiveAlignment(image.alignment.horizontal, isMobile);

  // Generate VIP crop URL with 600px width and calculated height
  const croppedUrl = getVipCropUrl(image.url, aspectRatio);

  const containerStyle: CSSProperties = {
    position: 'relative',
    backgroundColor: layout.background.color,
    textAlign: horizontalAlign,
    padding,
  };

  const imageStyle: CSSProperties = {
    width: `${image.width}px`,
    verticalAlign: image.alignment.vertical,
    borderRadius: getBorderRadius('image', image.borderRadius),
    maxWidth: '100%',
  };

  const imageElement = (
    <img
      src={croppedUrl}
      alt={image.alt}
      width={image.width}
      style={imageStyle}
    />
  );

  return (
    <div style={containerStyle}>
      {image.linkUrl ? (
        <a
          href={image.linkUrl}
          style={{ textDecoration: 'none' }}
        >
          {imageElement}
        </a>
      ) : imageElement}
    </div>
  );
}