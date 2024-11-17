import { SimulationRow } from '../../types';

export interface ColumnDefinition {
  key: keyof SimulationRow | 'totalTax';
  label: string;
  tooltip: string | ((row: SimulationRow, index: number, rows: SimulationRow[]) => string);
  format?: (value: number) => string;
  getValue?: (row: SimulationRow) => number | string;
  alwaysShow?: boolean;
}

export interface TooltipHelpers {
  formatTaxBreakdown: (income: number, incomeTax: number, ni: number) => string;
  formatPensionBreakdown: (contributions: number, salary: number) => string;
  formatBalanceChange: (
    previous: number,
    current: number,
    change: number,
    label: string
  ) => string;
}