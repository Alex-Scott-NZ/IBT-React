'use client';
import React from 'react';

import { FgGlobalSettingsNotificationBar } from '@/gql/graphql';

interface SiteWideNoticeProps {
  notificationData: FgGlobalSettingsNotificationBar | null | undefined
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
