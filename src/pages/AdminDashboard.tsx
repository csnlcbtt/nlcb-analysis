
import React from 'react';
import Layout from '@/components/layout/Layout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/DataTable';
import {
  BarChart,
  LineChart,
  Users,
  MessagesSquare,
  TrendingUp,
  Settings
} from 'lucide-react';

const AdminDashboard = () => {
  const visitorStats = [
    { date: '2025-05-16', visitors: 342, pageViews: 1245, avgTimeOnSite: '00:03:28' },
    { date: '2025-05-15', visitors: 301, pageViews: 1089, avgTimeOnSite: '00:03:12' },
    { date: '2025-05-14', visitors: 287, pageViews: 954, avgTimeOnSite: '00:02:57' },
    { date: '2025-05-13', visitors: 310, pageViews: 1102, avgTimeOnSite: '00:03:05' },
    { date: '2025-05-12', visitors: 299, pageViews: 1057, avgTimeOnSite: '00:03:18' },
    { date: '2025-05-11', visitors: 264, pageViews: 891, avgTimeOnSite: '00:02:46' },
    { date: '2025-05-10', visitors: 245, pageViews: 823, avgTimeOnSite: '00:02:39' }
  ];

  const recentComments = [
    { id: 1, name: 'John D.', page: '/playwhe', comment: 'Great analysis on the latest drawing patterns!', date: '2025-05-16' },
    { id: 2, name: 'Sarah M.', page: '/pick4', comment: 'When will the next update be available?', date: '2025-05-15' },
    { id: 3, name: 'Michael T.', page: '/lotto', comment: 'Thanks for the insights, very helpful.', date: '2025-05-15' },
    { id: 4, name: 'Lisa R.', page: '/cashpot', comment: 'Can you add more historical data to the charts?', date: '2025-05-14' },
    { id: 5, name: 'Robert K.', page: '/about', comment: 'Found a small issue with the disclaimer section.', date: '2025-05-14' }
  ];

  return (
    <Layout>
      <div className="container py-6">
        <PageHeader 
          title="Admin Dashboard" 
          description="Manage your site analytics and content"
        >
          <Button size="sm" variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </PageHeader>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,048</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Page Views</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7,161</div>
              <p className="text-xs text-muted-foreground">+4% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Comments</CardTitle>
              <MessagesSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">83</div>
              <p className="text-xs text-muted-foreground">+22% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg. Engagement</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3:05</div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="analytics" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="content">Content Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="analytics">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Traffic Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-muted/10 rounded-md">
                  <div className="text-center p-6">
                    <LineChart className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Traffic analytics visualization would appear here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Daily Visitor Data</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable 
                  data={visitorStats}
                  columns={[
                    { key: 'date', header: 'Date' },
                    { key: 'visitors', header: 'Visitors' },
                    { key: 'pageViews', header: 'Page Views' },
                    { key: 'avgTimeOnSite', header: 'Avg. Time on Site' }
                  ]}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="comments">
            <Card>
              <CardHeader>
                <CardTitle>Recent Comments</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable 
                  data={recentComments}
                  columns={[
                    { key: 'id', header: 'ID' },
                    { key: 'name', header: 'Name' },
                    { key: 'page', header: 'Page' },
                    { 
                      key: 'comment', 
                      header: 'Comment',
                      cell: (row) => (
                        <div className="max-w-[400px] truncate">{row.comment}</div>
                      )
                    },
                    { key: 'date', header: 'Date' },
                    { 
                      key: 'actions', 
                      header: 'Actions',
                      cell: () => (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="destructive" size="sm">Delete</Button>
                        </div>
                      )
                    }
                  ]}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="content">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full justify-start">
                    Update Game Results
                  </Button>
                  <Button className="w-full justify-start">
                    Manage Chart Data
                  </Button>
                  <Button className="w-full justify-start">
                    Update Predictions
                  </Button>
                  <Button className="w-full justify-start">
                    Edit About Page
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Database:</span>
                    <span className="text-green-500">Connected</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Data Update:</span>
                    <span>May 16, 2025 - 08:53 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Storage Used:</span>
                    <span>1.2 GB / 5.0 GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Server Load:</span>
                    <span>23%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
