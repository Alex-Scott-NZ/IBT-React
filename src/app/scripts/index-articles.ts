// src\app\scripts\index-articles.ts

import { ArticleIndexer } from '../utils/article-indexer';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables - try multiple possible locations
const envFiles = ['.env.development', '.env.local', '.env'];
let envLoaded = false;

for (const envFile of envFiles) {
  const envPath = path.resolve(process.cwd(), envFile);
  console.log(`Trying to load ${envFile}...`);
  
  const result = dotenv.config({ path: envPath });
  
  if (!result.error) {
    console.log(`✓ Successfully loaded ${envFile}`);
    envLoaded = true;
    break;
  }
}

if (!envLoaded) {
  console.error('❌ Could not load any environment file');
}

async function main() {
  console.log('\nScript started...');
  console.log('Current directory:', process.cwd());
  console.log('WordPress API:', process.env.NEXT_PUBLIC_WORDPRESS_API_URL);
  console.log('Meilisearch Host:', process.env.NEXT_PUBLIC_MEILISEARCH_HOST);
  console.log('Admin Key exists:', !!process.env.MEILISEARCH_ADMIN_KEY);
  
  if (!process.env.NEXT_PUBLIC_WORDPRESS_API_URL || !process.env.NEXT_PUBLIC_MEILISEARCH_HOST) {
    console.error('\n❌ Missing required environment variables!');
    console.error('Please ensure your .env.development file contains:');
    console.error('NEXT_PUBLIC_WORDPRESS_API_URL=https://backend.saggitari.us');
    console.error('NEXT_PUBLIC_MEILISEARCH_HOST=https://headless.saggitari.us/search-api');
    console.error('MEILISEARCH_ADMIN_KEY=your-admin-key');
    process.exit(1);
  }
  
  try {
    console.log('\nCreating indexer...');
    const indexer = new ArticleIndexer();
    
    console.log('Starting indexing...');
    const result = await indexer.indexArticles();
    
    console.log('\n✅ Indexing complete!');
    console.log(`Total articles fetched: ${result.total}`);
    console.log(`Articles indexed: ${result.indexed}`);
  } catch (error) {
    console.error('\n❌ Indexing failed:', error);
    process.exit(1);
  }
}

// Run the script
main().catch((error) => {
  console.error('Main error:', error);
  process.exit(1);
});