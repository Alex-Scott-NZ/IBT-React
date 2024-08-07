import { NextResponse } from 'next/server';
import { GraphQLClient } from 'graphql-request';
import { GET_FRONT_PAGE_ARTICLES } from '../../graphql/queries/getFrontPageArticles';
import { GET_GLOBAL_SETTINGS } from '../../graphql/queries/getGlobalSettings';
import { ArticlesResponse, GlobalSettingsData } from '../../types/Article';

const wpApiBaseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
const graphQLClient = new GraphQLClient(`${wpApiBaseUrl}/graphql`);

export async function POST(request: Request) {
  try {
    const articlesResponse = await graphQLClient.request<ArticlesResponse>(GET_FRONT_PAGE_ARTICLES);
    const bannerDataResponse = await graphQLClient.request<GlobalSettingsData>(GET_GLOBAL_SETTINGS);

    return NextResponse.json({
      articles: articlesResponse.articles.nodes,
      bannerData: bannerDataResponse.globalSettings.nodes[0]?.fGGlobalSettings.bannerImage.node || null,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ articles: [], bannerData: null }, { status: 500 });
  }
}
