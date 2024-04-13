"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Article, Author, Media } from '../app/types/Article'

// Assuming your .env.local file is correctly set up with NEXT_PUBLIC_WORDPRESS_API_URL
const wpApiBaseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL
console.log('API Base URL:', process.env.NEXT_PUBLIC_WORDPRESS_API_URL);


export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${wpApiBaseUrl}/journal-articles?context=view&page=1&per_page=2&orderby=publication-date&order=desc&_embed&display_on_front_page=yes`)
      .then(response => response.json())
      .then(data => {
        setArticles(data);
        setLoading(false);
      })
      .catch(error => console.error('Error fetching articles:', error));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* Existing layout */}
      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        {/* Article fetching status */}
        {loading ? (
          <p>Loading articles...</p>
        ) : (
          articles.map(article => (
            <div key={article.id} className="mb-4">
              <h2 dangerouslySetInnerHTML={{ __html: article.title.rendered }} />
              <div dangerouslySetInnerHTML={{ __html: article.content.rendered }} />
            </div>
          ))
        )}
      </div>
      {/* Rest of your existing layout goes here */}
    </main>
  );
}
