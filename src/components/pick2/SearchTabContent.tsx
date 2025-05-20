import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CommentSection from '@/components/ui/CommentSection';
import { useCsvData, CsvData } from '@/lib/csvUtils';
import { GameSearchResultsStats, GameData } from '@/components/ui/GameSearchResultsStats';
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

// interface for processed Pick2 data
export interface Pick2Data extends GameData {
  FirstDigit?: string;
  SecondDigit?: string;
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
  const [drawDate, setDrawDate] = useState<Date | undefined>(undefined);
  const [selectedWeekday, setSelectedWeekday] = useState<string>('');
  const [selectedHoliday, setSelectedHoliday] = useState<string>('');
  const [selectedDayOfMonth, setSelectedDayOfMonth] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Pick2Data[]>([]);
  
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
  
  // Game prefix for Pick2
  const gamePrefix = "p2";
  
  // Load CSV data using the custom hook with standardized paths
  const { data: masterData, loading: masterLoading, error: masterError } = useCsvData(`/csv/${gamePrefix}master.csv`);
  const { data: holidaysData, error: holidaysError } = useCsvData(`/csv/${gamePrefix}holidays.csv`);
  const { data: dowData } = useCsvData(`/csv/${gamePrefix}nctrdow.csv`);
  const { data: domData } = useCsvData(`/csv/${gamePrefix}nctrdom.csv`);
  
