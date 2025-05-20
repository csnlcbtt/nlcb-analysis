import React, { useState } from 'react';
import { DataTable } from '@/components/ui/DataTable';
import { useCsvData } from '@/lib/csvUtils';
import { Skeleton } from '@/components/ui/skeleton';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export function CashpotPairsTable() {
  const { data, loading, error } = useCsvData('/csv/cpcpairs.csv');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  if (loading) return <Skeleton className="h-64 w-full" />;
  if (error) return <div className="text-red-500 p-4">Failed to load pairs: {error.message}</div>;

  const processedData = data
    .map(row => ({
      pair: row["Combinations"] || row["Combi"],
      count: Number(row["Played"] || row["Play"]),
      draws: row["Draws"]
    }))
    .sort((a, b) => b.count - a.count);

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
          <label htmlFor="pair-page-size" className="text-xs">Page Size</label>
          <select
            id="pair-page-size"
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
          { key: 'pair', header: 'Pair' },
          { key: 'count', header: 'Count' },
          { key: 'draws', header: 'Draws' }
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
