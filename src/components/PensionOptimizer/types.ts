import { OptimizationSuggestions } from '../../types';

export interface OptimizationResult {
  originalSalary: number;
  sacrificedAmount: number;
  newSalary: number;
  taxSaving: number;
  additionalPensionContribution: number;
  totalPensionContribution: number;
  niSaving: number;
  totalBenefit: number;
  expenseReduction: {
    amount: number;
    annualImpact: number;
    tenYearImpact: number;
  };
}

export interface ComparisonRow {
  label: string;
  before: number;
  after: number;
  difference: number;
  isHighlight?: boolean;
}

export interface OptimizationPanelProps {
  suggestions: OptimizationSuggestions;
  onApplyPensionOptimization?: () => void;
  onApplyIsaOptimization?: () => void;
  onApplyExpenseOptimization?: () => void;
}