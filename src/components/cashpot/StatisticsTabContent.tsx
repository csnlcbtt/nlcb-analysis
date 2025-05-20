import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { CashpotTrendingNumbersTable } from './TrendingNumbersTable';
import { CashpotPairsTable } from './PairsTable';
import { CashpotTripletsTable } from './TripletsTable';

export function StatisticsTabContent() {
  const [tab, setTab] = useState('trending');
  return (
    <Card className="p-0">
      <div className="border-b px-6 pt-6 pb-2 bg-muted/40">
        <h3 className="text-xl font-semibold mb-2">Cashpot Statistics</h3>
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="mb-0 gap-2 bg-transparent">
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="pairs">Pairs</TabsTrigger>
            <TabsTrigger value="triplets">Triplets</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="p-6">
        {tab === 'trending' && <CashpotTrendingNumbersTable />}
        {tab === 'pairs' && <CashpotPairsTable />}
        {tab === 'triplets' && <CashpotTripletsTable />}
      </div>
    </Card>
  );
}
