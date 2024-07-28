import React from 'react';
import { GraphQLClient } from 'graphql-request';
import { GET_FRONT_PAGE_ARTICLES } from './graphql/queries/getFrontPageArticles';
import { GET_GLOBAL_SETTINGS, GlobalSettingsData } from './graphql/queries/getGlobalSettings';
import { Article, ArticlesResponse } from './types/Article';
import Layout from './components/Layout';

const wpApiBaseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
const graphQLClient = new GraphQLClient(`${wpApiBaseUrl}/graphql`);

async function fetchArticles() {
  try {
    const data = await graphQLClient.request<ArticlesResponse>(GET_FRONT_PAGE_ARTICLES);
    return data.articles.nodes;
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

async function fetchBannerData() {
  try {
    const data = await graphQLClient.request<GlobalSettingsData>(GET_GLOBAL_SETTINGS);
    return data.globalSettings.nodes[0]?.fGGlobalSettings.bannerImage.node || null;
  } catch (error) {
    console.error('Error fetching banner data:', error);
    return null;
  }
}

export default async function Home() {
  const articles = await fetchArticles();
  const bannerData = await fetchBannerData();

  return (
    <Layout bannerData={bannerData} articles={articles} />
  );
}
