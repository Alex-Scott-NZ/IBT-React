// src/app/api/index-articles/route.ts
import { NextResponse } from 'next/server';
import { ArticleIndexer } from '@/app/utils/article-indexer';

export async function POST(request: Request) {
  try {
    // Verify admin key
    const authHeader = request.headers.get('Authorization');
    const adminKey = process.env.MEILISEARCH_ADMIN_KEY;
    
    if (!authHeader || !authHeader.includes(adminKey!)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const indexer = new ArticleIndexer();
    const result = await indexer.indexArticles();
    
    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Indexing error:', error);
    return NextResponse.json(
      { error: 'Indexing failed', details: error },
      { status: 500 }
    );
  }
}