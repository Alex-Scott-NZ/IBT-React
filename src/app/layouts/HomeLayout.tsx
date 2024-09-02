import React from 'react';
import BaseLayout from './BaseLayout';
import MainContent from '../components/MainContent';
import BooksWidget from '../components/BooksWidget';
import LatestJournalIssueWidget from '../components/LatestJournalIssueWidget';
import { GetPlaceholderSettingsQuery, GetArticlesQuery, GetBooksQuery, GetJournalIssuesQuery, GetGlobalSettingsQuery  } from '../../gql/gql-generated';

type HomeLayoutProps = {
  globalSettings: GetGlobalSettingsQuery;
  articles: GetArticlesQuery;
  books: GetBooksQuery;
  latestJournalIssue: GetJournalIssuesQuery;
  placeHolderSettings: GetPlaceholderSettingsQuery;
};

const HomeLayout: React.FC<HomeLayoutProps> = async ({
  globalSettings,
  articles,
  books,
  latestJournalIssue,
  placeHolderSettings
}) => {
  // Fetch placeholder settings server-side
  const placeholderSetup = placeHolderSettings.placeholderSettings?.placeholderSettingsFields?.placeholderSetup

  const renderPlaceholderContent = (setup: NonNullable<typeof placeholderSetup>[number]) => {
    if (!setup?.contentSelector) return null;

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
        if (setup.textContentGroup) {
          return <div className="free-text-content">{setup.textContentGroup.textContent}</div>;
        }
        return null;
      default:
        return null;
    }
  };

  if (!placeholderSetup) {
    return
  }

  const leftSidebarContent = placeholderSetup
    .filter((setup) =>
      setup?.placeholderSelector?.some((selector) =>
        ['placeHolder1', 'placeHolder2', 'placeHolder3'].includes(selector ?? '')
      )
    )
    .map((setup, index) => <React.Fragment key={index}>{renderPlaceholderContent(setup)}</React.Fragment>);

  const rightSidebarContent = placeholderSetup
    .filter((setup) =>
      setup?.placeholderSelector?.some((selector) =>
        ['placeHolder4', 'placeHolder5', 'placeHolder6'].includes(selector ?? '')
      )
    )
    .map((setup, index) => <React.Fragment key={index}>{renderPlaceholderContent(setup)}</React.Fragment>);

  return (
    <BaseLayout
      globalSettings={globalSettings}
      leftSidebar={<>{leftSidebarContent}</>}
      mainContent={<MainContent articles={articles} placeholders={placeholderSetup} />}
      rightSidebar={<>{rightSidebarContent}</>}
    />
  );
};

export default HomeLayout;