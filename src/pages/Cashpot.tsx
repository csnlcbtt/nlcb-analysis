import React from 'react';
import Layout from '@/components/layout/Layout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { DataTable } from '@/components/ui/DataTable';
import CommentSection from '@/components/ui/CommentSection';
import { SearchTabContent } from '@/components/cashpot/SearchTabContent';
import { StatisticsTabContent } from '@/components/cashpot/StatisticsTabContent';
import { WeeklyTable as CashpotWeeklyTable } from '@/components/cashpot/WeeklyTable';
import { Search } from 'lucide-react';

const Cashpot = () => {
  return (
    <Layout>
      <div className="container py-6">
        <PageHeader 
          title="Cashpot Analysis" 
          description="View results, patterns and analytics for Cashpot"
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
                  { drawNo: 7467, drawDate: "Fri 16-May-2025", allNos: "6,8,13,14,19", mu: 1, wins: 1, draws: "7468", nfpd: 1 },
                  { drawNo: 7466, drawDate: "Thu 15-May-2025", allNos: "8,9,15,16,20", mu: 2, wins: 1, draws: "7467", nfpd: 2 },
                  { drawNo: 7465, drawDate: "Wed 14-May-2025", allNos: "1,8,14,17,20", mu: 3, wins: 2, draws: "7466,2166", nfpd: 2 },
                  { drawNo: 7464, drawDate: "Tue 13-May-2025", allNos: "6,14,15,19,20", mu: 4, wins: 1, draws: "7465", nfpd: 1 },
                  { drawNo: 7463, drawDate: "Mon 12-May-2025", allNos: "3,9,11,13,19", mu: 2, wins: 2, draws: "7464,1669", nfpd: 1 },
                  { drawNo: 7462, drawDate: "Sat 10-May-2025", allNos: "2,5,9,17,18", mu: 3, wins: 2, draws: "7463,159", nfpd: 1 },
                  { drawNo: 7461, drawDate: "Fri 09-May-2025", allNos: "6,11,16,17,19", mu: 3, wins: 1, draws: "7462", nfpd: 1 },
                  { drawNo: 7460, drawDate: "Thu 08-May-2025", allNos: "4,7,12,19,20", mu: 3, wins: 1, draws: "7461", nfpd: 2 },
                  { drawNo: 7459, drawDate: "Wed 07-May-2025", allNos: "4,6,7,13,14", mu: 1, wins: 2, draws: "7460,1908", nfpd: 2 },
                  { drawNo: 7458, drawDate: "Tue 06-May-2025", allNos: "4,8,9,14,18", mu: 3, wins: 2, draws: "7459,1379", nfpd: 1 }
                ]}
                columns={[
                  { key: 'drawNo', header: 'DrawNo' },
                  { key: 'drawDate', header: 'DrawDates' },
                  { key: 'allNos', header: 'AllNos' },
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
              <h3 className="text-xl font-semibold mb-4">Weekly Cashpot Analysis</h3>
              <CashpotWeeklyTable />
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

export default Cashpot;
