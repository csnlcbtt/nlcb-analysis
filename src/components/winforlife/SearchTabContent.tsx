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

// Interface for processed Win For Life data
export interface WinForLifeData extends GameData {
  DrawNos: number;
  AllNos: string;
  CBall: string;
  Wins: string;
  Draws: string;
  Nfpd: string;
  allNumbers?: string[];
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
  const [searchResults, setSearchResults] = useState<WinForLifeData[]>([]);
  
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
  
  // Game prefix for Win For Life
  const gamePrefix = "wl";
  
  // Load CSV data using the custom hook with standardized paths
  const { data: masterData, loading: masterLoading, error: masterError } = useCsvData(`/csv/${gamePrefix}master.csv`);
  const { data: holidaysData, error: holidaysError } = useCsvData(`/csv/${gamePrefix}holidays.csv`);
  const { data: dowData } = useCsvData(`/csv/${gamePrefix}nctrdow.csv`);
  const { data: domData } = useCsvData(`/csv/${gamePrefix}nctrdom.csv`);
  
  // Extract unique holidays for filters
  const [holidays, setHolidays] = useState<string[]>([]);
  
  // Memoize processed data to improve performance
  const processedData = useMemo(() => {
    if (!masterData) return [];
    
    return masterData.map((item) => {
      const drawData = item as unknown as WinForLifeData;
      
      // Format and parse dates
      if (drawData.DrawDates) {
        // Extract day of the week and format the date
        const dateParts = drawData.DrawDates.split(' ');
        if (dateParts.length >= 2) {
          drawData.day = dateParts[0]; // Store the day (Mon, Tue, etc.)
          
          const dateString = dateParts[1] || '';
          // Parse the date in format DD-MMM-YYYY
          const [day, month, year] = dateString.split('-');
          if (day && month && year) {
            const parsedDate = new Date(`${month}-${day}-${year}`);
            if (isValid(parsedDate)) {
              drawData.formattedDate = parsedDate;
            }
          }
        }
      }
      
      // Process AllNos field
      if (drawData.AllNos) {
        drawData.allNumbers = drawData.AllNos.split(',');
      }
      
      return drawData;
    });
  }, [masterData]);

  // Extract unique holidays
  useEffect(() => {
    if (holidaysData) {
      const uniqueHolidays = [...new Set(holidaysData.map((item: any) => item.Holiday))];
      setHolidays(uniqueHolidays);
    }
  }, [holidaysData]);

