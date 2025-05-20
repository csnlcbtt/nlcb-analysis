import React, { useState } from 'react';
import { DataTable } from '@/components/ui/DataTable';
import { useCsvData } from '@/lib/csvUtils';
import { Skeleton } from '@/components/ui/skeleton';

export function WinForLifeWeeklyTable() {
  const { data, loading, error } = useCsvData('/csv/wlweek.csv');
  const [currentPage, setCurrentPage] = useState(1);

  if (loading) return <Skeleton className="h-64 w-full" />;
  if (error) return <div className="text-red-500 p-4">Failed to load weekly data: {error.message}</div>;

  // Only show the last 12 weeks
  const trimmed = data.slice(-12).map(row => ({
    week: row["Week"],
    draw: row["Draw"],
    date: row["Draw Date"],
    tuesday: row["N2"],
    friday: row["N5"]
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-muted-foreground">
          Showing 1-{trimmed.length} of {trimmed.length} results
        </div>
      </div>
      <DataTable
        data={trimmed}
        columns={[
          { key: 'week', header: 'Week' },
          { key: 'draw', header: 'Draw' },
          { key: 'date', header: 'Draw Date' },
          { key: 'tuesday', header: 'Tuesday' },
          { key: 'friday', header: 'Friday' }
        ]}
      />
    </div>
  );
}

export { WinForLifeWeeklyTable as WeeklyTable };
