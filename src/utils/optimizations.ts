import { UserInputs, SimulationRow, OptimizationSuggestions } from '../types';
import { simulateFinancialJourney } from './calculations';
import { formatCurrency } from './formatting';

const ISA_ANNUAL_LIMIT = 20000;
const HIGHER_RATE_THRESHOLD = 50270;

export const optimizeFinancialPlan = (
  inputs: UserInputs,
  originalSimulation: SimulationRow[]
): OptimizationSuggestions => {
  const suggestions: OptimizationSuggestions = {
    pensionOptimization: null,
    isaOptimization: null,
    expenseOptimization: null,
  };

  // Check for pension optimization opportunity
  if (inputs.salary > HIGHER_RATE_THRESHOLD) {
    const additionalPensionContribution = Math.min(
      inputs.salary - HIGHER_RATE_THRESHOLD,
      (inputs.salary * 0.4) // Max 40% of salary
    );
    
    suggestions.pensionOptimization = {
      additionalContribution: additionalPensionContribution,
      taxSaving: additionalPensionContribution * 0.4,
      message: `Increasing your pension contribution by ${formatCurrency(additionalPensionContribution)} 
        could save you ${formatCurrency(additionalPensionContribution * 0.4)} in tax.`,
    };
  }

  // Check for ISA optimization opportunity
  const averageCashFlow = originalSimulation.reduce((sum, row) => sum + row.cashFlow, 0) / originalSimulation.length;
  if (averageCashFlow > 0) {
    const recommendedIsaContribution = Math.min(averageCashFlow, ISA_ANNUAL_LIMIT);
    suggestions.isaOptimization = {
      recommendedContribution: recommendedIsaContribution,
      projectedGrowth: recommendedIsaContribution * Math.pow(1.05, 10), // 5% growth over 10 years
      message: `Contributing ${formatCurrency(recommendedIsaContribution)} annually to an ISA could grow to 
        ${formatCurrency(recommendedIsaContribution * Math.pow(1.05, 10))} in 10 years.`,
    };
  }

  // Check for expense optimization opportunity
  const incomeToExpenseRatio = inputs.salary / inputs.livingExpenses;
  if (incomeToExpenseRatio < 2) { // If expenses are more than half of income
    const recommendedExpenseReduction = inputs.livingExpenses * 0.2; // Suggest 20% reduction
    suggestions.expenseOptimization = {
      recommendedReduction: recommendedExpenseReduction,
      impact: recommendedExpenseReduction * 12,
      message: `Reducing your annual expenses by ${formatCurrency(recommendedExpenseReduction)} could 
        increase your savings by ${formatCurrency(recommendedExpenseReduction * 12)} per year.`,
    };
  }

  return suggestions;
};