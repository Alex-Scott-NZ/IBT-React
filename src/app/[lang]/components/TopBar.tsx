// src/app/[lang]/components/TopBar.tsx

import React from 'react';

const TopBar = () => {
  return (
    <>
      <div className="w-full bg-communist-red h-4 fixed top-0 z-50"></div>
      <div className="h-4"></div>
    </>
  )
};

export default React.memo(TopBar);
