interface ImageNode {
  srcSet: string;
  sourceUrl: string;
  [key: string]: string | number | undefined;  // To allow for other properties
}

export function getImageUrl(
  imageNode: ImageNode | null | undefined,
  targetWidth: number = 768
): string {
  if (!imageNode || !imageNode.srcSet) {
    return imageNode?.sourceUrl || ''; // Fallback to full size or empty string
  }

  const srcSet = imageNode.srcSet.split(', ');
  let imageUrl = imageNode.sourceUrl; // Default to full size

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


