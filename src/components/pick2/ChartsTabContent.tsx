import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Pick2Chart } from '@/components/charts/Pick2Chart';
import { toast } from "sonner";

interface ChartControlsProps {
  charts: { id: string; name: string }[];
  activeChartId: string;
  chartWidth: number[];
  setActiveChartId: (id: string) => void;
  setChartWidth: (width: number[]) => void;
}

export function ChartControls({ 
  charts, 
  activeChartId, 
  chartWidth, 
  setActiveChartId, 
  setChartWidth 
}: ChartControlsProps) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6">
        {charts.map((chart) => (
          <button
            key={chart.id}
            className={`w-full flex items-center justify-center py-2 text-sm rounded-md ${chart.id === activeChartId 
              ? "bg-primary text-primary-foreground" 
              : "bg-card hover:bg-muted border border-border"}`}
            onClick={() => setActiveChartId(chart.id)}
          >
            {chart.name}
          </button>
        ))}
      </div>      <div className="mb-6">
        <label htmlFor="chart-width-slider" className="text-sm mb-2 block">Adjust Chart Width (%)</label>
        <div className="flex items-center gap-4">
          <span className="text-xs">20</span>
          <input
            id="chart-width-slider"
            type="range"
            value={chartWidth[0]}
            onChange={(e) => setChartWidth([parseInt(e.target.value)])}
            min={20}
            max={100}
            step={1}
            className="flex-1"
            title={`Chart width: ${chartWidth[0]}%`}
          />
          <span className="text-xs">100</span>
        </div>
      </div>
    </>
  );
}

export function Pick2ChartsTabContent() {
  const [chartWidth, setChartWidth] = useState<number[]>([60]);
  const [activeChartId, setActiveChartId] = useState("001");
  const [loadingError, setLoadingError] = useState(false);
  
  // Creating an array of charts from 1 to 3
  const charts = Array.from({ length: 3 }, (_, i) => ({ 
    id: `00${i + 1}`.slice(-3), 
    name: `Chart ${i + 1}`
  }));

  // Attempt to detect if images are available
  useEffect(() => {
    // Check if the first chart is available as a simple test
    const testImg = new Image();
    testImg.src = '/img/P201.png';
    testImg.onload = () => {
      setLoadingError(false);
    };
    testImg.onerror = () => {
      setLoadingError(true);
      toast.error("Could not load PICK2 chart images. Please check file paths and server configuration.", {
        description: "Make sure image files exist in the public/img directory with correct filenames (P201.png, P202.png, P203.png)."
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
        />

        {loadingError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Image loading error!</strong>
            <span className="block sm:inline"> Chart images could not be loaded. Please verify that the images exist in the public/img folder with the correct names (P201.png, P202.png, P203.png).</span>
          </div>
        )}

        <div className="flex justify-center">
          {charts.map((chart) => (
            <Pick2Chart
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
