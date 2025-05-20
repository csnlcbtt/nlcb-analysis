import React from 'react';
import { CsvData } from '@/lib/csvUtils';
import { PlayWheData } from './SearchTabContent';
import { Badge } from '@/components/ui/badge';
import { BarChart3, PieChart } from 'lucide-react';

interface SearchResultsStatsProps {
  searchType: 'weekday' | 'dayOfMonth' | 'holiday';
  searchResults: PlayWheData[];
  selectedValue: string;
  statsData: CsvData[] | null;
}

export function SearchResultsStats({ 
  searchType, 
  searchResults, 
  selectedValue, 
  statsData 
}: SearchResultsStatsProps) {
  // Configure title and field mappings based on search type
  let title = '';
  let topNumbersTitle = '';
  let statsFieldName = '';
  let statsNumberField = '';
  let statsPlayedField = '';
  
  // Configure display parameters based on search type
  switch (searchType) {
    case 'weekday':
      title = `Showing statistics for ${selectedValue} draws`;
      topNumbersTitle = `Top Numbers for ${selectedValue}`;
      statsFieldName = 'Day';
      statsNumberField = 'No';
      statsPlayedField = 'Played';
      break;
    case 'dayOfMonth':
      title = `Showing statistics for day ${parseInt(selectedValue)} of the month`;
      topNumbersTitle = `Top Numbers for Day ${parseInt(selectedValue)}`;
      statsFieldName = 'Day';
      statsNumberField = 'No';
      statsPlayedField = 'Played';
      break;
    case 'holiday':
      title = `Showing statistics for ${selectedValue}`;
      topNumbersTitle = `Top Numbers for ${selectedValue}`;
      statsFieldName = 'Holiday';
      statsNumberField = 'Number';
      statsPlayedField = 'Counter';
      break;
    default:
      title = `Showing statistics for ${selectedValue}`;
      topNumbersTitle = `Top Numbers for ${selectedValue}`;
      statsFieldName = 'Day';
      statsNumberField = 'No';
      statsPlayedField = 'Played';
  }

  return (
    <div className="mb-6">
      <div className="p-4 border border-blue-500 bg-blue-500/10 rounded-md text-blue-300 mb-3 flex items-center">
        <BarChart3 className="h-4 w-4 mr-2" />
        <span>{title}</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Numbers Panel */}
        <div className="p-4 bg-muted/10 rounded-md border border-border h-full">
          <h4 className="text-lg font-medium mb-3 flex items-center">
            <PieChart className="h-4 w-4 mr-2" /> {topNumbersTitle}
          </h4>          <div className="flex flex-wrap gap-2 mt-3">
            {statsData && statsData
              .filter(item => item[statsFieldName] === selectedValue)
              .sort((a, b) => parseInt(String(b[statsPlayedField] || '0')) - parseInt(String(a[statsPlayedField] || '0')))
              .slice(0, 10)
              .map((item, idx) => (
                <Badge 
                  key={idx} 
                  className="px-3 py-1 text-sm"
                  variant={parseInt(String(item[statsPlayedField] || '0')) > 2 ? "default" : "outline"}
                >
                  #{String(item[statsNumberField]).padStart(2, '0')} - {item[statsPlayedField]} {searchType === 'holiday' ? 'times' : 'draws'}
                </Badge>
              ))
            }
            {(!statsData || statsData.filter(item => item[statsFieldName] === selectedValue).length === 0) && (
              <div className="text-sm text-muted-foreground py-2">
                No statistics available for this selection.
              </div>
            )}
          </div>
        </div>
          {/* Line Distribution Panel */}
        <div className="p-4 bg-muted/10 rounded-md border border-border h-full">
          <h4 className="text-lg font-medium mb-3 flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" /> Line Distribution
          </h4>
          <div className="grid grid-cols-3 gap-3 mt-3">
            {[...Array(9)].map((_, idx) => {
              const lineNumber = idx + 1;
              const count = searchResults.filter(r => r.Line === lineNumber).length;
              const percentage = searchResults.length > 0 
                ? Math.round((count / searchResults.length) * 100) 
                : 0;
              
              // Apply stronger highlighting for more significant percentages
              const bgClass = percentage > 20 ? 'bg-primary/40' : 
                             percentage > 10 ? 'bg-primary/20' : 
                             count > 0 ? 'bg-primary/10' : 'bg-muted/30';
              
              return (
                <div key={lineNumber} 
                    className={`p-2 rounded text-center ${bgClass}`}>
                  <div className="text-sm font-medium">Line {lineNumber}</div>
                  <div className="text-xs text-muted-foreground">{count} ({percentage}%)</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
