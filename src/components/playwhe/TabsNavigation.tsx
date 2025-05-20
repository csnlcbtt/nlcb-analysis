import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartBar, Search as SearchIcon, BarChart } from 'lucide-react';

export function TabsNavigation() {
  return (
    <div className="flex justify-between items-center border-b mb-4">
      <TabsList className="grid grid-cols-4 w-auto">
        <TabsTrigger value="charts" className="px-6">
          <ChartBar className="w-4 h-4 mr-2" />
          Charts
        </TabsTrigger>
        <TabsTrigger value="search" className="px-6">
          <SearchIcon className="w-4 h-4 mr-2" />
          Search
        </TabsTrigger>
        <TabsTrigger value="statistics" className="px-6">
          <BarChart className="w-4 h-4 mr-2" />
          Statistics
        </TabsTrigger>
        <TabsTrigger value="predictions" className="px-6">Predictions</TabsTrigger>
      </TabsList>
    </div>
  );
}
