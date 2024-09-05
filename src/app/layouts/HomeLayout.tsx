// layouts/HomeLayout.tsx
import React from 'react';
import BaseLayout from './BaseLayout';
import MainContent from '../components/MainContent';
import BooksWidget from '../components/BooksWidget';
import LatestJournalIssueWidget from '../components/LatestJournalIssueWidget';
import FreeTextWidget from '../components/FreeTextWidget';
import { FrontPageArticle, Book, JournalIssueLatest, GlobalSettingsData } from '../types/Article';
import { fetchPlaceHolderSettings } from '../utils/fetchPlaceHolderSettings';
import { PlaceholderSettingsData, PlaceholderSetup } from '../graphql/queries/getPlaceHolderSettings';

type HomeLayoutProps = {
  globalSettings: GlobalSettingsData | null;
  articles: FrontPageArticle[];
  books: Book[];
  latestJournalIssue: JournalIssueLatest | null;
};

const HomeLayout: React.FC<HomeLayoutProps> = async ({
  globalSettings,
  articles,
  books,
  latestJournalIssue,
}) => {
  const placeholders: PlaceholderSettingsData | null = await fetchPlaceHolderSettings();

  if (!placeholders) {
    return null; // Or a loading indicator
  }

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

  const placeholderSettingsFields = placeholders.placeholderSettings.placeholderSettingsFields;

  const leftSidebarContent = placeholderSettingsFields.placeholderSetup
    .filter((setup) =>
      ['placeHolder1', 'placeHolder2', 'placeHolder3'].includes(setup.placeholderSelector[0])
    )
    .map((setup, index) => (
      <React.Fragment key={`left-${index}`}>
        {renderPlaceholderContent(setup)}
      </React.Fragment>
    ));

  const rightSidebarContent = placeholderSettingsFields.placeholderSetup
    .filter((setup) =>
      ['placeHolder4', 'placeHolder5', 'placeHolder6'].includes(setup.placeholderSelector[0])
    )
    .map((setup, index) => (
      <React.Fragment key={`right-${index}`}>
        {renderPlaceholderContent(setup)}
      </React.Fragment>
    ));

  return (
    <BaseLayout
      globalSettings={globalSettings}
      leftSidebar={<div className="hidden lg:block">{leftSidebarContent}</div>}
      mainContent={
        <MainContent 
          articles={articles} 
          placeholders={placeholders}
          books={books}
          latestJournalIssue={latestJournalIssue}
        />
      }
      rightSidebar={<div className="hidden lg:block">{rightSidebarContent}</div>}
    />
  );
};

export default HomeLayout;