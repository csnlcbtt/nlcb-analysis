
import React from 'react';
import { DataTable } from '@/components/ui/DataTable';
import { useCsvData } from '@/lib/csvUtils';
import { Skeleton } from '@/components/ui/skeleton';

export function SequentialCombinationsTable() {
  const { data, loading, error } = useCsvData('/csv/pwhzprjcur.csv');

  if (loading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (error) {
    return <div className="text-red-500 p-4">Failed to load combinations data: {error.message}</div>;
  }

  // Process the data for display
  const processedData = data
    .filter(row => Number(row.Pct) > 10) // Filter to only show high probability combinations
    .map((row, index) => ({
      combis: row.Combis,
      following: row.Following,
      comPlay: Number(row.ComPlay),
      follPlay: Number(row.FollPlay),
      pct: Number(row.Pct).toFixed(2),
      combDrPlay: row.ComDrPlay || 'Normal'
    }))
    .sort((a, b) => parseFloat(b.pct) - parseFloat(a.pct)) // Sort by percentage descending
    .slice(0, 10); // Take top 10

  return (
    <DataTable
      data={processedData}
      columns={[
        { key: 'combis', header: 'Combis' },
        { key: 'following', header: 'Following' },
        { key: 'comPlay', header: 'ComPlay' },
        { key: 'follPlay', header: 'FollPlay' },
        { key: 'pct', header: 'Pct' },
        { key: 'combDrPlay', header: 'CombDrPlay' }
      ]}
    />
  );
}
