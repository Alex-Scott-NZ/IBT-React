// src/app/utils/imageHelpers.ts
import { FrontPageArticle } from '../types/Article';

export function getImageUrl(featuredImage: FrontPageArticle['featuredImage'] | null | undefined, targetWidth: number = 768): string {
    if (!featuredImage || !featuredImage.node || !featuredImage.node.srcSet) {
        return featuredImage?.node?.sourceUrl || ''; // fallback to full size or empty string
    }

    const srcSet = featuredImage.node.srcSet.split(', ');
    let imageUrl = featuredImage.node.sourceUrl; // default to full size

    // Find the image closest to but not less than our target width
    for (let src of srcSet) {
        const parts = src.split(' ');
        if (parts.length < 2) continue; // Skip this iteration if the format is unexpected

        const url = parts[0];
        const widthStr = parts[1];

        if (!url || !widthStr) continue; // Skip if either url or width is missing

        const numWidth = parseInt(widthStr.replace('w', ''));
        
        if (!isNaN(numWidth) && numWidth >= targetWidth) {
            imageUrl = url;
            break;
        }
    }

    return imageUrl;
}