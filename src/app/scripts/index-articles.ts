// src/app/scripts/index-articles.ts

import { ArticleIndexer } from '../utils/article-indexer';
import dotenv from 'dotenv';

// Load environment variables
const result = dotenv.config({ path: '.env.local' });

console.log('Dotenv result:', result);

async function main() {
  console.log('Script started...');
  console.log('Current directory:', process.cwd());
  console.log('WordPress API:', process.env.NEXT_PUBLIC_WORDPRESS_API_URL);
  console.log('Meilisearch Host:', process.env.NEXT_PUBLIC_MEILISEARCH_HOST);
  console.log('Admin Key exists:', !!process.env.MEILISEARCH_ADMIN_KEY);
  
  if (!process.env.NEXT_PUBLIC_WORDPRESS_API_URL || !process.env.NEXT_PUBLIC_MEILISEARCH_HOST) {
    console.error('Missing required environment variables!');
    process.exit(1);
  }
  
  try {
    console.log('Creating indexer...');
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
console.log('About to run main()...');
main().then(() => {
  console.log('Main completed');
}).catch((error) => {
  console.error('Main error:', error);
});