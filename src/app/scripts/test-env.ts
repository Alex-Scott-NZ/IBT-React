// src\app\scripts\test-env.ts

import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

console.log('Environment variables test:');
console.log('NEXT_PUBLIC_WORDPRESS_API_URL:', process.env.NEXT_PUBLIC_WORDPRESS_API_URL);
console.log('NEXT_PUBLIC_MEILISEARCH_HOST:', process.env.NEXT_PUBLIC_MEILISEARCH_HOST);
console.log('MEILISEARCH_ADMIN_KEY:', process.env.MEILISEARCH_ADMIN_KEY ? 'Set' : 'Not set');