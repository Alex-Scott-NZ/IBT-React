import React from 'react';
import BaseLayout from './BaseLayout';
import MainContent from '../components/MainContent';
import BooksWidget from '../components/BooksWidget';
import LatestJournalIssueWidget from '../components/LatestJournalIssueWidget';
import { GetPlaceholderSettingsQuery, GetArticlesQuery, GetBooksQuery, GetJournalIssuesQuery, GetGlobalSettingsQuery, PlaceholderSettingsFieldsPlaceholderSetup } from '../../gql/gql-generated';

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
          <div className="free-text-content">
            {setup.textContentGroup?.freeTextHeading && <h3>{setup.textContentGroup.freeTextHeading}</h3>}
            {setup.textContentGroup?.textContent && <p>{setup.textContentGroup.textContent}</p>}
            {setup.textContentGroup?.freeTextImage?.node && (
              <img 
                src={setup.textContentGroup.freeTextImage.node.srcSet?.split(' ')[0] || ''}
                alt={setup.textContentGroup.freeTextImage.node.altText || ''}
              />
            )}
            {setup.textContentGroup?.freeTextLink?.nodes && setup.textContentGroup.freeTextLink.nodes.length > 0 && (
              <a href={setup.textContentGroup.freeTextLink.nodes[0].link || ''}>
                {setup.textContentGroup.freeTextLink.nodes[0].slug || 'Link'}
              </a>
            )}
          </div>
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
      globalSettings={globalSettings}
      leftSidebar={<>{leftSidebarContent}</>}
      mainContent={<MainContent articles={articles} placeholders={validPlaceholderSetup} />}
      rightSidebar={<>{rightSidebarContent}</>}
    />
  );
};

export default HomeLayout;