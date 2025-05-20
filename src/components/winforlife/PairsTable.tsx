import React, { useState } from 'react';
import { DataTable } from '@/components/ui/DataTable';
import { useCsvData } from '@/lib/csvUtils';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export function WinForLifePairsTable() {
  const { data, loading, error } = useCsvData('/csv/wlcpairs.csv');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  if (loading) return <Skeleton className="h-64 w-full" />;
  if (error) return <div className="text-red-500 p-4">Failed to load pairs: {error.message}</div>;

  let processedData = [];
  let dataError = null;
  try {
    processedData = data
      .map(row => {
        const pair = row["Combinations"] || row["Combi"] || row["Pair"] || row["pair"] || '';
        const count = Number(row["Played"] || row["Play"] || row["Count"] || row["count"] || 0);
        const draws = row["Draws"] || row["draws"] || '';
        return { pair, count, draws };
      })
      .filter(row => row.pair && !isNaN(row.count))
      .sort((a, b) => b.count - a.count);
  } catch (e) {
    dataError = e;
    processedData = [];
  }

  const totalPages = Math.max(1, Math.ceil(processedData.length / pageSize));
  const paginatedData = processedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Reset to first page if pageSize changes and currentPage is out of range
  React.useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [pageSize, totalPages, currentPage]);

  let renderError = null;
  let content = null;
  try {
    content = (
      <>
        <div className="text-xs text-blue-500 mb-2">[DEBUG] WinForLifePairsTable rendered. Data length: {processedData.length}</div>
        {dataError && (
          <div className="text-center text-red-500 py-8">Error processing pair data: {String(dataError)}</div>
        )}
        <DataTable
          data={processedData}
          columns={[
            { key: 'pair', header: 'Pair' },
            { key: 'count', header: 'Count' },
            { key: 'draws', header: 'Draws' }
          ]}
        />
        {processedData.length === 0 && !dataError && (
          <div className="text-center text-muted-foreground py-8">No valid pair data found.</div>
        )}
      </>
    );
  } catch (e) {
    renderError = e;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-muted-foreground">
          Showing {processedData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}-
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
            aria-label="Select page size"
          >
            {PAGE_SIZE_OPTIONS.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      </div>
      {renderError && (
        <div className="text-center text-red-500 py-8">Render error: {String(renderError)}</div>
      )}
      {content}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-2">
          <Button
            className="px-2 py-1 border rounded disabled:opacity-50"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            aria-label="First Page"
          >
            First
          </Button>
          <Button
            className="px-2 py-1 border rounded disabled:opacity-50"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            aria-label="Previous Page"
          >
            Prev
          </Button>
          <span className="text-xs">Page {currentPage} of {totalPages}</span>
          <Button
            className="px-2 py-1 border rounded disabled:opacity-50"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            aria-label="Next Page"
          >
            Next
          </Button>
          <Button
            className="px-2 py-1 border rounded disabled:opacity-50"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            aria-label="Last Page"
          >
            Last
          </Button>
        </div>
      )}
    </div>
  );
}
