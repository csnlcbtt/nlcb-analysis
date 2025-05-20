import React from 'react';
import Layout from '@/components/layout/Layout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { DataTable } from '@/components/ui/DataTable';
import CommentSection from '@/components/ui/CommentSection';
import { SearchTabContent } from '@/components/lotto/SearchTabContent';
import { StatisticsTabContent } from '@/components/lotto/StatisticsTabContent';
import { WeeklyTable as LottoWeeklyTable } from '@/components/lotto/WeeklyTable';
import { Search } from 'lucide-react';

const Lotto = () => {
  return (
    <Layout>
      <div className="container py-6">
        <PageHeader 
          title="Lotto Analysis" 
          description="View results, patterns and analytics for Lotto"
        />

        <Tabs defaultValue="daily" className="w-full">
          <div className="flex justify-between items-center border-b mb-4">
            <TabsList className="grid grid-cols-4 w-auto">
              <TabsTrigger value="daily" className="px-6">Daily</TabsTrigger>
              <TabsTrigger value="weekly" className="px-6">Weekly</TabsTrigger>
              <TabsTrigger value="search" className="px-6">Search</TabsTrigger>
              <TabsTrigger value="statistics" className="px-6">Statistics</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="daily">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Last 12 Draws</h3>
              
              <DataTable 
                data={[
                  { drawNo: 2427, drawDates: "Wed 14-May-2025", allNos: "13,14,16,17,20", pb: 3, mu: 4, wins: 1, draws: "2428", nfpd: 0 },
                  { drawNo: 2426, drawDates: "Sat 10-May-2025", allNos: "3,4,22,24,30", pb: 6, mu: 3, wins: 1, draws: "2427", nfpd: 1 },
                  { drawNo: 2425, drawDates: "Wed 07-May-2025", allNos: "7,11,16,21,30", pb: 5, mu: 4, wins: 1, draws: "2426", nfpd: 0 },
                  { drawNo: 2424, drawDates: "Sat 03-May-2025", allNos: "2,10,13,28,29", pb: 5, mu: 20, wins: 1, draws: "2425", nfpd: 2 },
                  { drawNo: 2423, drawDates: "Wed 30-Apr-2025", allNos: "10,19,26,29,33", pb: 9, mu: 4, wins: 1, draws: "2424", nfpd: 2 },
                  { drawNo: 2422, drawDates: "Sat 26-Apr-2025", allNos: "3,16,19,26,27", pb: 3, mu: 20, wins: 1, draws: "2423", nfpd: 1 },
                  { drawNo: 2421, drawDates: "Wed 23-Apr-2025", allNos: "19,20,23,25,33", pb: 2, mu: 3, wins: 1, draws: "2422", nfpd: 2 },
                  { drawNo: 2420, drawDates: "Sat 19-Apr-2025", allNos: "2,9,23,33,35", pb: 8, mu: 4, wins: 1, draws: "2421", nfpd: 1 },
                  { drawNo: 2419, drawDates: "Wed 16-Apr-2025", allNos: "1,3,17,24,33", pb: 4, mu: 3, wins: 1, draws: "2420", nfpd: 1 },
                  { drawNo: 2418, drawDates: "Sat 12-Apr-2025", allNos: "7,8,20,22,24", pb: 9, mu: 3, wins: 1, draws: "2419", nfpd: 0 }
                ]}
                columns={[
                  { key: 'drawNo', header: 'DrawNo' },
                  { key: 'drawDates', header: 'DrawDates' },
                  { key: 'allNos', header: 'AllNos' },
                  { key: 'pb', header: 'PB' },
                  { key: 'mu', header: 'MU' },
                  { key: 'wins', header: 'Wins' },
                  { key: 'draws', header: 'Draws' },
                  { key: 'nfpd', header: 'Nfpd' }
                ]}
              />
            </Card>
            
            <div className="mt-8">
              <CommentSection />
            </div>
          </TabsContent>
          
          <TabsContent value="weekly">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Weekly Lotto Analysis</h3>
              <LottoWeeklyTable />
            </Card>
            
            <div className="mt-8">
              <CommentSection />
            </div>
          </TabsContent>
          
          <TabsContent value="search">
            <SearchTabContent />
            
            <div className="mt-8">
              <CommentSection />
            </div>
          </TabsContent>
          
          <TabsContent value="statistics">
            <StatisticsTabContent />
            
            <div className="mt-8">
              <CommentSection />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Lotto;
