import React, { useMemo, useState } from 'react';
import { DataTable } from '@/components/ui/DataTable';
import { useCsvData } from '@/lib/csvUtils';
import { Skeleton } from '@/components/ui/skeleton';

interface TableConfig {
  csv: string;
  columns: { key: string; header: string }[];
  sortBy: string[];
  ascending: boolean;
  filter?: (row: any) => boolean;
  mapRow?: (row: any) => any;
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export function PlayWhePredictionTable({ config }: { config: TableConfig }) {
  const { data, loading, error } = useCsvData(config.csv);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const processedData = useMemo(() => {
    let rows = data;
    if (config.filter) rows = rows.filter(config.filter);
    if (config.mapRow) rows = rows.map(config.mapRow);
    for (let i = config.sortBy.length - 1; i >= 0; i--) {
      const key = config.sortBy[i];
      rows = rows.sort((a, b) => {
        if (config.ascending) return (a[key] > b[key] ? 1 : -1);
        return (a[key] < b[key] ? 1 : -1);
      });
    }
    return rows;
  }, [data, config]);

  // Pagination logic
  const totalPages = Math.ceil(processedData.length / pageSize);
  const paginatedData = processedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (loading) return <Skeleton className="h-64 w-full" />;
  if (error) return <div className="text-red-500 p-4">Failed to load data: {error.message}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-muted-foreground">
          Showing {Math.min((currentPage - 1) * pageSize + 1, processedData.length)}-
          {Math.min(currentPage * pageSize, processedData.length)} of {processedData.length} results
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="prediction-page-size" className="text-xs">Page Size</label>
          <select
            id="prediction-page-size"
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
      <DataTable data={paginatedData} columns={config.columns} />
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
