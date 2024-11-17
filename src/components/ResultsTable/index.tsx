import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  Button,
} from '@mui/material';
import { Download } from 'lucide-react';
import { SimulationRow } from '../../types';
import { useTableColumns } from './useTableColumns';
import { exportTableToCsv } from './utils';

interface ResultsTableProps {
  rows: SimulationRow[];
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ rows }) => {
  const columns = useTableColumns(rows);

  return (
    <Paper className="mt-6">
      <div className="p-4 flex justify-end">
        <Button
          variant="outlined"
          startIcon={<Download size={16} />}
          onClick={() => exportTableToCsv(columns, rows)}
        >
          Export to CSV
        </Button>
      </div>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  <Tooltip
                    title={
                      <Typography style={{ whiteSpace: 'pre-line' }}>
                        {typeof column.tooltip === 'function'
                          ? column.tooltip(rows[0], 0, rows)
                          : column.tooltip}
                      </Typography>
                    }
                    arrow
                    placement="top"
                  >
                    <span className="font-semibold cursor-help">
                      {column.label}
                    </span>
                  </Tooltip>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => {
              const isRetired = row.pensionWithdrawals > 0;
              return (
                <TableRow
                  key={row.year}
                  className={`
                    ${index % 2 === 0 ? 'bg-gray-50' : ''}
                    ${isRetired ? 'bg-orange-50' : ''}
                  `}
                >
                  {columns.map((column) => {
                    const value = column.getValue ? column.getValue(row) : row[column.key as keyof SimulationRow];
                    const formattedValue = column.format
                      ? column.format(value as number)
                      : value;
                    const isNegative = typeof value === 'number' && value < 0;

                    return (
                      <TableCell
                        key={column.key}
                        className={isNegative ? 'bg-red-50' : ''}
                      >
                        <Tooltip
                          title={
                            <Typography style={{ whiteSpace: 'pre-line' }}>
                              {typeof column.tooltip === 'function'
                                ? column.tooltip(row, index, rows)
                                : column.tooltip}
                            </Typography>
                          }
                          arrow
                          placement="top"
                        >
                          <span
                            className={`cursor-help ${
                              isNegative ? 'text-red-600' : ''
                            }`}
                          >
                            {formattedValue}
                          </span>
                        </Tooltip>
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};