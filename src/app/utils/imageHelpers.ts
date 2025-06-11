// src\app\utils\imageHelpers.ts

// Define the interface based on what the function actually uses
interface ImageNode {
  sourceUrl?: string | null;
  mediaItemUrl?: string | null;
  srcSet?: string | null;
}

export function getImageUrl(
  imageNode: ImageNode | undefined,
  targetWidth: number = 768
): string {
  if (!imageNode) {
    return ''; // Fallback to empty string if no image node
  }

  if (!imageNode.srcSet) {
    return imageNode.sourceUrl || imageNode.mediaItemUrl || ''; // Fallback to sourceUrl, mediaItemUrl, or empty string
  }

  const srcSet = imageNode.srcSet.split(', ');
  let imageUrl = imageNode.sourceUrl || imageNode.mediaItemUrl || ''; // Default to sourceUrl, mediaItemUrl, or empty string

  // Find the image closest to but not less than the target width
  for (const src of srcSet) {
    const parts = src.split(' ');
    if (parts.length < 2) continue; // Skip this iteration if the format is unexpected

    const url = parts[0];
    const widthStr = parts[1];

    if (!url || !widthStr) continue; // Skip if either URL or width is missing

    const numWidth = parseInt(widthStr.replace('w', ''));

    if (!isNaN(numWidth) && numWidth >= targetWidth) {
      imageUrl = url;
      break;
    }
  }

  return imageUrl;
}