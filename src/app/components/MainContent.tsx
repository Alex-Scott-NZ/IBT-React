'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FrontPageArticle, Book, JournalIssueLatest } from '../types/Article';
import FeaturedArticles from './FeaturedArticles';
import ArticleSummary from './ArticleSummary';
import { PlaceholderSettingsData, PlaceholderSetup } from '../graphql/queries/getPlaceHolderSettings';
import BooksWidget from './BooksWidget';
import LatestJournalIssueWidget from './LatestJournalIssueWidget';
import FreeTextWidget from './FreeTextWidget';

interface MainContentProps {
  articles: FrontPageArticle[];
  placeholders: PlaceholderSettingsData;
  books: Book[];
  latestJournalIssue: JournalIssueLatest | null;
}

const MainContent: React.FC<MainContentProps> = ({ articles, placeholders, books, latestJournalIssue }) => {
  const router = useRouter();

  // Sort articles by publication date in descending order
  const sortedArticles = articles.sort((a, b) => {
    const dateA = new Date(a.articleDetails.publicationDate);
    const dateB = new Date(b.articleDetails.publicationDate);
    return dateB.getTime() - dateA.getTime(); // Newest articles first
  });

  const handleArticleClick = (slug: string) => {
    router.push(`/article/${slug}`);
  };

  // Function to render placeholder content
  const renderPlaceholderContent = (setup: PlaceholderSetup) => {
    const contentType = setup.contentSelector[0];
    switch (contentType) {
      case 'booksWidget':
        return <BooksWidget books={books} />;
      case 'latestJournalWidget':
        return <LatestJournalIssueWidget latestJournalIssue={latestJournalIssue} />;
      case 'freeText1':
        return (
          <FreeTextWidget
            heading={setup.textContentGroup.freeTextHeading || ""}
            content={setup.textContentGroup.textContent || ""}
            imageUrl={setup.textContentGroup.freeTextImage?.node.srcSet.split(' ')[0] || ""}
            imageAlt={setup.textContentGroup.freeTextHeading || "Free text image"}
          />
        );
      default:
        return null;
    }
  };

  const placeholderSetup = placeholders.placeholderSettings.placeholderSettingsFields.placeholderSetup;
  
  const topPlaceholders = placeholderSetup.filter(p => 
    p.placeholderSelector[0] === 'placeHolder1' || p.placeholderSelector[0] === 'placeHolder4'
  );
  
  const bottomPlaceholders = placeholderSetup.filter(p => 
    ['placeHolder2', 'placeHolder3', 'placeHolder5', 'placeHolder6'].includes(p.placeholderSelector[0])
  );

  return (
    <div className="flex flex-col items-center justify-between w-full">
      {/* Featured Articles - only visible on desktop */}
      <div className="hidden lg:block w-full">
        <FeaturedArticles
          articles={sortedArticles.slice(0, 2)}
          onArticleClick={handleArticleClick}
        />
      </div>

      {/* Mobile view: Top placeholders (1 and 4) */}
      <div className="w-full mt-4 lg:hidden">
        {topPlaceholders.map((placeholder, index) => (
          <React.Fragment key={`top-placeholder-${index}`}>
            {renderPlaceholderContent(placeholder)}
          </React.Fragment>
        ))}
      </div>

      {/* Articles - visible on both mobile and desktop */}
      <div className="w-full mt-4">
        {sortedArticles.map((article, index) => (
          <ArticleSummary 
            key={article.id} 
            article={article} 
            className={index < 2 ? 'lg:hidden' : ''} // Hide the first two articles on desktop if they are featured
          />
        ))}
      </div>

      {/* Mobile view: Bottom placeholders (2, 3, 5, and 6) */}
      <div className="w-full mt-4 lg:hidden">
        {bottomPlaceholders.map((placeholder, index) => (
          <React.Fragment key={`bottom-placeholder-${index}`}>
            {renderPlaceholderContent(placeholder)}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default MainContent;