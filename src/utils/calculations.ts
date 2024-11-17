import { differenceInYears } from 'date-fns';
import { UserInputs, SimulationRow, SimulationResult } from '../types';
import {
  INFLATION_RATE,
  PENSION_GROWTH_RATE,
  STATE_PENSION_AGE,
  FULL_STATE_PENSION_WEEKLY,
  MIN_NI_YEARS,
  FULL_NI_YEARS,
  MORTGAGE_INTEREST_RATE,
} from './constants';

export const calculateIncomeTax = (income: number): number => {
  let tax = 0;
  let remainingIncome = income;
  
  // Personal allowance reduction
  let personalAllowance = 12570;
  if (income > 100000) {
    const reduction = Math.min(personalAllowance, Math.floor((income - 100000) / 2));
    personalAllowance -= reduction;
  }

  // Personal allowance
  remainingIncome -= personalAllowance;
  
  // Basic rate (20%)
  if (remainingIncome > 0) {
    const basicRateAmount = Math.min(remainingIncome, 50270 - 12570);
    tax += basicRateAmount * 0.2;
    remainingIncome -= basicRateAmount;
  }

  // Higher rate (40%)
  if (remainingIncome > 0) {
    const higherRateAmount = Math.min(remainingIncome, 125140 - 50270);
    tax += higherRateAmount * 0.4;
    remainingIncome -= higherRateAmount;
  }

  // Additional rate (45%)
  if (remainingIncome > 0) {
    tax += remainingIncome * 0.45;
  }

  return Math.round(tax);
};

export const calculateNI = (income: number, isRetired: boolean): number => {
  // No NI contributions on pension income or after state pension age
  if (isRetired) {
    return 0;
  }

  let ni = 0;
  let remainingIncome = income;

  // Below threshold
  if (remainingIncome <= 12570) {
    return 0;
  }

  // 12% on earnings between £12,570 and £50,270
  if (remainingIncome > 12570) {
    const basicAmount = Math.min(remainingIncome - 12570, 50270 - 12570);
    ni += basicAmount * 0.12;
    remainingIncome -= basicAmount;
  }

  // 2% on earnings above £50,270
  if (remainingIncome > 50270) {
    ni += (remainingIncome - 50270) * 0.02;
  }

  return Math.round(ni);
};

export const calculateStatePension = (
  age: number,
  niYears: number,
  yearIndex: number
): number => {
  // Don't return state pension if under state pension age or insufficient NI years
  if (age < STATE_PENSION_AGE || niYears < MIN_NI_YEARS) {
    return 0;
  }

  // Calculate base weekly amount based on NI years
  const niYearsRatio = Math.min(1, niYears / FULL_NI_YEARS);
  const baseWeeklyAmount = FULL_STATE_PENSION_WEEKLY * niYearsRatio;

  // Convert to annual amount
  const baseAnnualAmount = baseWeeklyAmount * 52;
  
  // Apply inflation adjustment
  const inflationMultiplier = Math.pow(1 + INFLATION_RATE, yearIndex);
  return Math.round(baseAnnualAmount * inflationMultiplier);
};

export const calculateMortgageBalance = (
  previousBalance: number,
  annualPayment: number
): number => {
  if (previousBalance <= 0) return 0;
  
  // Calculate interest for the year
  const interest = previousBalance * MORTGAGE_INTEREST_RATE;
  
  // Calculate new balance after payment and interest
  const newBalance = previousBalance + interest - annualPayment;
  
  // Return 0 if balance would be negative
  return Math.max(0, newBalance);
};

const calculateRequiredPensionWithdrawal = (
  expenses: number,
  statePension: number,
  additionalIncome: number,
  pensionBalance: number
): number => {
  const totalExpenses = expenses;
  const otherIncome = statePension + additionalIncome;
  const requiredWithdrawal = Math.max(0, totalExpenses - otherIncome);
  
  // Limit withdrawal to available pension balance
  return Math.min(requiredWithdrawal, pensionBalance);
};

export const simulateFinancialJourney = (inputs: UserInputs): SimulationResult => {
  const currentAge = differenceInYears(new Date(), inputs.birthDate);
  const yearsToSimulate = inputs.expectedDeathAge - currentAge;
  
  const rows: SimulationRow[] = [];
  let totalSavings = inputs.initialSavings;
  let pensionBalance = 0;
  let mortgageBalance = inputs.mortgageRemainingLiability;
  let currentNIYears = inputs.currentNIYears;

  for (let i = 0; i <= yearsToSimulate; i++) {
    const age = currentAge + i;
    const year = new Date().getFullYear() + i;
    const isRetired = age >= inputs.retirementAge;

    // Update NI years (max 35)
    if (!isRetired && currentNIYears < FULL_NI_YEARS) {
      currentNIYears++;
    }

    // Calculate inflation-adjusted values
    const inflationMultiplier = Math.pow(1 + INFLATION_RATE, i);
    const livingExpenses = inputs.livingExpenses * inflationMultiplier;
    const additionalIncome = inputs.additionalIncome * inflationMultiplier;

    // Calculate state pension with inflation adjustment
    const statePension = calculateStatePension(age, currentNIYears, i);

    // Calculate income and pension
    let salary = 0;
    let pensionContributions = 0;
    let pensionWithdrawals = 0;

    if (!isRetired) {
      salary = inputs.salary * inflationMultiplier;
      const employerContribution = salary * 0.08; // 8% employer contribution
      const employeeContribution = salary * (inputs.pensionContributionRate / 100);
      pensionContributions = employerContribution + employeeContribution;
      pensionBalance = (pensionBalance + pensionContributions) * (1 + PENSION_GROWTH_RATE);
    } else {
      pensionWithdrawals = calculateRequiredPensionWithdrawal(
        livingExpenses,
        statePension,
        additionalIncome,
        pensionBalance
      );
      pensionBalance = (pensionBalance - pensionWithdrawals) * (1 + PENSION_GROWTH_RATE);
    }

    // Calculate total income and taxes
    const totalIncome = salary + additionalIncome + statePension + pensionWithdrawals;
    const incomeTax = calculateIncomeTax(totalIncome);
    const nationalInsurance = calculateNI(salary, isRetired);
    const netIncoming = totalIncome - incomeTax - nationalInsurance;

    // Calculate mortgage
    const mortgageRepayment = mortgageBalance > 0 ? inputs.annualMortgageRepayment : 0;
    mortgageBalance = calculateMortgageBalance(mortgageBalance, mortgageRepayment);

    // Calculate cash flow and savings
    const cashFlow = netIncoming - livingExpenses - mortgageRepayment;
    
    if (cashFlow < 0 && totalSavings > 0) {
      const savingsUsed = Math.min(-cashFlow, totalSavings);
      totalSavings -= savingsUsed;
    } else {
      totalSavings = (totalSavings + cashFlow) * (1 + INFLATION_RATE);
    }

    const netWorth = totalSavings + pensionBalance - mortgageBalance;

    rows.push({
      year,
      age,
      totalIncome,
      additionalIncome,
      incomeTax,
      nationalInsurance,
      netIncoming,
      pensionContributions,
      pensionWithdrawals,
      pensionFundBalance: pensionBalance,
      statePension,
      livingExpenses,
      mortgageRepayment,
      mortgageRemainingBalance: mortgageBalance,
      cashFlow,
      totalSavings,
      netWorth
    });

    // Check for failure condition
    if (totalSavings < 0 && pensionBalance < livingExpenses) {
      return {
        rows,
        hasWon: false,
        failureAge: age
      };
    }
  }

  return {
    rows,
    hasWon: true
  };
};