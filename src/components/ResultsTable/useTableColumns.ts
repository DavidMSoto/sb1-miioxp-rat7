import { useMemo } from 'react';
import { SimulationRow } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import { ColumnDefinition } from './types';
import { getTooltipContent } from './tooltips';

export const useTableColumns = (rows: SimulationRow[]) => {
  return useMemo(() => {
    // Remove this function as we want to show state pension even if it starts at 0
    const hasNonZeroValues = (key: keyof SimulationRow) => 
      rows.some(row => row[key] !== 0);

    const baseColumns: ColumnDefinition[] = [
      {
        key: 'year',
        label: 'Year',
        tooltip: 'The current year in the simulation timeline',
      },
      {
        key: 'age',
        label: 'Age',
        tooltip: 'Your age during this simulation year',
      },
      {
        key: 'totalIncome',
        label: 'Total Income',
        tooltip: getTooltipContent.totalIncome,
        format: formatCurrency,
      },
      {
        key: 'totalTax',
        label: 'Tax',
        tooltip: getTooltipContent.totalTax,
        format: formatCurrency,
        getValue: (row) => row.incomeTax + row.nationalInsurance,
      },
      {
        key: 'netIncoming',
        label: 'Net Incoming',
        tooltip: getTooltipContent.netIncoming,
        format: formatCurrency,
      }
    ];

    const optionalColumns: ColumnDefinition[] = [
      {
        key: 'pensionContributions',
        label: 'Pension Contributions',
        tooltip: getTooltipContent.pensionContributions,
        format: formatCurrency,
      },
      {
        key: 'pensionFundBalance',
        label: 'Pension Balance',
        tooltip: getTooltipContent.pensionFundBalance,
        format: formatCurrency,
      },
      {
        key: 'statePension',
        label: 'State Pension',
        tooltip: getTooltipContent.statePension,
        format: formatCurrency,
        // Always show state pension column
        alwaysShow: true,
      },
      {
        key: 'livingExpenses',
        label: 'Living Expenses',
        tooltip: getTooltipContent.livingExpenses,
        format: formatCurrency,
      },
      {
        key: 'mortgageRepayment',
        label: 'Mortgage Payment',
        tooltip: getTooltipContent.mortgageRepayment,
        format: formatCurrency,
      },
      {
        key: 'mortgageRemainingBalance',
        label: 'Mortgage Balance',
        tooltip: getTooltipContent.mortgageRemainingBalance,
        format: formatCurrency,
      },
      {
        key: 'cashFlow',
        label: 'Cash Flow',
        tooltip: getTooltipContent.cashFlow,
        format: formatCurrency,
      },
      {
        key: 'totalSavings',
        label: 'Total Savings',
        tooltip: getTooltipContent.totalSavings,
        format: formatCurrency,
      },
      {
        key: 'netWorth',
        label: 'Net Worth',
        tooltip: getTooltipContent.netWorth,
        format: formatCurrency,
      }
    ];

    // Filter out columns with all zero values, except those marked as alwaysShow
    const filteredColumns = optionalColumns.filter(column => {
      if (column.getValue || column.alwaysShow) return true;
      return hasNonZeroValues(column.key as keyof SimulationRow);
    });

    return [...baseColumns, ...filteredColumns];
  }, [rows]);
};