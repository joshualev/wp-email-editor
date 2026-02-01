import React, { CSSProperties } from 'react';

import { ImageBlockPropsType } from '@/domain/blocks/block-image';
import { IMAGE_ASPECT_RATIO } from '@/domain/blocks/block-image/schema';
import { getPadding, getBorderRadius } from '@/domain/blocks/helpers/utils';
import { getResponsiveAlignment } from '@/domain/blocks/helpers/layout';

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
