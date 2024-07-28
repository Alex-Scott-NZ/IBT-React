'use client';
import React, { useState, useEffect } from 'react';
import { GraphQLClient } from 'graphql-request';
import { GET_FRONT_PAGE_ARTICLES } from '../app/graphql/queries/getFrontPageArticles';
import { GET_GLOBAL_SETTINGS } from '../app/graphql/queries/getGlobalSettings';
import {
  GlobalSettingsData,
  BannerImageNode,
  FrontPageArticle,
  ArticlesResponse,
} from '../app/types/Article';
import Layout from '../app/components/Layout';

const wpApiBaseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
const graphQLClient = new GraphQLClient(`${wpApiBaseUrl}/graphql`);

const fetchArticles = async (): Promise<FrontPageArticle[]> => {
  try {
    const data = await graphQLClient.request<ArticlesResponse>(
      GET_FRONT_PAGE_ARTICLES
    );
    return data.articles.nodes;
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
};

const fetchBannerData = async (): Promise<BannerImageNode | null> => {
  try {
    const data =
      await graphQLClient.request<GlobalSettingsData>(GET_GLOBAL_SETTINGS);
    return (
      data.globalSettings.nodes[0]?.fGGlobalSettings.bannerImage.node || null
    );
  } catch (error) {
    console.error('Error fetching banner data:', error);
    return null;
  }
};

export default function Home() {
  const [articles, setArticles] = useState<FrontPageArticle[]>([]);
  const [bannerData, setBannerData] = useState<BannerImageNode | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const fetchedArticles = await fetchArticles();
      const fetchedBannerData = await fetchBannerData();
      setArticles(fetchedArticles);
      setBannerData(fetchedBannerData);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <Layout bannerData={bannerData} articles={articles} />;
}
