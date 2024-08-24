'use client';
import React from 'react';

interface SiteWideNoticeProps {
  notificationData: {
    notificationOnoff: boolean;
    notificationMessage: string;
  } | undefined;
}

const SiteWideNotice: React.FC<SiteWideNoticeProps> = ({ notificationData }) => {
  if (!notificationData?.notificationOnoff) {
    return null;
  }

  return (
    <div className="w-full bg-communist-red text-custom-bg px-2 py-1">
      <span>{notificationData.notificationMessage}</span>
    </div>
  );
};

export default SiteWideNotice;
