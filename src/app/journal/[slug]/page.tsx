import { GraphQLClient } from 'graphql-request';
import { GET_JOURNAL_BY_URI } from '../../graphql/queries/getJournalIssueByUri';
import { JournalIssue } from '../../types/ArticlesInJournal';
import { GlobalSettingsData, BannerImageNode } from '../../types/Article';
import { GET_GLOBAL_SETTINGS } from '../../graphql/queries/getGlobalSettings';
import BaseLayoutNoSideBars from '../../layouts/BaseLayoutNoSideBars';
import Image from 'next/image';
import Link from 'next/link'; // Import Link for routing

const wpApiBaseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
const graphQLClient = new GraphQLClient(`${wpApiBaseUrl}/graphql`);

async function fetchJournal(slug: string): Promise<JournalIssue | null> {
  try {
    const uri = `/journal/${slug}/`;
    const data = await graphQLClient.request<{ journalIssueBy: JournalIssue }>(GET_JOURNAL_BY_URI, { uri });
    return data.journalIssueBy;
  } catch (error) {
    console.error('Error fetching journal:', error);
    return null;
  }
}

async function fetchBannerData(): Promise<BannerImageNode | null> {
  try {
    const data = await graphQLClient.request<GlobalSettingsData>(GET_GLOBAL_SETTINGS);
    return data.globalSettings.nodes[0]?.fGGlobalSettings.bannerImage.node || null;
  } catch (error) {
    console.error('Error fetching banner data:', error);
    return null;
  }
}

export default async function JournalPage({ params }: { params: { slug: string } }) {
  const [journal, bannerData] = await Promise.all([
    fetchJournal(params.slug),
    fetchBannerData()
  ]);

  if (!journal) {
    return <div>Journal not found</div>;
  }

  const { title, journalIssueDetails, featuredImage } = journal;
  const imageUrl = featuredImage?.node.mediaItemUrl || '';

  return (
    <BaseLayoutNoSideBars bannerData={bannerData}>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <div style={{ flex: '0 0 25%', marginRight: '20px' }}>
          <Image
            src={imageUrl}
            alt={title}
            width={300}  // Set the width to 300 pixels
            height={450} // Adjust the height to maintain the aspect ratio or change as desired
            layout="responsive"
            objectFit="cover"
          />
        </div>
        <div style={{ flex: '1' }}>
          <h1 style={{ margin: '0 0 20px', fontSize: '2rem', fontWeight: 'bold' }}>{title}</h1>
          {journalIssueDetails.articlesInJournal?.nodes?.map((article, index) => {
            const articleTitle = article.articleDetails.tableOfContentsTitle || article.title;
            return (
              <div key={index} className='mb-2'>
                <Link href={`/article/${article.slug}`} passHref>
                  <span className='text-communist-red text-xl font-Helvetica'>{articleTitle}</span>
                </Link>
              </div>
            );
          }) ?? <p>No articles found.</p>}
        </div>
      </div>
    </BaseLayoutNoSideBars>
  );
}
