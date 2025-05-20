import React from 'react';
import Layout from '@/components/layout/Layout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import CommentSection from '@/components/ui/CommentSection';
import { Button } from '@/components/ui/button';
import { ChartBar } from 'lucide-react';
import { Pick4ChartsTabContent } from '@/components/pick4/ChartsTabContent';
import { SearchTabContent } from '@/components/pick4/SearchTabContent';
import { StatisticsTabContent } from '@/components/pick4/StatisticsTabContent';
import { Pick4PredictionsTabContent } from '@/components/pick4/PredictionsTabContent';

const Pick4 = () => {
  
  return (
    <Layout>
      <div className="container py-6">
        <PageHeader 
          title="PICK4 Analysis" 
          description="View charts, tables, and analytics for PICK4"
        />

        <Tabs defaultValue="charts" className="w-full">
          <div className="flex justify-between items-center border-b mb-4">
            <TabsList className="grid grid-cols-4 w-auto">
              <TabsTrigger value="charts" className="px-6">
                <ChartBar className="w-4 h-4 mr-2" />
                Charts
              </TabsTrigger>
              <TabsTrigger value="search" className="px-6">Search</TabsTrigger>
              <TabsTrigger value="statistics" className="px-6">Statistics</TabsTrigger>
              <TabsTrigger value="predictions" className="px-6">Predictions</TabsTrigger>
            </TabsList>
          </div>
            <TabsContent value="charts">
            <Pick4ChartsTabContent />
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
          
          <TabsContent value="predictions">
            <Pick4PredictionsTabContent />
            
            <div className="mt-8">
              <CommentSection />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Pick4;
