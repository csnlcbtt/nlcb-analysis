import React from 'react';
import Layout from '@/components/layout/Layout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { DataTable } from '@/components/ui/DataTable';
import CommentSection from '@/components/ui/CommentSection';
import { SearchTabContent } from '@/components/winforlife/SearchTabContent';
import { StatisticsTabContent } from '@/components/winforlife/StatisticsTabContent';
import { WeeklyTable as WinForLifeWeeklyTable } from '@/components/winforlife/WeeklyTable';
import { Search } from 'lucide-react';

const WinForLife = () => {
  return (
    <Layout>
      <div className="container py-6">
        <PageHeader 
          title="WinForLife Analysis" 
          description="View results, patterns and analytics for WinForLife"
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
                  { drawNo: 327, drawDates: "Fri 16-May-2025", allNos: "15,16,17,18,23", cBall: 3, wins: 1, draws: 327, nfpd: 0 },
                  { drawNo: 326, drawDates: "Tue 13-May-2025", allNos: "3,4,11,13,25", cBall: 3, wins: 1, draws: 326, nfpd: 1 },
                  { drawNo: 325, drawDates: "Fri 09-May-2025", allNos: "2,7,15,16,19,24", cBall: 2, wins: 1, draws: 325, nfpd: 1 },
                  { drawNo: 324, drawDates: "Tue 06-May-2025", allNos: "2,8,9,10,21,26", cBall: 3, wins: 1, draws: 324, nfpd: 1 },
                  { drawNo: 323, drawDates: "Fri 02-May-2025", allNos: "1,14,15,16,18,24", cBall: 3, wins: 1, draws: 323, nfpd: 2 },
                  { drawNo: 322, drawDates: "Tue 29-Apr-2025", allNos: "8,11,19,21,25,26", cBall: 3, wins: 1, draws: 322, nfpd: 2 },
                  { drawNo: 321, drawDates: "Fri 25-Apr-2025", allNos: "4,5,10,13,21,25", cBall: 2, wins: 1, draws: 321, nfpd: 0 },
                  { drawNo: 320, drawDates: "Tue 22-Apr-2025", allNos: "14,18,20,22,24", cBall: 2, wins: 1, draws: 320, nfpd: 1 },
                  { drawNo: 319, drawDates: "Tue 15-Apr-2025", allNos: "4,12,20,23,25,26", cBall: 1, wins: 1, draws: 319, nfpd: 1 },
                  { drawNo: 318, drawDates: "Fri 11-Apr-2025", allNos: "1,3,4,9,11,17", cBall: 1, wins: 1, draws: 318, nfpd: 1 }
                ]}
                columns={[
                  { key: 'drawNo', header: 'DrawNo' },
                  { key: 'drawDates', header: 'DrawDates' },
                  { key: 'allNos', header: 'AllNos' },
                  { key: 'cBall', header: 'CBall' },
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
              <h3 className="text-xl font-semibold mb-4">Weekly WinForLife Analysis</h3>
              <WinForLifeWeeklyTable />
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

export default WinForLife;
