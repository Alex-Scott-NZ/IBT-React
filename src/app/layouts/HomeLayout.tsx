import React from 'react';
import BaseLayout from './BaseLayout';
import MainContent from '../components/MainContent';
import BooksWidget from '../components/BooksWidget';
import LatestJournalIssueWidget from '../components/LatestJournalIssueWidget';
import PlaceholderWidget from '../components/PlaceholderWidget';
import { GetPlaceholderSettingsQuery, GetArticlesQuery, GetBooksQuery, GetJournalIssuesLatestQuery, GetGlobalSettingsQuery, PlaceholderSettingsFieldsPlaceholderSetup } from '../../gql/gql-generated';

type HomeLayoutProps = {
  globalSettings: GetGlobalSettingsQuery;
  articles: GetArticlesQuery;
  books: GetBooksQuery;
  latestJournalIssue: GetJournalIssuesLatestQuery;
  placeHolderSettings: GetPlaceholderSettingsQuery;
};

const HomeLayout: React.FC<HomeLayoutProps> = async ({
  globalSettings,
  articles,
  books,
  latestJournalIssue,
  placeHolderSettings
}) => {
  const placeholderSetup = placeHolderSettings.placeholderSettings?.placeholderSettingsFields?.placeholderSetup;

  const renderPlaceholderContent = (setup: PlaceholderSettingsFieldsPlaceholderSetup) => {
    const contentType = setup.contentSelector[0];
    switch (contentType) {
      case 'booksWidget':
        return <BooksWidget books={books} />;
      case 'latestJournalWidget':
        return <LatestJournalIssueWidget latestJournalIssue={latestJournalIssue} />;
      case 'freeText':
        return (
          <PlaceholderWidget
            textContentGroup={setup.textContentGroup}
          />
        );
      default:
        return null;
    }
  };

  if (!placeholderSetup) {
    return null;
  }

  const validPlaceholderSetup = placeholderSetup.filter((setup): setup is PlaceholderSettingsFieldsPlaceholderSetup => setup !== null);

  const leftSidebarContent = validPlaceholderSetup
    .filter(setup => setup.placeholderSelector.some(selector => ['placeHolder1', 'placeHolder2', 'placeHolder3'].includes(selector || '')))
    .map((setup, index) => <React.Fragment key={index}>{renderPlaceholderContent(setup)}</React.Fragment>);

  const rightSidebarContent = validPlaceholderSetup
    .filter(setup => setup.placeholderSelector.some(selector => ['placeHolder4', 'placeHolder5', 'placeHolder6'].includes(selector || '')))
    .map((setup, index) => <React.Fragment key={index}>{renderPlaceholderContent(setup)}</React.Fragment>);

  return (
    <BaseLayout
      globalSettings={globalSettings.globalSettings}
      leftSidebar={<>{leftSidebarContent}</>}
      mainContent={<MainContent articles={articles} placeholders={validPlaceholderSetup} />}
      rightSidebar={<>{rightSidebarContent}</>}
    />
  );
};

export default HomeLayout;