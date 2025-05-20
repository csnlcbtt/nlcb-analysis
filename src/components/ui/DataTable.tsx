import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Column {
  key: string;
  header: string;
  cell?: (row: any) => React.ReactNode;
  width?: string;
  truncate?: boolean;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  className?: string;
  maxHeight?: string;
}

export function DataTable({ data, columns, className, maxHeight }: DataTableProps) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Sorting logic
  const sortedData = React.useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return sortDirection === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  }, [data, sortKey, sortDirection]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };
  return (
    <div className="relative">
      <div className="overflow-hidden rounded-md border">
        <ScrollArea 
          className={`${maxHeight ? `max-h-[${maxHeight}]` : ''} overflow-auto`}
          showShadows={true}>
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                {columns.map((column) => (                  <TableHead
                    key={column.key}
                    className="font-semibold cursor-pointer select-none whitespace-nowrap"
                    onClick={() => handleSort(column.key)}
                    style={column.width && column.width !== 'auto' ? { width: column.width } : {}}
                  >
                    <span className="flex items-center">
                      <span className="truncate">{column.header}</span>
                      {sortKey === column.key && (
                        <span className="ml-1 flex-shrink-0">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </span>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center py-6 text-muted-foreground">
                    No records found
                  </TableCell>
                </TableRow>
              ) : (
                sortedData.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {columns.map((column) => (                <TableCell 
                        key={`${rowIndex}-${column.key}`}
                        className={`${column.truncate ? 'truncate' : ''} ${column.width === 'auto' ? 'w-auto' : ''}`}
                        style={column.width && column.width !== 'auto' ? { width: column.width } : {}}
                      >
                        {column.cell ? column.cell(row) : row[column.key]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
      <div className="absolute left-0 top-0 bottom-0 h-full w-4 pointer-events-none bg-gradient-to-r from-background to-transparent opacity-0 transition-opacity peer-scroll-left:opacity-100" />
      <div className="absolute right-0 top-0 bottom-0 h-full w-4 pointer-events-none bg-gradient-to-l from-background to-transparent opacity-0 transition-opacity peer-scroll-right:opacity-100" />
    </div>
  );
}
