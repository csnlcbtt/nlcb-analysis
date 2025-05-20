import React, { useState } from 'react';
import { DataTable } from '@/components/ui/DataTable';
import { useCsvData, CsvData } from '@/lib/csvUtils';
import { Skeleton } from '@/components/ui/skeleton';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export function TrendingNumbersTable() {
  const { data, loading, error } = useCsvData('/csv/pwnctr.csv');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  if (loading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (error) {
    return <div className="text-red-500 p-4">Failed to load trending numbers: {error.message}</div>;
  }

  // Process the data for display
  const processedData = data
    .map(row => ({
      no: Number(row.No),
      prvAllDr: Number(row.PrvAllDr),
      prv24Dr: Number(row.Prv24Dr),
      prv48Dr: Number(row.Prv48Dr),
      prv72Dr: Number(row.Prv72Dr),
      prv96Dr: Number(row.Prv96Dr)
    }))
    .sort((a, b) => b.prvAllDr - a.prvAllDr);

  // Pagination logic
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
          { key: 'prvAllDr', header: 'PrvAllDr' },
          { key: 'prv24Dr', header: 'Prv24Dr' },
          { key: 'prv48Dr', header: 'Prv48Dr' },
          { key: 'prv72Dr', header: 'Prv72Dr' },
          { key: 'prv96Dr', header: 'Prv96Dr' }
        ]}
        className="table-auto"
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
