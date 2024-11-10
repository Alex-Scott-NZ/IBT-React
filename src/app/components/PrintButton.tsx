'use client'
import React from 'react';
import PrintIcon from '@mui/icons-material/Print';

const PrintButton = () => {
  const handlePrint = (e: React.MouseEvent) => {
    e.preventDefault();
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      className="text-communist-red border-none bg-transparent"
    >
      <PrintIcon className="fill-communist-red" style={{ fontSize: '2rem' }}/>
    </button>
  );
};

export default PrintButton;
