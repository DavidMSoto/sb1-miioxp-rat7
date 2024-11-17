export interface UserInputs {
  birthDate: Date;
  expectedDeathAge: number;
  retirementAge: number;
  initialSavings: number;
  salary: number;
  additionalIncome: number;
  livingExpenses: number;
  mortgageRemainingLiability: number;
  annualMortgageRepayment: number;
  currentNIYears: number;
  pensionContributionRate: number;
}

export interface SimulationRow {
  year: number;
  age: number;
  totalIncome: number;
  additionalIncome: number;
  incomeTax: number;
  nationalInsurance: number;
  netIncoming: number;
  pensionWithdrawals: number;
  pensionContributions: number;
  pensionFundBalance: number;
  statePension: number;
  livingExpenses: number;
  mortgageRepayment: number;
  mortgageRemainingBalance: number;
  cashFlow: number;
  totalSavings: number;
  netWorth: number;
}

export interface SimulationResult {
  rows: SimulationRow[];
  hasWon: boolean;
  failureAge?: number;
}

export interface PensionOptimization {
  additionalContribution: number;
  taxSaving: number;
  message: string;
}

export interface IsaOptimization {
  recommendedContribution: number;
  projectedGrowth: number;
  message: string;
}

export interface ExpenseOptimization {
  recommendedReduction: number;
  impact: number;
  message: string;
}

export interface OptimizationSuggestions {
  pensionOptimization: PensionOptimization | null;
  isaOptimization: IsaOptimization | null;
  expenseOptimization: ExpenseOptimization | null;
}