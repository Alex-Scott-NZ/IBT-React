// utils/getPlaceHolder.ts
'use server';

import sharp from 'sharp';

const PLACEHOLDER_CACHE = new Map<string, string>();

function bufferToBase64(buffer: Buffer): string {
  return `data:image/png;base64,${buffer.toString('base64')}`;
}

async function getFileBufferRemote(url: string) {
  const response = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1 hour
  return Buffer.from(await response.arrayBuffer());
}

export async function getPlaceholderImage(imageUrl: string) {
  try {
    // Check cache first
    if (PLACEHOLDER_CACHE.has(imageUrl)) {
      return {
        src: imageUrl,
        placeholder: PLACEHOLDER_CACHE.get(imageUrl),
      };
    }

    const buffer = await getFileBufferRemote(imageUrl);
    const resizedBuffer = await sharp(buffer)
      .resize(10, 10, { fit: 'inside' })
      .toBuffer();

    const placeholder = bufferToBase64(resizedBuffer);
    
    // Cache the result
    PLACEHOLDER_CACHE.set(imageUrl, placeholder);

    return {
      src: imageUrl,
      placeholder,
    };
  } catch (error) {
    console.error('Error generating placeholder:', error);
    return {
      src: imageUrl,
      placeholder:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mOsa2yqBwAFCAICLICSyQAAAABJRU5ErkJggg==',
    };
  }
}
