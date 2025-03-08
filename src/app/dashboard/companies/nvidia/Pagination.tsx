'use client';

import React from 'react';

interface PaginationProps {
  currentPage: number;
  updatedSearchParams: Record<string, string | undefined>;
  loading: boolean;
  disableNext?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, updatedSearchParams, loading, disableNext = false }) => {
  const handleBackPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      window.location.href = `?${new URLSearchParams({ ...updatedSearchParams, page: String(newPage) }).toString()}`;
    }
  };

  const handleNextPage = () => {
    const newPage = currentPage + 1;
    window.location.href = `?${new URLSearchParams({ ...updatedSearchParams, page: String(newPage) }).toString()}`;
  };

  return (
    <div className="mt-4 flex justify-between items-center space-x-4">
      <button
        onClick={handleBackPage}
        disabled={loading || currentPage === 1}
        className={`text-white bg-gradient-to-br from-zinc-600 to-zinc-400 hover:bg-gradient-to-bl focus:ring-1 focus:outline-none focus:ring-zinc-300 font-medium rounded-lg text-sm px-5 py-2.5 ${
          loading || currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        Previous
      </button>

      <span className="text-lg font-semibold text-white">Page {currentPage}</span>

      <button
        onClick={handleNextPage}
        disabled={loading || disableNext}
        className={`text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-1 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 ${
          loading || disableNext ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