  // Handle search function
  const handleSearch = () => {
    setError(null);
    setIsSearching(true);
    setSearchPerformed(true);
    setCurrentPage(1);
    let results: WinForLifeData[] = [];

    try {
      switch (searchType) {
        case 'drawNumber':
          if (!drawNumber) {
            throw new Error('Please enter a draw number');
          }
          results = processedData.filter(item => 
            item.DrawNos.toString() === drawNumber
          );
          break;
        case 'drawDate':
          if (!drawDate) {
            throw new Error('Please select a draw date');
          }
          results = processedData.filter(item => {
            if (!item.formattedDate) return false;
            return format(item.formattedDate, 'dd-MMM-yyyy') === format(drawDate, 'dd-MMM-yyyy');
          });
          break;
        case 'weekday':
          if (!selectedWeekday) {
            throw new Error('Please select a weekday');
          }
          results = processedData.filter(item => 
            item.day === selectedWeekday
          );
          break;
        case 'holiday':
          if (!selectedHoliday) {
            throw new Error('Please select a holiday');
          }
          // For holiday search, we need to match against the holiday data
          if (holidaysData) {
            const holidayDraws = holidaysData
              .filter((h: any) => h.Holiday === selectedHoliday)
              .map((h: any) => h.No);
            
            results = processedData.filter(item => 
              holidayDraws.includes(item.DrawNos.toString())
            );
          }
          break;
        case 'dayOfMonth':
          if (!selectedDayOfMonth) {
            throw new Error('Please select a day of the month');
          }
          
          results = processedData.filter(item => {
            if (!item.formattedDate) return false;
            return item.formattedDate.getDate().toString() === selectedDayOfMonth;
          });
          break;
      }

      // Apply date range filter
      if (dateRange !== 'ALL') {
        const cutoffDate = subMonths(new Date(), DATE_RANGES[dateRange]);
        results = results.filter(item => 
          item.formattedDate ? item.formattedDate > cutoffDate : false
        );
      }

      // Apply sorting
      results.sort((a, b) => {
        if (sortBy === 'date') {
          if (!a.formattedDate || !b.formattedDate) return 0;
          const comparison = a.formattedDate.getTime() - b.formattedDate.getTime();
          return sortDirection === 'asc' ? comparison : -comparison;
        } else {
          // For Win For Life, sorting by number would typically be by DrawNos
          const aNum = a.DrawNos;
          const bNum = b.DrawNos;
          const comparison = aNum - bNum;
          return sortDirection === 'asc' ? comparison : -comparison;
        }
      });

      setSearchResults(results);
    } catch (err: any) {
      setError(err.message);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle pagination changes
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Handle page size changes
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Get stats data based on search type
  const getStatsData = () => {
    if (!searchResults.length) return null;

    switch (searchType) {
      case 'weekday':
        return dowData;
      case 'holiday':
        return holidaysData?.filter((item: any) => item.Holiday === selectedHoliday) || null;
      case 'dayOfMonth':
        return domData?.filter((item: any) => item.DOM === selectedDayOfMonth) || null;
      default:
        return null;
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(searchResults.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, searchResults.length);
  const paginatedResults = searchResults.slice(startIndex, endIndex);

  // ExportCSV function
  const exportToCSV = () => {
    if (!searchResults.length) return;
    
    // Create CSV content
    const headers = ['DrawNos', 'DrawDates', 'AllNos', 'CBall', 'Wins', 'Draws', 'Nfpd'];
    const csvContent = [
      headers.join(','),
      ...searchResults.map(item => [
        item.DrawNos,
        item.DrawDates,
        item.AllNos,
        item.CBall,
        item.Wins,
        item.Draws,
        item.Nfpd
      ].join(','))
    ].join('\n');
    
    // Create downloadable content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `winforlife_search_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to get day name from index
  const getDayName = (dayIndex: number): string => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[dayIndex] || '';
  };

  // Reset all filters
  const resetFilters = () => {
    setDateRange('ALL');
    setSortBy('date');
    setSortDirection('desc');
  };

  // Generate day of month options
  const daysOfMonth = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Search Win For Life Numbers</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Search for Win For Life numbers by draw number, date, weekday, holiday, or day of the month.
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
                  <option value="Thu">Thursday</option>
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
                  {daysOfMonth.map((day) => (
                    <option key={day} value={day}>
                      {day}
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

        {/* Filters and Sorting */}
        <div className="mb-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
            
            {showFilters && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetFilters}
              >
                <X className="h-4 w-4 mr-2" />
                Reset Filters
              </Button>
            )}
          </div>

          {searchResults.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={exportToCSV}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Results
            </Button>
          )}
        </div>

        {showFilters && (
          <div className="mb-4 p-4 border rounded-md bg-muted/20">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label className="block mb-2 text-sm font-medium">Date Range</Label>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(DATE_RANGES).map((range) => (
                    <Badge 
                      key={range} 
                      variant={dateRange === range ? "default" : "outline"} 
                      className="cursor-pointer"
                      onClick={() => setDateRange(range as keyof typeof DATE_RANGES)}
                    >
                      {range}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="block mb-2 text-sm font-medium">Sort By</Label>
                <div className="flex flex-wrap gap-2">
                  <Badge 
                    variant={sortBy === 'date' ? "default" : "outline"} 
                    className="cursor-pointer"
                    onClick={() => setSortBy('date')}
                  >
                    Draw Date
                  </Badge>
                  <Badge 
                    variant={sortBy === 'number' ? "default" : "outline"} 
                    className="cursor-pointer"
                    onClick={() => setSortBy('number')}
                  >
                    Draw Number
                  </Badge>
                </div>
              </div>

              <div>
                <Label className="block mb-2 text-sm font-medium">Sort Direction</Label>
                <div className="flex flex-wrap gap-2">
                  <Badge 
                    variant={sortDirection === 'asc' ? "default" : "outline"} 
                    className="cursor-pointer"
                    onClick={() => setSortDirection('asc')}
                  >
                    Ascending
                  </Badge>
                  <Badge 
                    variant={sortDirection === 'desc' ? "default" : "outline"} 
                    className="cursor-pointer"
                    onClick={() => setSortDirection('desc')}
                  >
                    Descending
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 border border-red-200 rounded-md bg-red-50 text-red-600 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            {error}
          </div>
        )}
      </div>

      {searchPerformed && !isSearching && (
        <div>
          {searchResults.length > 0 ? (
            <>
              <div className="mb-4">
                <h4 className="text-md font-medium">
                  Found {searchResults.length} results
                  {searchType === 'weekday' && selectedWeekday && ` for ${selectedWeekday}`}
                  {searchType === 'holiday' && selectedHoliday && ` for ${selectedHoliday}`}
                  {searchType === 'dayOfMonth' && selectedDayOfMonth && ` for day ${selectedDayOfMonth} of the month`}
                </h4>
              </div>

              {/* Results Table */}
              <div className="mb-6 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Draw No</TableHead>
                      <TableHead>Draw Date</TableHead>
                      <TableHead>Numbers</TableHead>
                      <TableHead>Cash Ball</TableHead>
                      <TableHead>Day</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedResults.map((result, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{result.DrawNos}</TableCell>
                        <TableCell>{result.DrawDates}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {result.allNumbers?.map((num, i) => (
                              <Badge key={i} variant="outline" className="bg-primary/5">
                                {num}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default" className="bg-secondary">
                            {result.CBall}
                          </Badge>
                        </TableCell>
                        <TableCell>{result.day}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center mb-6">
                  <div className="text-sm text-muted-foreground">
                    Showing {startIndex + 1}-{endIndex} of {searchResults.length} results
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <select
                      value={pageSize}
                      onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                      className="p-1 border rounded text-sm"
                      aria-label="Select Page Size"
                    >
                      {PAGE_SIZE_OPTIONS.map(size => (
                        <option key={size} value={size}>
                          {size} per page
                        </option>
                      ))}
                    </select>
                    
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                      >
                        <span className="sr-only">First Page</span>
                        <ChevronLeft className="h-4 w-4" />|
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <span className="sr-only">Previous Page</span>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      
                      <span className="text-sm mx-2">
                        Page {currentPage} of {totalPages}
                      </span>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <span className="sr-only">Next Page</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                      >
                        <span className="sr-only">Last Page</span>
                        |<ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Stats display for relevant search types */}
              {['weekday', 'holiday', 'dayOfMonth'].includes(searchType) && (
                <div className="mt-8">
                  <h4 className="text-lg font-semibold mb-4">Statistics</h4>
                  <GameSearchResultsStats
                    searchType={searchType as any}
                    searchResults={searchResults}
                    selectedValue={
                      searchType === 'weekday' ? selectedWeekday :
                      searchType === 'holiday' ? selectedHoliday :
                      selectedDayOfMonth
                    }
                    statsData={getStatsData()}
                    gameType="winforlife"
                    hasLineData={false}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No results found for your search criteria.</p>
              <p className="text-sm mt-2">Try adjusting your search parameters.</p>
            </div>
          )}
        </div>
      )}

      {/* Initial state - no search performed yet */}
      {!searchPerformed && !isSearching && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Select search criteria and click Search to find Win For Life numbers.</p>
        </div>
      )}
    </Card>
  );
}
