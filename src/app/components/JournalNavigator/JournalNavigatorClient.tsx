// app/components/JournalNavigator/JournalNavigatorClient.tsx
'use client';
import React, { useState, useMemo, useCallback } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { GetArticleByUriQuery } from '@/gql/gql-generated';

// Add the missing a11yProps function
function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

interface JournalNavigatorClientProps {
  initialData: GetArticleByUriQuery;
}

export default function JournalNavigatorClient({ initialData }: JournalNavigatorClientProps) {
  console.log('Client component - initialData:', initialData);

  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState(0);
  
  // Add safety check for initialData
  if (!initialData?.article) {
    console.log('No article data available');
    return null;
  }

  const article = initialData.article;
  const articleSlug = pathname.split('/').pop();
  const fallbackSVG = `data:image/svg+xml,%3Csvg width='768' height='131' viewBox='0 0 768 131' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='768' height='131' fill='%234B5563'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239CA3AF' font-family='system-ui' font-size='16'%3EImage Not Found%3C/text%3E%3C/svg%3E`;

  const {
    relatedJournal,
    journalCoverImage,
    journalTitle,
    journalSlug,
    articlesInJournal,
  } = useMemo(() => {
    const relatedJournalNode = article?.articleDetails?.relatedJournal?.nodes?.[0];
    const isJournalIssue = relatedJournalNode?.__typename === 'JournalIssue';

    return {
      relatedJournal: relatedJournalNode,
      journalCoverImage: isJournalIssue
        ? relatedJournalNode?.featuredImage?.node
        : undefined,
      journalTitle: isJournalIssue ? relatedJournalNode?.title : undefined,
      journalSlug: isJournalIssue ? relatedJournalNode?.slug : undefined,
      articlesInJournal: isJournalIssue
        ? relatedJournalNode?.journalIssueDetails?.articlesInJournal?.nodes || []
        : [],
    };
  }, [article]);

  const currentIndex = useMemo(() => {
    if (!articlesInJournal || !articleSlug) return 0;
    const idx = articlesInJournal.findIndex((a) => a.slug === articleSlug);
    return idx === -1 ? 0 : idx;
  }, [articlesInJournal, articleSlug]);

  // Set initial value based on currentIndex
  React.useEffect(() => {
    setValue(currentIndex);
  }, [currentIndex]);

  const handleChange = useCallback(
    (event: React.SyntheticEvent, newValue: number) => {
      const article = articlesInJournal?.[newValue];
      if (article?.slug) {
        setValue(newValue);
        router.push(`/article/${article.slug}`, { scroll: false });
      }
    },
    [articlesInJournal, router]
  );

  const tabsContent = useMemo(
    () =>
      articlesInJournal
        ?.map((article, index) => {
          if (article.__typename !== 'Article') return null;

          return (
            <Tab
              key={article.id}
              label={article.title || ''}
              {...a11yProps(index)}
              sx={{
                textTransform: 'none',
                fontSize: '0.9rem',
                lineHeight: 1.2,
              }}
            />
          );
        })
        .filter(Boolean) ?? [],
    [articlesInJournal]
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {journalCoverImage?.mediaItemUrl && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Link href={`/journal/${journalSlug}`} passHref>
            <Image
              src={journalCoverImage.mediaItemUrl}
              alt={journalCoverImage.altText || journalTitle || 'Journal cover'}
              width={150}
              height={225}
              priority={true}
              quality={75}
              className="w-full h-auto mt-3"
              placeholder="blur"
              blurDataURL={journalCoverImage.thumbhash || fallbackSVG}
              style={{ maxWidth: '75%' }}
            />
          </Link>
        </Box>
      )}

      {journalTitle && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Link href={`/journal/${journalSlug}`} passHref>
            <span className="text-base font-semibold text-communist-red hover:underline">
              {journalTitle}
            </span>
          </Link>
        </Box>
      )}

      {articlesInJournal && articlesInJournal.length > 0 && (
        <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', width: '100%' }}>
          <Tabs
            key={`tabs-${articlesInJournal.length}-${currentIndex}`}
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            aria-label="Article navigation"
            sx={{
              borderRight: 1,
              borderColor: 'divider',
              minWidth: '200px',
              '& .MuiTab-root': {
                alignItems: 'flex-start',
                textAlign: 'left',
                justifyContent: 'flex-start',
                minHeight: 'unset',
                py: 1,
                px: 2,
              },
              '& .Mui-selected': {
                color: '#CE1126 !important',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#CE1126',
                left: 0,
                transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
              },
              '& .MuiTabs-scroller': {
                position: 'relative',
              },
              '& .MuiTabs-flexContainer': {
                position: 'relative',
              },
            }}
          >
            {tabsContent}
          </Tabs>
        </Box>
      )}
    </Box>
  );
}
