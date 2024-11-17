import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { ComparisonRow } from './types';
import { formatCurrency } from '../../utils/formatting';

interface ComparisonTableProps {
  rows: ComparisonRow[];
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ rows }) => {
  return (
    <TableContainer component={Paper} className="mt-4">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Item</TableCell>
            <TableCell align="right">Before</TableCell>
            <TableCell align="right">After</TableCell>
            <TableCell align="right">Difference</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.label}
              className={row.isHighlight ? 'bg-green-50' : undefined}
            >
              <TableCell>
                <Typography
                  className={row.isHighlight ? 'font-semibold text-green-700' : undefined}
                >
                  {row.label}
                </Typography>
              </TableCell>
              <TableCell align="right">{formatCurrency(row.before)}</TableCell>
              <TableCell align="right">{formatCurrency(row.after)}</TableCell>
              <TableCell
                align="right"
                className={row.difference > 0 ? 'text-green-600' : 'text-red-600'}
              >
                {row.difference > 0 ? '+' : ''}
                {formatCurrency(row.difference)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};