
import React from 'react';
import Layout from '@/components/layout/Layout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { TabsNavigation } from '@/components/playwhe/TabsNavigation';
import { ChartsTabContent } from '@/components/playwhe/ChartsTabContent';
import { SearchTabContent } from '@/components/playwhe/SearchTabContent';
import { StatisticsTabContent } from '@/components/playwhe/StatisticsTabContent';
import { PredictionsTabContent } from '@/components/playwhe/PredictionsTabContent';

const PlayWhe = () => {
  return (
    <Layout>
      <div className="container py-6">
        <PageHeader 
          title="PlayWhe Analysis" 
          description="View charts, tables, and analytics for PlayWhe"
        />

        <Tabs defaultValue="charts" className="w-full">
          <TabsNavigation />
          
          <TabsContent value="charts">
            <ChartsTabContent />
          </TabsContent>
          
          <TabsContent value="search">
            <SearchTabContent />
          </TabsContent>
          
          <TabsContent value="statistics">
            <StatisticsTabContent />
          </TabsContent>
          
          <TabsContent value="predictions">
            <PredictionsTabContent />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default PlayWhe;
