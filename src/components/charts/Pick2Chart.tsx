import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useCsvData } from '@/lib/csvUtils';
import { cn } from "@/lib/utils";

interface Pick2ChartProps {
  chartNumber: number;
  width: number; // Width as percentage
  active: boolean;
}

export function Pick2Chart({ chartNumber, width, active }: Pick2ChartProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const chartId = chartNumber.toString().padStart(2, '0');
  const imgPath = `/img/P2${chartId}.png`;
  
  const chartData = useCsvData('/csv/p2wkass.csv');
  
  // Check if the chart has any played status data
  const hasPlayed = !chartData.loading && chartData.data.length > 0 && 
    chartData.data.some(row => Number(row.No) === chartNumber && row.Played !== undefined);
    
  // Load the chart image
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    const img = new Image();
    img.src = imgPath;
    
    img.onload = () => {
      console.log(`Successfully loaded image: ${imgPath}`);
      setLoading(false);
    };
    
    img.onerror = () => {
      console.error(`Failed to load image during preload: ${imgPath}`);
      setLoading(false);
    };
    
    return () => {
      // Clean up
      img.onload = null;
      img.onerror = null;
    };
  }, [imgPath, chartNumber]);

  if (error) {
    return (
      <div className={cn("relative border border-border rounded-md overflow-hidden w-full", `max-w-[${width}%]`)}>
        <div className="aspect-video bg-card flex items-center justify-center">
          <div className="text-center p-6 text-red-500">
            <h3 className="text-xl font-bold mb-2">Error</h3>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "relative border border-border rounded-md overflow-hidden w-full",
      `max-w-[${width}%]`,
      !active && "hidden"
    )}>
      {loading ? (
        <div className="aspect-video bg-card">
          <Skeleton className="h-full w-full" />
        </div>
      ) : (
        <div className="aspect-video bg-card flex items-center justify-center">
          <img 
            src={imgPath}
            alt={`PICK2 Chart #${chartNumber}`} 
            className="max-h-full max-w-full object-contain"
            onError={(e) => {
              console.error(`Error displaying image: ${imgPath}`);
              setError(`Failed to display chart image: ${imgPath}`);
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}
      <div className="absolute bottom-2 right-2 bg-card/80 px-2 py-1 rounded text-xs">
        Updated: {new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: '2-digit' })}
        {hasPlayed && <span className="ml-2 text-green-500">• Active</span>}
      </div>
    </div>
  );
}
