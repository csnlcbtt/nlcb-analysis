
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { PlayWheChart } from '@/components/charts/PlayWheChart';
import { ChartControls } from './ChartControls';
import { toast } from "sonner";

export function ChartsTabContent() {
  const [chartWidth, setChartWidth] = useState<number[]>([60]);
  const [activeChartId, setActiveChartId] = useState("001");
  const [loadingError, setLoadingError] = useState(false);
  
  // Creating an array of charts from 1 to 11
  const charts = Array.from({ length: 11 }, (_, i) => ({ 
    id: `00${i + 1}`.slice(-3), 
    name: `Chart ${i + 1}`
  }));
  // Attempt to detect if images are available
  useEffect(() => {
    // Check if the first chart is available as a simple test
    const testImg = new Image();
    testImg.src = '/img/PW01.png';
    testImg.onload = () => {
      setLoadingError(false);
    };
    testImg.onerror = () => {
      setLoadingError(true);
      toast.error("Could not load chart images. Please check file paths and server configuration.", {
        description: "Make sure image files exist in the public/img directory with correct filenames."
      });
    };
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4">
      <Card className="p-4">
        <ChartControls 
          charts={charts}
          activeChartId={activeChartId}
          chartWidth={chartWidth}
          setActiveChartId={setActiveChartId}
          setChartWidth={setChartWidth}
        />        {loadingError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Image loading error!</strong>
            <span className="block sm:inline"> Chart images could not be loaded. Please verify that the images exist in the public/img folder with the correct names (PW01.png through PW11.png).</span>
          </div>
        )}

        <div className="flex justify-center">
          {charts.map((chart) => (
            <PlayWheChart
              key={chart.id}
              chartNumber={parseInt(chart.id)}
              width={chartWidth[0]}
              active={chart.id === activeChartId}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
