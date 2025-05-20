import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCsvData } from '@/lib/csvUtils';

interface PlayWheChartProps {
  chartNumber: number;
  width: number; // Width as percentage
  active: boolean;
}

export function PlayWheChart({ chartNumber, width, active }: PlayWheChartProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const chartId = chartNumber.toString().padStart(2, '0');
  const imgPath = `/img/PW${chartId}.png`;
  
  const chartData = useCsvData('/csv/pwhzprprgrp.csv');
  
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
      console.error(`Failed to load image during preload: ${imgPath}`); // Clarified console message
      setLoading(false);
      // setError(`Image loading error! Chart images could not be loaded. Please verify that the images exist in the public/img folder with the correct names (PW01.png through PW11.png).`); // Removed to prevent premature error display
    };
    
    return () => {
      // Clean up
      img.onload = null;
      img.onerror = null;
    };
  }, [imgPath, chartNumber]);

  if (error) {
    return (
      <div className="relative border border-border rounded-md overflow-hidden w-full" style={{ maxWidth: `${width}%` }}>
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
    <div className={`relative border border-border rounded-md overflow-hidden w-full ${!active ? 'hidden' : ''}`} style={{ maxWidth: `${width}%` }}>
      {loading ? (
        <div className="aspect-video bg-card">
          <Skeleton className="h-full w-full" />
        </div>
      ) : (
        <div className="aspect-video bg-card flex items-center justify-center">
          <img 
            src={imgPath}
            alt={`PlayWhe Chart #${chartNumber}`} 
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
