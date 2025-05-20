import React, { useState } from 'react';
import { DataTable } from '@/components/ui/DataTable';
import { useCsvData } from '@/lib/csvUtils';
import { Skeleton } from '@/components/ui/skeleton';

export function CashpotWeeklyTable() {
  const { data, loading, error } = useCsvData('/csv/cpweek.csv');
  if (loading) return <Skeleton className="h-64 w-full" />;
  if (error) return <div className="text-red-500 p-4">Failed to load weekly data: {error.message}</div>;

  // Only show the last 12 weeks
  const trimmed = data.slice(-12).map(row => ({
    week: row["Week"],
    draw: row["Draw"],
    date: row["DrawDate"],
    monday: row["Monday"],
    tuesday: row["Tuesday"],
    wednesday: row["Wednesday"],
    thursday: row["Thursday"],
    friday: row["Friday"],
    saturday: row["Saturday"]
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
          { key: 'monday', header: 'Monday' },
          { key: 'tuesday', header: 'Tuesday' },
          { key: 'wednesday', header: 'Wednesday' },
          { key: 'thursday', header: 'Thursday' },
          { key: 'friday', header: 'Friday' },
          { key: 'saturday', header: 'Saturday' }
        ]}
      />
    </div>
  );
}
export { CashpotWeeklyTable as WeeklyTable };
