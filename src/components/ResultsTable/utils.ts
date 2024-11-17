import { ColumnDefinition } from './types';
import { SimulationRow } from '../../types';

export const exportTableToCsv = (
  columns: ColumnDefinition[],
  rows: SimulationRow[]
) => {
  // Create CSV headers
  const headers = columns.map(col => col.label).join(',');
  
  // Create CSV rows
  const csvRows = rows.map(row => 
    columns.map(col => {
      const value = col.getValue ? col.getValue(row) : row[col.key as keyof SimulationRow];
      const formattedValue = typeof value === 'number' ? Math.round(value) : value;
      return typeof formattedValue === 'number' ? formattedValue : `"${formattedValue}"`;
    }).join(',')
  );
  
  // Combine headers and rows
  const csvContent = [headers, ...csvRows].join('\n');
  
  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'financial_simulation.csv';
  link.click();
};