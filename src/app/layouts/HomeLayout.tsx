import React, { useMemo } from 'react';
import BaseLayout from './BaseLayout';
import MainContent from '../components/MainContent';
import BooksWidget from '../components/BooksWidget';
import LatestJournalIssueWidget from '../components/LatestJournalIssueWidget';
import PlaceholderWidget from '../components/PlaceholderWidget';
import { 
  GetPlaceholderSettingsQuery, 
  GetArticlesQuery, 
  GetBooksQuery, 
  GetJournalIssuesLatestQuery, 
  GetGlobalSettingsQuery, 
  PlaceholderSettingsFieldsPlaceholderSetup 
} from '../../gql/gql-generated';

type HomeLayoutProps = {
  globalSettings: GetGlobalSettingsQuery;
  articles: GetArticlesQuery;
  books: GetBooksQuery;
  latestJournalIssue: GetJournalIssuesLatestQuery;
  placeHolderSettings: GetPlaceholderSettingsQuery;
};

type WidgetProps = {
  books: GetBooksQuery;
  latestJournalIssue: GetJournalIssuesLatestQuery;
};

const getValidPlaceholders = (settings: GetPlaceholderSettingsQuery) => {
  const placeholders = settings?.placeholderSettings?.placeholderSettingsFields?.placeholderSetup;
  return (placeholders || []).filter((setup): setup is PlaceholderSettingsFieldsPlaceholderSetup => 
    setup !== null && setup !== undefined
  );
};

const renderPlaceholderContent = (
  setup: PlaceholderSettingsFieldsPlaceholderSetup,
  props: WidgetProps
) => {
  const contentType = setup.contentSelector[0];
  switch (contentType) {
    case 'booksWidget':
      return <BooksWidget books={props.books} />;
    case 'latestJournalWidget':
      return <LatestJournalIssueWidget latestJournalIssue={props.latestJournalIssue} />;
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

const getSidebarContent = (
  validPlaceholders: PlaceholderSettingsFieldsPlaceholderSetup[],
  selectors: string[],
  widgetProps: WidgetProps
) => {
  return validPlaceholders
    .filter(setup => setup.placeholderSelector.some(selector => 
      selectors.includes(selector || '')
    ))
    .map((setup, index) => (
      <React.Fragment key={index}>
        {renderPlaceholderContent(setup, widgetProps)}
      </React.Fragment>
    ));
};

const HomeLayout: React.FC<HomeLayoutProps> = ({
  globalSettings,
  articles,
  books,
  latestJournalIssue,
  placeHolderSettings
}) => {
  
  const validPlaceholders = useMemo(() => {
    return getValidPlaceholders(placeHolderSettings);
  }, [placeHolderSettings]);
  
  if (validPlaceholders.length === 0) return null;

  const widgetProps = useMemo(() => ({
    books,
    latestJournalIssue,
  }), [books, latestJournalIssue]);

  const leftSidebarContent = useMemo(() => {
    return getSidebarContent(
      validPlaceholders,
      ['placeHolder1', 'placeHolder2', 'placeHolder3'],
      widgetProps
    );
  }, [validPlaceholders, widgetProps]);
  
  const rightSidebarContent = useMemo(() => {
    return getSidebarContent(
      validPlaceholders,
      ['placeHolder4', 'placeHolder5', 'placeHolder6'],
      widgetProps
    );
  }, [validPlaceholders, widgetProps]);
  
  return (
    <BaseLayout
      globalSettings={globalSettings.globalSettings}
      leftSidebar={<>{leftSidebarContent}</>}
      mainContent={<MainContent articles={articles} placeholders={validPlaceholders} />}
      rightSidebar={<>{rightSidebarContent}</>}
    />
  );
};

export default HomeLayout;
