import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart3, PieChart } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { CsvData } from '@/lib/csvUtils';

// Interface for statistics data
export interface StatisticsData {
  day: string;
  number: string;
  count: number;
  percentage: number;
}

interface PlayWheStatisticsProps {
  title: string;
  data: CsvData[] | null;
  type: 'dow' | 'dom' | 'holiday';
  selected: string;
}

export function PlayWheStatistics({ title, data, type, selected }: PlayWheStatisticsProps) {
  if (!data || data.length === 0) {
    return null;
  }

  // Process the data based on the type
  const processedData = React.useMemo(() => {
    try {
      const filteredData = data.filter(item => {
        const dayOrHoliday = type === 'holiday' ? item.Holiday : item.Day;
        return dayOrHoliday && String(dayOrHoliday) === selected;
      });

      if (filteredData.length === 0) return [];

      // Extract the top 10 numbers
      const numberCounts: Record<string, number> = {};
      
      filteredData.forEach(item => {
        const num = item.No || item.Num; // Use appropriate field name based on data structure
        if (num !== undefined) {
          const numStr = String(num).padStart(2, '0');
          numberCounts[numStr] = (numberCounts[numStr] || 0) + parseInt(String(item.Played || item.Counter || 0));
        }
      });

      // Sort by count and take top 10
      const topNumbers = Object.entries(numberCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([number, count]) => {
          const total = Object.values(numberCounts).reduce((sum, c) => sum + c, 0);
          return {
            day: selected,
            number,
            count,
            percentage: parseFloat(((count / total) * 100).toFixed(2)),
          };
        });

      return topNumbers;
    } catch (error) {
      console.error(`Error processing ${type} statistics:`, error);
      return [];
    }
  }, [data, type, selected]);

  if (processedData.length === 0) {
    return null;
  }

  return (
    <Card className="p-4 mb-6 mt-4 border-t-4 border-t-primary bg-muted/20">
      <div className="flex items-center mb-4">
        {type === 'dow' || type === 'dom' ? (
          <BarChart3 className="h-5 w-5 mr-2 text-primary" />
        ) : (
          <PieChart className="h-5 w-5 mr-2 text-primary" />
        )}
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Number</TableHead>
              <TableHead>Count</TableHead>
              <TableHead>Percentage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processedData.map((item, idx) => (
              <TableRow key={idx} className="hover:bg-muted/50">
                <TableCell>
                  <Badge className="w-[40px] flex justify-center">
                    {item.number}
                  </Badge>
                </TableCell>
                <TableCell>{item.count}</TableCell>
                <TableCell>{item.percentage}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="mt-4 text-sm text-muted-foreground">
        <p>
          {type === 'dow' && `Most common numbers drawn on ${selected}days`}
          {type === 'dom' && `Most common numbers drawn on day ${parseInt(selected)} of the month`}
          {type === 'holiday' && `Most common numbers drawn on ${selected}`}
        </p>
      </div>
    </Card>
  );
}
