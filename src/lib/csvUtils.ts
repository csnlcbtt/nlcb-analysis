
import { useState, useEffect } from 'react';

export interface CsvData {
  [key: string]: string | number;
}

export async function loadCsvData(filePath: string): Promise<CsvData[]> {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to load CSV: ${response.status} ${response.statusText}`);
    }
    
    const csvText = await response.text();
    const rows = parseCsvToJson(csvText);
    return rows;
  } catch (error) {
    console.error(`Error loading CSV data from ${filePath}:`, error);
    return [];
  }
}

// Simple CSV parser that handles basic CSV format with quoted fields
function parseCsvToJson(csvText: string): CsvData[] {
  const lines = csvText.split('\n');
  if (lines.length < 2) return [];
  
  // Parse header row, remove quotes from field names
  const headers = parseCSVLine(lines[0]);
  
  const result: CsvData[] = [];
  
  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const values = parseCSVLine(lines[i]);
    const row: CsvData = {};
    
    headers.forEach((header, index) => {
      // Try to convert to number if possible
      const value = values[index] || '';
      const numValue = Number(value);
      row[header] = isNaN(numValue) ? value : numValue;
    });
    
    result.push(row);
  }
  
  return result;
}

// Helper function to parse a CSV line respecting quotes
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let inQuotes = false;
  let currentValue = "";
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(currentValue.replace(/^"|"$/g, '').trim());
      currentValue = "";
    } else {
      currentValue += char;
    }
  }
  
  // Add the last value
  values.push(currentValue.replace(/^"|"$/g, '').trim());
  
  return values;
}

// Custom hook for loading CSV data
export function useCsvData(filePath: string) {
  const [data, setData] = useState<CsvData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const result = await loadCsvData(filePath);
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [filePath]);
  
  return { data, loading, error };
}
