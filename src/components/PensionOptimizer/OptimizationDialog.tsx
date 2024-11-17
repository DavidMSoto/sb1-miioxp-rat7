import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  Divider,
} from '@mui/material';
import { ComparisonTable } from './ComparisonTable';
import { OptimizationResult, ComparisonRow } from './types';
import { calculateIncomeTax, calculateNI } from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatting';

interface OptimizationDialogProps {
  open: boolean;
  onClose: () => void;
  onApply: () => void;
  result: OptimizationResult;
}

export const OptimizationDialog: React.FC<OptimizationDialogProps> = ({
  open,
  onClose,
  onApply,
  result,
}) => {
  const comparisonRows: ComparisonRow[] = [
    {
      label: 'Gross Salary',
      before: result.originalSalary,
      after: result.newSalary,
      difference: -result.sacrificedAmount,
    },
    {
      label: 'Income Tax',
      before: calculateIncomeTax(result.originalSalary),
      after: calculateIncomeTax(result.newSalary),
      difference: -result.taxSaving,
    },
    {
      label: 'National Insurance',
      before: calculateNI(result.originalSalary, false),
      after: calculateNI(result.newSalary, false),
      difference: -result.niSaving,
    },
    {
      label: 'Pension Contribution',
      before: result.totalPensionContribution - result.additionalPensionContribution,
      after: result.totalPensionContribution,
      difference: result.additionalPensionContribution,
      isHighlight: true,
    },
    {
      label: 'Annual Living Expenses',
      before: result.expenseReduction.annualImpact + result.expenseReduction.amount,
      after: result.expenseReduction.annualImpact,
      difference: -result.expenseReduction.amount,
      isHighlight: true,
    },
    {
      label: 'Total Annual Benefit',
      before: 0,
      after: result.totalBenefit + result.expenseReduction.amount,
      difference: result.totalBenefit + result.expenseReduction.amount,
      isHighlight: true,
    },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Financial Optimization Recommendations</DialogTitle>
      <DialogContent>
        <Alert severity="info" className="mb-4">
          We've identified two key areas for optimization: pension contributions through
          salary sacrifice and expense reduction opportunities.
        </Alert>

        <Typography variant="h6" className="mb-2">
          1. Pension Optimization
        </Typography>
        <Typography className="mb-4">
          We recommend sacrificing {formatCurrency(result.sacrificedAmount)} of your salary
          into your pension to optimize your tax position.
        </Typography>

        <Typography variant="h6" className="mb-2">
          2. Expense Reduction
        </Typography>
        <Typography className="mb-4">
          Reducing your annual expenses by {formatCurrency(result.expenseReduction.amount)} could
          save you {formatCurrency(result.expenseReduction.tenYearImpact)} over the next 10 years
          (adjusted for inflation).
        </Typography>

        <Divider className="my-4" />
        
        <Typography variant="h6" className="mb-2">
          Impact Analysis
        </Typography>
        <ComparisonTable rows={comparisonRows} />

        <Typography className="mt-4 text-sm text-gray-600">
          * All projections include inflation adjustments
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onApply} variant="contained" color="primary">
          Apply Optimizations
        </Button>
      </DialogActions>
    </Dialog>
  );
};