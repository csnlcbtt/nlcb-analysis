import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pick2TrendingNumbersTable } from '@/components/tables/Pick2TrendingNumbersTable';
import { Pick2PairsTable } from '@/components/tables/Pick2PairsTable';
import CommentSection from '@/components/ui/CommentSection';

export function StatisticsTabContent() {
  const [selected, setSelected] = useState<'trending' | 'pairs'>('trending');

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
          <div className="grid grid-cols-1 gap-4">
            <Button
              variant={selected === 'pairs' ? 'destructive' : 'outline'}
              className="w-full"
              onClick={() => setSelected('pairs')}
            >
              Popular Pairs
            </Button>
          </div>
        </div>
        {selected === 'trending' && <><h3 className="text-xl font-semibold mb-4">Trending Numbers</h3><Pick2TrendingNumbersTable /></>}
        {selected === 'pairs' && <><h3 className="text-xl font-semibold mb-4">Popular Pairs</h3><Pick2PairsTable /></>}
      </Card>
      <div className="mt-8">
        <CommentSection />
      </div>
    </>
  );
}
