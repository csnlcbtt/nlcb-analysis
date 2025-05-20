import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/DataTable';
import CommentSection from '@/components/ui/CommentSection';
import { useCsvData } from '@/lib/csvUtils';

// Define pagination size options
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const patternsConfig = [  {
    title: 'Current Sequential Combinations matching Previous Sequential Combinations',
    csv: '/csv/p4hznhist.csv',
    columns: [
      { key: 'Combis', header: 'Combis', width: 'auto', truncate: true },
      { key: 'Following', header: 'Following', width: 'auto', truncate: true },
      { key: 'ComPlay', header: 'ComPlay', width: 'auto' },
      { key: 'FollPlay', header: 'FollPlay', width: 'auto' },
      { key: 'Pct', header: 'Pct', width: 'auto' },
      { key: 'ComDrPlay', header: 'ComDrPlay', width: 'auto' }
    ],
    sortBy: ['Pct'],
    ascending: false,
    mapRow: row => ({
      Combis: row.Combis,
      Following: row.Following,
      ComPlay: row.ComPlay,
      FollPlay: row.FollPlay,
      Pct: row.Pct,
      ComDrPlay: row.ComDrPlay
    })
  },  {
    title: "Current Week's Patterns matching Previous Week's Patterns",
    csv: '/csv/p4wkass.csv',    columns: [
      { key: 'Combinations', header: 'Combinations', width: 'auto', truncate: true },
      { key: 'Associate', header: 'Associate', width: 'auto', truncate: true },
      { key: 'ComWksPlay', header: 'ComWksPlay', width: 'auto' },
      { key: 'ComAssWksPlay', header: 'ComAssWksPlay', width: 'auto' },
      { key: 'Pct', header: 'Pct', width: 'auto' },
      { key: 'ComAssWksPlay2', header: 'ComAssWksPlay2', width: 'auto' },
      { key: 'PlayThisWk', header: 'PlayThisWk', width: 'auto', truncate: true },
      { key: 'AssCtr', header: 'AssCtr', width: 'auto' }
    ],
    sortBy: ['ComWksPlay', 'Associate'],
    ascending: false,
    mapRow: row => ({
      Combinations: row.Combinations,
      Associate: row.Associate,
      ComWksPlay: row.ComWksPlay,
      ComAssWksPlay: row.ComAssWksPlay,
      Pct: row.Pct,
      ComAssWksPlay2: row.ComAssWksPlay2,
      PlayThisWk: row.PlayThisWk,
      AssCtr: row.AssCtr
    })
  }
];

const patternsMenuOptions = ['Table 001', 'Table 002'];

export function Pick4PredictionsTabContent() {
  const [selected, setSelected] = useState(0);
  const config = patternsConfig[selected];
  const { data, loading, error } = useCsvData(config.csv);
  // Process and sort data
  const processedData = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map(row => config.mapRow(row)).sort((a, b) => {
      for (const key of config.sortBy) {
        if (a[key] !== b[key]) {
          if (config.ascending) {
            return a[key] < b[key] ? -1 : 1;
          } else {
            return a[key] > b[key] ? -1 : 1;
          }
        }
      }
      return 0;
    });
  }, [data, config]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Default page size set to 10
  const totalPages = Math.max(1, Math.ceil(processedData.length / pageSize));
  const paginatedData = processedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Reset page when switching tables
  React.useEffect(() => { setCurrentPage(1); }, [selected]);

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6">{config.title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {patternsMenuOptions.map((label, idx) => (
          <Button
            key={label}
            variant={selected === idx ? 'destructive' : 'outline'}
            className="w-full"
            onClick={() => setSelected(idx)}
          >
            {label}
          </Button>
        ))}
      </div>
      {loading ? (
        <div className="h-32 flex items-center justify-center">Loading...</div>      ) : error ? (
        <div className="text-red-500 p-4">Failed to load predictions: {error.message}</div>
      ) : (
        <>
          {/* Table display with pagination info header */}
          <div className="mb-2">
            <div className="flex items-center justify-between">
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
          </div>

          {/* Data Table */}
          <DataTable data={paginatedData} columns={config.columns} className="table-auto" />
          
          {/* Pagination controls */}
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
        </>
      )}
      <div className="mt-8">
        <CommentSection />
      </div>
    </Card>
  );
}
