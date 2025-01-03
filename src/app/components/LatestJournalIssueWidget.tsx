"use client";

import React from 'react';
import { GetJournalIssuesLatestQuery } from '../../gql/gql-generated';
import { getImageUrl } from '../utils/imageHelpers';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from "next/image";

interface LatestJournalIssueWidgetProps {
  latestJournalIssue: GetJournalIssuesLatestQuery
}

const LatestJournalIssueWidget: React.FC<LatestJournalIssueWidgetProps> = ({ latestJournalIssue }) => {
  const router = useRouter();

  if (!latestJournalIssue) {
    return <p>No latest journal issue available.</p>;
  }

  const latestIssue = latestJournalIssue.journalIssues?.nodes[0];

  const handleJournalClick = (slug: string | null | undefined) => {
    if (slug) {
      router.push(`/journal/${slug}`);
    }
  };

  return (
    <div className="relative mb-4">
      <div className="mb-2 flex justify-between items-center">
        <Link href="/journal" passHref>
          <h5 className="font-telegrafico text-gray-900 mt-0 mb-0 text-xl font-light hover:bg-gray-400/5 transition-colors">
            Latest Journal
          </h5>
        </Link>
      </div>

      <div 
        onClick={() => handleJournalClick(latestIssue?.slug)}
        className="w-full cursor-pointer transition-colors hover:bg-gray-400/10"
      >
        <div>
          {/* Image Container */}
          <div className="w-1/2 relative flex-shrink-0 mr-2">
            <Image
              src={getImageUrl(latestIssue?.featuredImage?.node, 164)}
              alt={latestIssue?.featuredImage?.node?.altText || latestIssue?.title || 'Latest Journal Issue'}
              width={0}
              height={0}
              sizes="(max-width: 768px) 100vw, 33vw"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
          
          {/* Text Container */}
          <div className="flex-1">
            <h6 className="font-helvetica text-sm text-gray-600 font-bold m-0">
              {latestIssue?.title}
            </h6>

          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(LatestJournalIssueWidget);