  // Extract unique holidays for filters
  const [holidays, setHolidays] = useState<string[]>([]);
  
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
    }

    // Debug CSV data
    console.log("Pick2 Master data sample:", masterData?.slice(0, 5));
    console.log("Pick2 DOW data sample:", dowData?.slice(0, 5));
    console.log("Pick2 DOM data sample:", domData?.slice(0, 5));
    console.log("Pick2 Holidays data sample:", holidaysData?.slice(0, 5));
  }, [holidaysData, masterData, dowData, domData]);
  
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Create array of days 1-31 for day of month picker
  const daysOfMonth = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
  
  // Process and format the data for display
  function processData(data: CsvData[]): Pick2Data[] {
    return data.map((item) => {
      const drawData = item as unknown as Pick2Data;
      
      // Ensure Nums is padded to 2 digits
      if (drawData.Nums && typeof drawData.Nums === 'string') {
        drawData.Nums = drawData.Nums.padStart(2, '0');
        
        // Split the number into digits for Pick2
        if (drawData.Nums.length === 2) {
          drawData.FirstDigit = drawData.Nums[0];
          drawData.SecondDigit = drawData.Nums[1];
        }
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
  const applyDateRangeFilter = (data: Pick2Data[]): Pick2Data[] => {
    if (dateRange === 'ALL') return data;
    
    const cutoffDate = subMonths(new Date(), DATE_RANGES[dateRange]);
    return data.filter(item => 
      item.formattedDate && item.formattedDate >= cutoffDate
    );
  };
  
  // Handle search logic for all search types
  const handleSearch = () => {
    setIsSearching(true);
    setError(null);
    setSearchResults([]);
    
    try {
      if (!processedMasterData || processedMasterData.length === 0) {
        throw new Error("No data available");
      }
      
      let results: Pick2Data[] = [];
      
      // Search based on the selected search type
      switch (searchType) {
        case 'drawNumber':
          if (drawNumber) {
            const drawNumberInt = parseInt(drawNumber, 10);
            results = processedMasterData.filter(item =>
              Number(item.DrawNo) === drawNumberInt
            );
          }
          break;
          
        case 'drawDate':
          if (!drawDate) {
            throw new Error("Please select a date");
          }
          
          // Format drawDate to compare with formattedDate
          const searchDate = format(drawDate, 'yyyy-MM-dd');
          
          results = processedMasterData.filter(item => 
            item.formattedDate && format(item.formattedDate, 'yyyy-MM-dd') === searchDate
          );
          break;
          
        case 'weekday':
          if (!selectedWeekday) {
            throw new Error("Please select a weekday");
          }
          
          results = processedMasterData.filter(item => 
            item.day === selectedWeekday
          );
          break;
          
        case 'holiday':
          if (!selectedHoliday || !holidaysData) {
            throw new Error("Please select a holiday");
          }
          
          // Find all draws that fell on the selected holiday
          const holidayDraws = holidaysData
            .filter(item => item.Holiday === selectedHoliday)
            .map(item => String(item.DrawNumber));
          
          results = processedMasterData.filter(item => 
            holidayDraws.includes(String(item.DrawNo))
          );
          break;
          
        case 'dayOfMonth':
          if (!selectedDayOfMonth) {
            throw new Error("Please select a day of month");
          }
          
          results = processedMasterData.filter(item => {
            if (!item.formattedDate) return false;
            const dayNum = item.formattedDate.getDate();
            return String(dayNum).padStart(2, '0') === selectedDayOfMonth;
          });
          break;
          
        default:
          throw new Error("Invalid search type");
      }
      
      // Apply filters
      results = applyDateRangeFilter(results);
      
      // Sort results
      results = sortResults(results, sortBy, sortDirection);
      
      setSearchResults(results);
    } catch (err: any) {
      console.error("Search error:", err);
      setError(err.message || "An error occurred during search");
    } finally {
      setIsSearching(false);
      setSearchPerformed(true);
    }
  };
  
  // Sort results based on specified field and direction
  const sortResults = (
    data: Pick2Data[], 
    sortField: 'date' | 'number', 
    direction: 'asc' | 'desc'
  ): Pick2Data[] => {
    return [...data].sort((a, b) => {
      if (sortField === 'date') {
        const dateA = a.formattedDate ? a.formattedDate.getTime() : 0;
        const dateB = b.formattedDate ? b.formattedDate.getTime() : 0;
        return direction === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        const numA = parseInt(String(a.Nums) || '0');
        const numB = parseInt(String(b.Nums) || '0');
        return direction === 'asc' ? numA - numB : numB - numA;
      }
    });
  };
  
  // Compute displayed results with pagination
  const displayedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    return {
      data: searchResults.slice(startIndex, endIndex),
      totalCount: searchResults.length
    };
  }, [searchResults, currentPage, pageSize]);
  
  // Calculate total pages based on results and page size
  const totalPages = Math.max(1, Math.ceil(searchResults.length / pageSize));
  
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Search Pick 2 Numbers</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Search for Pick 2 numbers by draw number, date, weekday, holiday, or day of the month.
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
        
        {/* Error display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded mb-4 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            {error}
          </div>
        )}
        
        {/* Additional filters */}
        {searchResults.length > 0 && showFilters && (
          <div className="mb-6 p-4 border border-border/50 rounded-md bg-background/30">
            <h4 className="font-medium mb-3">Filter Results</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {/* Date range filter */}
              <div>
                <Label className="text-xs mb-1 block">Date Range</Label>
                <div className="flex flex-wrap gap-1">
                  {Object.keys(DATE_RANGES).map((range) => (
                    <Button
                      key={range}
                      size="sm"
                      variant={dateRange === range ? "secondary" : "outline"}
                      onClick={() => setDateRange(range as keyof typeof DATE_RANGES)}
                      className="flex-1 min-w-[4rem] text-xs"
                    >
                      {range}
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Sort options */}
              <div>
                <Label className="text-xs mb-1 block">Sort By</Label>
                <div className="flex gap-2">
                  <select
                    id="sortBy"
                    aria-label="Sort by field"
                    className="flex-1 p-2 rounded bg-background border border-border text-sm"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'date' | 'number')}
                  >
                    <option value="date">Draw Date</option>
                    <option value="number">Number</option>
                  </select>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                    className="min-w-[3rem]"
                  >
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </Button>
                </div>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setDateRange('ALL');
                setSortBy('date');
                setSortDirection('desc');
              }}
              className="text-xs"
            >
              Reset Filters
            </Button>
          </div>
        )}
        
        {/* Search Results */}
        {masterLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span>Loading data...</span>
          </div>
        ) : searchPerformed ? (
          searchResults.length > 0 ? (
            <>
              {/* Statistics component for weekday and day of month searches */}
              {searchType === 'weekday' && selectedWeekday && (
                <GameSearchResultsStats
                  searchType="weekday"
                  searchResults={searchResults}
                  selectedValue={selectedWeekday}
                  statsData={dowData}
                  gameType="pick2"
                  hasLineData={false}
                />
              )}
              
              {searchType === 'dayOfMonth' && selectedDayOfMonth && (
                <GameSearchResultsStats
                  searchType="dayOfMonth"
                  searchResults={searchResults}
                  selectedValue={selectedDayOfMonth}
                  statsData={domData}
                  gameType="pick2"
                  hasLineData={false}
                />
              )}
              
              {searchType === 'holiday' && selectedHoliday && holidaysData && (
                <GameSearchResultsStats
                  searchType="holiday"
                  searchResults={searchResults}
                  selectedValue={selectedHoliday}
                  statsData={holidaysData}
                  gameType="pick2"
                  hasLineData={false}
                />
              )}
              
              {/* Pagination info */}
              <div className="mb-4 flex items-center justify-between text-sm">
                <span>
                  Showing {Math.min((currentPage - 1) * pageSize + 1, displayedResults.totalCount)} - {Math.min(currentPage * pageSize, displayedResults.totalCount)} of {displayedResults.totalCount} results
                </span>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="pageSize" className="text-xs whitespace-nowrap">Page Size</Label>
                  <select
                    id="pageSize"
                    aria-label="Select page size"
                    className="p-1 rounded bg-background border border-border text-xs"
                    value={pageSize}
                    onChange={(e) => setPageSize(parseInt(e.target.value))}
                  >
                    {PAGE_SIZE_OPTIONS.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
                
              {/* Results table - for all search types */}
              <div className="mb-6 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Draw #</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Day</TableHead>
                      <TableHead className="w-[80px]">Number</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayedResults.data.length > 0 ? (
                      displayedResults.data.map((result, idx) => (
                        <TableRow key={idx} className="hover:bg-muted/50">
                          <TableCell>{result.DrawNo}</TableCell>
                          <TableCell>
                            {result.DrawDates.split(' ')[1]}
                          </TableCell>
                          <TableCell>{result.day}</TableCell>
                          <TableCell>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge className="w-[40px] flex justify-center">
                                    {result.Nums}
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Pick2 Number: {result.Nums}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                          No matches with current filters
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
                
              {/* Pagination controls */}
              {displayedResults.totalCount > pageSize && (
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  >
                    First
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    Last
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="border border-border/50 bg-amber-950/20 text-amber-200 rounded-md p-4 mb-6">
              <div className="flex items-center">
                <Info className="h-4 w-4 mr-2" />
                <span>
                  No records found for {searchType === 'drawNumber' ? `Draw Number: ${drawNumber}` :
                    searchType === 'drawDate' ? `Date: ${drawDate ? format(drawDate, 'PPP') : ''}` :
                    searchType === 'weekday' ? `Weekday: ${selectedWeekday}` :
                    searchType === 'dayOfMonth' ? `Day of Month: ${selectedDayOfMonth}` :
                    `Holiday: ${selectedHoliday}`}
                </span>
              </div>
            </div>
          )
        ) : null}
        
        {/* Filter toggle button */}
        {searchResults.length > 0 && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="mb-6"
          >
            {showFilters ? (
              <>
                <X className="h-4 w-4 mr-2" />
                Hide Filters
              </>
            ) : (
              <>
                <Filter className="h-4 w-4 mr-2" />
                Show Filters
              </>
            )}
          </Button>
        )}
        
        {/* Download results button */}
        {searchResults.length > 0 && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              // Create CSV content
              const headers = ["Draw Number", "Date", "Day", "Number"];
              const rows = searchResults.map(item => [
                String(item.DrawNo),
                item.DrawDates.split(' ')[1],
                item.day || '',
                String(item.Nums)
              ]);
              
              const csvContent = [
                headers.join(','),
                ...rows.map(row => row.join(','))
              ].join('\n');
              
              // Create download link
              const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.setAttribute('href', url);
              link.setAttribute('download', `pick2-search-results-${new Date().toISOString().split('T')[0]}.csv`);
              link.click();
            }}
            className="ml-2"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Results
          </Button>
        )}
      </div>
    </Card>
  );
}
