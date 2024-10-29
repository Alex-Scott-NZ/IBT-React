'use server'

import { getPlaceholderImage } from '../utils/getPlaceHolder';

export async function getImagePlaceholder(imageUrl: string) {
  if (!imageUrl) return null;
  try {
    return await getPlaceholderImage(imageUrl);
  } catch (error) {
    console.error('Error generating placeholder:', error);
    return null;
  }
}
