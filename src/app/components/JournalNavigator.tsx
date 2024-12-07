"use client"
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Article } from '@/gql/gql-generated';
import { Box, Tabs, Tab } from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';

interface JournalCoverImage {
  mediaItemUrl?: string | null;
  altText?: string | null;
  thumbhash?: string | null;
}

interface JournalNavigatorProps {
  journalCoverImage: JournalCoverImage | null;
  journalSlug: string;
  journalTitle: string;
  articlesInJournal: Article[] | null;
  currentArticleSlug: string;
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const JournalNavigator: React.FC<JournalNavigatorProps> = ({
  journalCoverImage,
  journalSlug,
  journalTitle,
  articlesInJournal,
  currentArticleSlug,
}) => {
  const router = useRouter();
  const [value, setValue] = React.useState(() => 
    articlesInJournal?.findIndex(article => article.slug === currentArticleSlug) ?? 0
  );

  React.useEffect(() => {
    const newValue = articlesInJournal?.findIndex(
      article => article.slug === currentArticleSlug
    ) ?? 0;
    if (newValue !== value) {
      setValue(newValue);
    }
  }, [currentArticleSlug, articlesInJournal]);

  const handleChange = React.useCallback((event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue); // Keep this for smooth animation
    const article = articlesInJournal?.[newValue];
    if (article?.slug) {
      router.push(`/article/${article.slug}`);
    }
  }, [articlesInJournal, router]);

  const fallbackSVG = React.useMemo(() => 
    `data:image/svg+xml,%3Csvg width='768' height='131' viewBox='0 0 768 131' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='768' height='131' fill='%234B5563'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239CA3AF' font-family='system-ui' font-size='16'%3EImage Not Found%3C/text%3E%3C/svg%3E`,
    []
  );

  const tabsContent = React.useMemo(() => 
    articlesInJournal?.map((article, index) => (
      <Tab
        key={article.id}
        label={article.title}
        {...a11yProps(index)}
        sx={{
          textTransform: 'none',
          fontSize: '0.9rem',
          lineHeight: 1.2,
        }}
      />
    )),
    [articlesInJournal]
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        {journalCoverImage?.mediaItemUrl && (
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
        )}
      </Box>

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
        <Box
          sx={{
            flexGrow: 1,
            bgcolor: 'background.paper',
            width: '100%',
          }}
        >
          <Tabs
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
              },
            }}
          >
            {tabsContent}
          </Tabs>
        </Box>
      )}
    </Box>
  );
};

export default React.memo(JournalNavigator, (prevProps, nextProps) => {
  return (
    prevProps.journalSlug === nextProps.journalSlug &&
    prevProps.journalTitle === nextProps.journalTitle &&
    prevProps.articlesInJournal === nextProps.articlesInJournal &&
    prevProps.journalCoverImage?.mediaItemUrl === nextProps.journalCoverImage?.mediaItemUrl
  );
});
