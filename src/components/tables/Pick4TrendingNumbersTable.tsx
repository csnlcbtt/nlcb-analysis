import React, { useState } from 'react';
import { DataTable } from '@/components/ui/DataTable';
import { useCsvData } from '@/lib/csvUtils';
import { Skeleton } from '@/components/ui/skeleton';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export function Pick4TrendingNumbersTable() {
  const { data, loading, error } = useCsvData('/csv/p4nctr.csv');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  if (loading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (error) {
    return <div className="text-red-500 p-4">Failed to load trending numbers: {error.message}</div>;
  }

  const processedData = data
    .map(row => ({
      no: row.No,
      all: Number(row.PrvAllDr),
      last24: Number(row.Prv24Dr),
      last48: Number(row.Prv48Dr),
      last72: Number(row.Prv72Dr),
      last96: Number(row.Prv96Dr)
    }))
    .sort((a, b) => b.all - a.all);

  const totalPages = Math.ceil(processedData.length / pageSize);
  const paginatedData = processedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-muted-foreground">
          Showing {Math.min((currentPage - 1) * pageSize + 1, processedData.length)}-
          {Math.min(currentPage * pageSize, processedData.length)} of {processedData.length} results
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="trending-page-size" className="text-xs">Page Size</label>
          <select
            id="trending-page-size"
            className="p-1 rounded border text-xs bg-background text-foreground border-border focus:outline-none focus:ring-2 focus:ring-primary"
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            {PAGE_SIZE_OPTIONS.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      </div>
      <DataTable
        data={paginatedData}
        columns={[
          { key: 'no', header: 'No' },
          { key: 'all', header: 'All' },
          { key: 'last24', header: 'Last 24' },
          { key: 'last48', header: 'Last 48' },
          { key: 'last72', header: 'Last 72' },
          { key: 'last96', header: 'Last 96' }
        ]}
      />
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-2">
          <button
            className="px-2 py-1 border rounded disabled:opacity-50"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span className="text-xs">Page {currentPage} of {totalPages}</span>
          <button
            className="px-2 py-1 border rounded disabled:opacity-50"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
