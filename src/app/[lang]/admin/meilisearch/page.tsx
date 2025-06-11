// src\app\[lang]\admin\meilisearch\page.tsx

import MeilisearchAdmin from '@/app/[lang]/components/MeilisearchAdmin';

export default function MeilisearchAdminPage() {
  return <MeilisearchAdmin />;
}

// Optional: Add metadata
export const metadata = {
  title: 'Meilisearch Admin',
  description: 'Browse and manage Meilisearch indexed content',
};