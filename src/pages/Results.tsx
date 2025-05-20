import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Home } from 'lucide-react';

const Results = () => {
  const [chartWidth, setChartWidth] = useState<number[]>([60]);

  return (
    <Layout>
      <div className="container py-6">
        {/* Top controls */}
        <div className="flex justify-between items-center mb-6">
          <Link to="/">
            <Button variant="default" size="sm" className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Home size={16} />
              <span>Home</span>
            </Button>
          </Link>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              Chart Width: {chartWidth}%
            </span>
            <div className="w-48">
              <Slider
                defaultValue={[60]}
                max={100}
                min={50}
                step={5}
                value={chartWidth}
                onValueChange={setChartWidth}
              />
            </div>
          </div>
        </div>
        
        {/* LandPage Image */}
        <div className="flex justify-center" style={{ width: `${chartWidth}%`, margin: '0 auto' }}>
          <img 
            src="/img/LandPage.png" 
            alt="Latest Results Chart" 
            className="w-full h-auto rounded-md border border-border shadow-md"
          />
        </div>

        {/* Optional Legend or Description */}
        <div className="mt-8 p-4 bg-card rounded-md text-center">
          <h2 className="text-lg font-medium mb-2">Latest NLCB Game Results</h2>
          <p className="text-sm text-muted-foreground">
            This chart displays the most recent Trinidad & Tobago lottery results. 
            Use the slider above to adjust the chart width for better viewing.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Results;
