import { OptimizationResult } from './types';
import { calculateIncomeTax, calculateNI } from '../../utils/calculations';
import { INFLATION_RATE } from '../../utils/constants';

const HIGHER_RATE_THRESHOLD = 50000;
const MAX_PENSION_CONTRIBUTION = 60000;
const EXPENSE_REDUCTION_TARGET = 1000;

export const calculateOptimization = (
  salary: number,
  currentPensionRate: number,
  currentExpenses: number
): OptimizationResult | null => {
  if (salary <= HIGHER_RATE_THRESHOLD) return null;

  // Calculate optimal sacrifice amount (income above £50,000, capped by pension limits)
  const potentialSacrifice = salary - HIGHER_RATE_THRESHOLD;
  const currentPensionContribution = salary * (currentPensionRate / 100);
  const maxAdditionalContribution = MAX_PENSION_CONTRIBUTION - currentPensionContribution;
  const sacrificedAmount = Math.min(potentialSacrifice, maxAdditionalContribution);

  const newSalary = salary - sacrificedAmount;

  // Calculate tax implications
  const originalTax = calculateIncomeTax(salary);
  const newTax = calculateIncomeTax(newSalary);
  const taxSaving = originalTax - newTax;

  const originalNI = calculateNI(salary, false);
  const newNI = calculateNI(newSalary, false);
  const niSaving = originalNI - newNI;

  // Calculate pension impact
  const additionalPensionContribution = sacrificedAmount;
  const totalPensionContribution = currentPensionContribution + sacrificedAmount;

  // Calculate expense reduction impact
  const expenseReduction = {
    amount: EXPENSE_REDUCTION_TARGET,
    annualImpact: EXPENSE_REDUCTION_TARGET * (1 + INFLATION_RATE),
    tenYearImpact: Array.from({ length: 10 })
      .reduce((acc, _, i) => acc + EXPENSE_REDUCTION_TARGET * Math.pow(1 + INFLATION_RATE, i), 0)
  };

  return {
    originalSalary: salary,
    sacrificedAmount,
    newSalary,
    taxSaving,
    additionalPensionContribution,
    totalPensionContribution,
    niSaving,
    totalBenefit: taxSaving + niSaving,
    expenseReduction
  };
};