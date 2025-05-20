
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

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
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-11 gap-2 mb-6">
        {charts.map((chart) => (
          <Button
            key={chart.id}
            variant={chart.id === activeChartId ? "default" : "outline"}
            className="w-full flex items-center justify-center py-2 text-sm"
            onClick={() => setActiveChartId(chart.id)}
          >
            {chart.name}
          </Button>
        ))}
      </div>      <div className="mb-6">
        <label id="chart-width-slider-label" className="text-sm mb-2 block">Adjust Chart Width (%)</label>
        <div className="flex items-center gap-4">
          <span className="text-xs">20</span>
          <Slider
            value={chartWidth}
            onValueChange={setChartWidth}
            min={20}
            max={100}
            step={1}
            className="flex-1"
            aria-labelledby="chart-width-slider-label"
            aria-valuetext={`${chartWidth[0]}%`}
          />
          <span className="text-xs">100</span>
        </div>
      </div>
    </>
  );
}
