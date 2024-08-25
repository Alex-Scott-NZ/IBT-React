import React from 'react';
import BaseLayout from './BaseLayout';
import MainContent from '../components/MainContent';
import BooksWidget from '../components/BooksWidget';
import LatestJournalIssueWidget from '../components/LatestJournalIssueWidget';
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
  // Fetch placeholder settings server-side
  const placeholders: PlaceholderSettingsData | null = await fetchPlaceHolderSettings();

  if (!placeholders) {
    return null; // Or a loading indicator
  }

  // Map placeholders to their respective components
  const renderPlaceholderContent = (setup: PlaceholderSetup) => {
    const contentType = setup.contentSelector[0];
    switch (contentType) {
      case 'booksWidget':
        return <BooksWidget books={books} />;
      case 'latestJournalWidget':
        return <LatestJournalIssueWidget latestJournalIssue={latestJournalIssue} />;
      case 'freeText1':
      case 'freeText2':
      case 'freeText3':
      case 'freeText4':
        // Render the free text content if available
        return <div className="free-text-content">{setup.textContent}</div>;
      default:
        return null;
    }
  };

  const placeholderSettingsFields = placeholders.placeholderSettings.placeholderSettingsFields;

  // Assign placeholders to leftSidebar and rightSidebar
  const leftSidebarContent = placeholderSettingsFields.placeholderSetup
    .filter((setup) =>
      ['placeHolder1', 'placeHolder2', 'placeHolder3'].includes(setup.placeholderSelector[0])
    )
    .map((setup) => renderPlaceholderContent(setup));

  const rightSidebarContent = placeholderSettingsFields.placeholderSetup
    .filter((setup) =>
      ['placeHolder4', 'placeHolder5', 'placeHolder6'].includes(setup.placeholderSelector[0])
    )
    .map((setup) => renderPlaceholderContent(setup));

  return (
    <BaseLayout
      globalSettings={globalSettings}
      leftSidebar={<>{leftSidebarContent}</>}
      mainContent={<MainContent articles={articles} />}
      rightSidebar={<>{rightSidebarContent}</>}
    />
  );
};

export default HomeLayout;
