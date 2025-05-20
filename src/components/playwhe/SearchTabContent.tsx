import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CommentSection from '@/components/ui/CommentSection';
import { useCsvData, CsvData } from '@/lib/csvUtils';
import { PlayWheStatistics } from './PlayWheStatistics';
import { SearchResultsStats } from './SearchResultsStats';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  CalendarIcon, 
  Info, 
  Loader2, 
  ChevronLeft, 
  ChevronRight,
  Download,
  Filter,
  X,
  AlertTriangle,
  BarChart3,
  PieChart
} from 'lucide-react';
import { format, subMonths, isValid } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

// Search type enum
type SearchType = 'drawNumber' | 'drawDate' | 'weekday' | 'holiday' | 'dayOfMonth';

// interface for processed Play Whe data
export interface PlayWheData {
  DrawNo: number;
  DrawDates: string;
  Nums: string;
  Line: number;
  formattedDate?: Date;
  day?: string;
}

// Interface for statistics data
interface StatisticsData {
  day: string;
  number: string;
  count: number;
  percentage?: string;
}

// Define the date ranges for filter
const DATE_RANGES = {
  '1M': 1,
  '3M': 3,
  '6M': 6,
  '1Y': 12,
  'ALL': 0
};

// Define pagination size options
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export function SearchTabContent() {
  // State for search type and values
  const [searchType, setSearchType] = useState<SearchType>('drawNumber');
  const [drawNumber, setDrawNumber] = useState<string>('');
  const [drawDate, setDrawDate] = useState<Date | undefined>(undefined);  const [selectedWeekday, setSelectedWeekday] = useState<string>('');
  const [selectedHoliday, setSelectedHoliday] = useState<string>('');
  const [selectedDayOfMonth, setSelectedDayOfMonth] = useState<string>('');
  const [searchResults, setSearchResults] = useState<PlayWheData[]>([]);
  
  // UI state
  const [isSearching, setIsSearching] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filtering and pagination state
  const [dateRange, setDateRange] = useState<keyof typeof DATE_RANGES>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<'date' | 'number'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [filterMark, setFilterMark] = useState<number | null>(null); // Now used for Line filtering
  // Game prefix for PlayWhe
  const gamePrefix = "pw";
  
  // Load CSV data using the custom hook with standardized paths
  const { data: masterData, loading: masterLoading, error: masterError } = useCsvData(`/csv/${gamePrefix}master.csv`);
  const { data: holidaysData, error: holidaysError } = useCsvData(`/csv/${gamePrefix}holidays.csv`);
  const { data: dowData } = useCsvData(`/csv/${gamePrefix}nctrdow.csv`);
  const { data: domData } = useCsvData(`/csv/${gamePrefix}nctrdom.csv`);
  
  // Extract unique holidays and marks for filters
  const [holidays, setHolidays] = useState<string[]>([]);
  const [marks, setMarks] = useState<number[]>([]);
  
  // Memoize processed data to improve performance
  const processedMasterData = useMemo(() => {
    if (!masterData || masterData.length === 0) return [];
    return processData(masterData);
  }, [masterData]);
  
  // Extract metadata from CSV files
  useEffect(() => {
    // Extract unique holidays
    if (holidaysData && holidaysData.length > 0) {
      const uniqueHolidays = [...new Set(holidaysData.map(item => item.Holiday as string))];
      setHolidays(uniqueHolidays.sort());
      console.log("Holidays data:", holidaysData);
    }
    
    // Extract unique marks
    if (processedMasterData && processedMasterData.length > 0) {
      const uniqueMarks = [...new Set(processedMasterData.map(item => item.Line))];
      setMarks(uniqueMarks.sort((a, b) => a - b));
    }

    // Debug CSV data
    console.log("Master data sample:", masterData?.slice(0, 5));
    console.log("DOW data sample:", dowData?.slice(0, 5));
    console.log("DOM data sample:", domData?.slice(0, 5));
    console.log("Holidays data sample:", holidaysData?.slice(0, 5));
  }, [holidaysData, processedMasterData, masterData, dowData, domData]);
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Create array of days 1-31 for day of month picker
  const daysOfMonth = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
  
  // Process and format the data for display
  function processData(data: CsvData[]): PlayWheData[] {
    return data.map((item) => {
      const drawData = item as unknown as PlayWheData;
      
      // Ensure Nums is padded to 2 digits
      if (drawData.Nums && typeof drawData.Nums === 'string') {
        drawData.Nums = drawData.Nums.padStart(2, '0');
      }
      
      // Extract day from DrawDates (e.g., "Mon 04-Jul-1994" -> "Mon")
      if (typeof drawData.DrawDates === 'string') {
        drawData.day = drawData.DrawDates.substring(0, 3);
        
        try {
          // Parse date from format like "Mon 04-Jul-1994"
          const dateParts = drawData.DrawDates.split(' ')[1].split('-');
          const day = parseInt(dateParts[0]);
          const month = {
            'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
            'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
          }[dateParts[1]] || 0;
          const year = parseInt(dateParts[2]);
          
          const date = new Date(year, month, day);
          if (isValid(date)) {
            drawData.formattedDate = date;
          }
        } catch (error) {
          console.error('Error parsing date:', drawData.DrawDates);
        }
      }
      
      return drawData;
    });
  };
  
  // Helper function to safely extract values from CSV data with different possible field names
  const getValueFromCsvRow = (row: CsvData | undefined, fields: string[]): string | null => {
    if (!row) return null;
    
    for (const field of fields) {
      if (row[field] !== undefined && row[field] !== null) {
        return String(row[field]);
      }
    }
    
    return null;
  };
  
  // Apply date range filter
  const applyDateRangeFilter = (data: PlayWheData[]): PlayWheData[] => {
    if (dateRange === 'ALL') return data;
    
    const cutoffDate = subMonths(new Date(), DATE_RANGES[dateRange]);
    return data.filter(item => 
      item.formattedDate && item.formattedDate >= cutoffDate
    );
  };
  
  // Apply mark filter
  const applyMarkFilter = (data: PlayWheData[]): PlayWheData[] => {
    if (filterMark === null) return data;
    return data.filter(item => item.Line === filterMark);
  };
  
  // Sort the results
  const sortResults = (data: PlayWheData[]): PlayWheData[] => {
    return [...data].sort((a, b) => {
      if (sortBy === 'date') {
        // Sort by draw date
        const dateA = a.formattedDate || new Date(0);
        const dateB = b.formattedDate || new Date(0);
        return sortDirection === 'asc' 
          ? dateA.getTime() - dateB.getTime() 
          : dateB.getTime() - dateA.getTime();
      } else {
        // Sort by number
        const numA = parseInt(a.Nums);
        const numB = parseInt(b.Nums);
        return sortDirection === 'asc' ? numA - numB : numB - numA;
      }
    });
  };
  
  // Paginate the results
  const paginateResults = (data: PlayWheData[]): PlayWheData[] => {
    const startIndex = (currentPage - 1) * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  };
  
  // Apply all filters, sorting, and pagination
  const displayedResults = useMemo(() => {
    let filteredResults = [...searchResults];
    
    // Apply filters
    filteredResults = applyDateRangeFilter(filteredResults);
    filteredResults = applyMarkFilter(filteredResults);
    
    // Sort
    filteredResults = sortResults(filteredResults);
    
    // Get total count before pagination
    const totalCount = filteredResults.length;
    
    // Paginate
    const paginatedResults = paginateResults(filteredResults);
    
    return { data: paginatedResults, totalCount };
  }, [
    searchResults, 
    dateRange, 
    filterMark, 
    sortBy, 
    sortDirection, 
    currentPage, 
    pageSize
  ]);
  
  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [dateRange, filterMark, sortBy, sortDirection, pageSize]);
  
  // Remove any duplicate or misplaced handleSearch and related logic
  // Place this as the only handleSearch inside SearchTabContent
  const handleSearch = () => {
    setIsSearching(true);
    setSearchPerformed(true);
    setError(null);

    try {
      let results: PlayWheData[] = [];
      // Debug: log the first few processed records and search criteria
      console.log('SearchType:', searchType);
      console.log('drawNumber:', drawNumber);
      console.log('drawDate:', drawDate, drawDate && format(drawDate, 'dd-MMM-yyyy'));
      console.log('selectedWeekday:', selectedWeekday);
      console.log('selectedHoliday:', selectedHoliday);
      console.log('selectedDayOfMonth:', selectedDayOfMonth);
      console.log('processedMasterData sample:', processedMasterData.slice(0, 3));
      if (holidaysData) console.log('holidaysData sample:', holidaysData.slice(0, 3));

      switch (searchType) {
        case 'drawNumber':
          if (drawNumber) {
            const drawNumberInt = parseInt(drawNumber);
            results = processedMasterData.filter(item => {
              const match = Number(item.DrawNo) === drawNumberInt;
              if (match) console.log('Matched drawNumber:', item);
              return match;
            });
          }
          break;
        case 'drawDate':
          if (drawDate) {
            const targetDate = format(drawDate, 'dd-MMM-yyyy');
            results = processedMasterData.filter(item => {
              if (!item.DrawDates) return false;
              const itemDate = item.DrawDates.split(' ')[1];
              const match = itemDate === targetDate;
              if (match) console.log('Matched drawDate:', item);
              return match;
            });
          }
          break;
        case 'weekday':
          if (selectedWeekday) {
            results = processedMasterData.filter(item => {
              const match = item.day === selectedWeekday;
              if (match) console.log('Matched weekday:', item);
              return match;
            });
          }
          break;
        case 'dayOfMonth':
          if (selectedDayOfMonth) {
            results = processedMasterData.filter(item => {
              if (!item.DrawDates) return false;
              const dateParts = item.DrawDates.split(' ')[1].split('-');
              const dayOfMonth = dateParts[0];
              const match = dayOfMonth === selectedDayOfMonth;
              if (match) console.log('Matched dayOfMonth:', item);
              return match;
            });
          }
          break;
        case 'holiday':
          if (selectedHoliday && holidaysData && holidaysData.length > 0) {
            const holidayDrawDates = holidaysData
              .filter(item => String(item.Holiday).toLowerCase() === selectedHoliday.toLowerCase())
              .map(item => String(item.Date))
              .filter(Boolean);
            console.log('holidayDrawDates:', holidayDrawDates);
            results = processedMasterData.filter(item => {
              if (!item.DrawDates) return false;
              const itemDate = item.DrawDates.split(' ')[1];
              const match = holidayDrawDates.includes(itemDate);
              if (match) console.log('Matched holiday:', item);
              return match;
            });
          }
          break;
      }

      setSearchResults(results);
      setCurrentPage(1);
    } catch (error) {
      console.error('Search error:', error);
      setError('An error occurred while searching. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };
  
  // Download search results as CSV
  const handleDownloadCSV = () => {
    if (searchResults.length === 0) return;
    
    // Apply same filters as the current view
    let dataToDownload = applyDateRangeFilter(searchResults);
    dataToDownload = applyMarkFilter(dataToDownload);
    dataToDownload = sortResults(dataToDownload);
      // Create CSV content
    const headers = ['DrawNo', 'DrawDates', 'Number', 'Line'];
    const rows = dataToDownload.map(item => [
      item.DrawNo,
      item.DrawDates,
      item.Nums,
      item.Line
    ]);
    
    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `playwhe-search-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(displayedResults.totalCount / pageSize));
  
  // Use only the Lotto/Win for Life search structure for Play Whe
  return (
    <>
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Search Play Whe Numbers</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Search for Play Whe numbers by draw number, date, weekday, holiday, or day of the month.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div>
              <Label htmlFor="searchType" className="block mb-2 text-sm font-medium">
                Search Type
              </Label>
              <select
                id="searchType"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value as SearchType)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-gray-100"
                aria-label="Search Type"
              >
                <option value="drawNumber">Draw Number</option>
                <option value="drawDate">Draw Date</option>
                <option value="weekday">Weekday</option>
                <option value="holiday">Holiday</option>
                <option value="dayOfMonth">Day of Month</option>
              </select>
            </div>
            <div>
              {/* Conditional input based on search type */}
              {searchType === 'drawNumber' && (
                <>
                  <Label htmlFor="drawNumber" className="block mb-2 text-sm font-medium">
                    Draw Number
                  </Label>
                  <Input
                    id="drawNumber"
                    type="number"
                    placeholder="Enter draw number"
                    value={drawNumber}
                    onChange={(e) => setDrawNumber(e.target.value)}
                    className="w-full p-2 bg-gray-800 text-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </>
              )}
              {searchType === 'drawDate' && (
                <>
                  <Label htmlFor="drawDate" className="block mb-2 text-sm font-medium">
                    Draw Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-gray-800 text-gray-100 border-gray-700"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {drawDate ? format(drawDate, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-gray-800 text-gray-100 border-gray-700">
                      <Calendar
                        mode="single"
                        selected={drawDate}
                        onSelect={setDrawDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </>
              )}
              {searchType === 'weekday' && (
                <>
                  <Label htmlFor="weekday" className="block mb-2 text-sm font-medium">
                    Weekday
                  </Label>
                  <select
                    id="weekday"
                    value={selectedWeekday}
                    onChange={(e) => setSelectedWeekday(e.target.value)}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-gray-100"
                    aria-label="Select Weekday"
                  >
                    <option value="">Select Weekday</option>
                    <option value="Mon">Monday</option>
                    <option value="Tue">Tuesday</option>
                    <option value="Wed">Wednesday</option>
                    <option value="Thu">Thursday</option>
                    <option value="Fri">Friday</option>
                    <option value="Sat">Saturday</option>
                  </select>
                </>
              )}
              {searchType === 'holiday' && (
                <>
                  <Label htmlFor="holiday" className="block mb-2 text-sm font-medium">
                    Holiday
                  </Label>
                  <select
                    id="holiday"
                    value={selectedHoliday}
                    onChange={(e) => setSelectedHoliday(e.target.value)}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-gray-100"
                    aria-label="Select Holiday"
                  >
                    <option value="">Select Holiday</option>
                    {holidays.map((holiday) => (
                      <option key={holiday} value={holiday}>
                        {holiday}
                      </option>
                    ))}
                  </select>
                </>
              )}
              {searchType === 'dayOfMonth' && (
                <>
                  <Label htmlFor="dayOfMonth" className="block mb-2 text-sm font-medium">
                    Day of Month
                  </Label>
                  <select
                    id="dayOfMonth"
                    value={selectedDayOfMonth}
                    onChange={(e) => setSelectedDayOfMonth(e.target.value)}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-gray-100"
                    aria-label="Select Day of Month"
                  >
                    <option value="">Select Day</option>
                    {Array.from({ length: 31 }, (_, i) => (
                      <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleSearch} 
                className="w-full" 
                disabled={isSearching || masterLoading}
              >
                {isSearching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  'Search'
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>
      {/* Results Table */}
      <div className="mt-8">
        {searchPerformed && (
          <Card className="p-4">
            {isSearching ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Searching...
              </div>
            ) : displayedResults.totalCount === 0 ? (
              <div className="text-center text-muted-foreground py-8">No results found.</div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm text-muted-foreground">
                    Showing {displayedResults.data.length} of {displayedResults.totalCount} results
                  </div>
                  <Button size="sm" variant="outline" onClick={handleDownloadCSV}>
                    <Download className="mr-2 h-4 w-4" /> Download CSV
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Draw No</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Number</TableHead>
                        <TableHead>Line</TableHead>
                        <TableHead>Day</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedResults.data.map((item, idx) => (
                        <TableRow key={item.DrawNo + '-' + idx}>
                          <TableCell>{item.DrawNo}</TableCell>
                          <TableCell>{item.DrawDates}</TableCell>
                          <TableCell>{item.Nums}</TableCell>
                          <TableCell>{item.Line}</TableCell>
                          <TableCell>{item.day}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {/* Pagination controls */}
                <div className="flex justify-end items-center gap-2 mt-4">
                  <Button size="sm" variant="ghost" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-xs">Page {currentPage} of {totalPages}</span>
                  <Button size="sm" variant="ghost" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </Card>
        )}
        <div className="mt-8">
          <CommentSection />
        </div>
      </div>
    </>
  );
}
