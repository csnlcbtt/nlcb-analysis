import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingNumbersTable } from '@/components/tables/TrendingNumbersTable';
import { PopularPairsTable } from '@/components/tables/PopularPairsTable';
import { PopularTripletsTable } from '@/components/tables/PopularTripletsTable';
import CommentSection from '@/components/ui/CommentSection';

export function StatisticsTabContent() {
  const [selected, setSelected] = useState<'trending' | 'pairs' | 'triplets'>('trending');

  return (
    <>
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Button
            variant={selected === 'trending' ? 'destructive' : 'outline'}
            className="w-full"
            onClick={() => setSelected('trending')}
          >
            Trending Numbers
          </Button>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={selected === 'pairs' ? 'destructive' : 'outline'}
              className="w-full"
              onClick={() => setSelected('pairs')}
            >
              Popular Pairs
            </Button>
            <Button
              variant={selected === 'triplets' ? 'destructive' : 'outline'}
              className="w-full"
              onClick={() => setSelected('triplets')}
            >
              Popular Triplets
            </Button>
          </div>
        </div>
        {selected === 'trending' && <><h3 className="text-xl font-semibold mb-4">Trending Numbers</h3><TrendingNumbersTable /></>}
        {selected === 'pairs' && <><h3 className="text-xl font-semibold mb-4">Popular Pairs</h3><PopularPairsTable /></>}
        {selected === 'triplets' && <><h3 className="text-xl font-semibold mb-4">Popular Triplets</h3><PopularTripletsTable /></>}
      </Card>
      <div className="mt-8">
        <CommentSection />
      </div>
    </>
  );
}
