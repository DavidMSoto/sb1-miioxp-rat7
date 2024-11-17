import { SimulationRow } from '../../types';
import { formatCurrency, formatPercentage } from '../../utils/formatting';
import { TooltipHelpers } from './types';
import {
  FULL_STATE_PENSION_WEEKLY,
  STATE_PENSION_AGE,
  MIN_NI_YEARS,
  FULL_NI_YEARS,
  INFLATION_RATE,
  PERSONAL_ALLOWANCE,
  BASIC_RATE_THRESHOLD,
  HIGHER_RATE_THRESHOLD,
  PERSONAL_ALLOWANCE_TAPER_THRESHOLD,
  BASIC_RATE,
  HIGHER_RATE,
  ADDITIONAL_RATE
} from '../../utils/constants';

const helpers: TooltipHelpers = {
  formatTaxBreakdown: (income: number, incomeTax: number, ni: number) => {
    const personalAllowance = Math.max(0, PERSONAL_ALLOWANCE - Math.max(0, (income - PERSONAL_ALLOWANCE_TAPER_THRESHOLD) / 2));
    const basicRate = Math.min(Math.max(income - personalAllowance, 0), BASIC_RATE_THRESHOLD - PERSONAL_ALLOWANCE);
    const higherRate = Math.min(Math.max(income - BASIC_RATE_THRESHOLD, 0), HIGHER_RATE_THRESHOLD - BASIC_RATE_THRESHOLD);
    const additionalRate = Math.max(income - HIGHER_RATE_THRESHOLD, 0);
    
    return `
      Tax Breakdown
      ────────────────────
      1. Income Tax (${formatCurrency(incomeTax)}):
         • Personal Allowance: ${formatCurrency(personalAllowance)}
         ${income > PERSONAL_ALLOWANCE_TAPER_THRESHOLD ? '   Reduced due to income over £100,000' : ''}
         
         Tax Bands:
         • Basic (${formatPercentage(BASIC_RATE * 100)}): ${formatCurrency(basicRate)} × ${formatPercentage(BASIC_RATE * 100)} = ${formatCurrency(basicRate * BASIC_RATE)}
         • Higher (${formatPercentage(HIGHER_RATE * 100)}): ${formatCurrency(higherRate)} × ${formatPercentage(HIGHER_RATE * 100)} = ${formatCurrency(higherRate * HIGHER_RATE)}
         • Additional (${formatPercentage(ADDITIONAL_RATE * 100)}): ${formatCurrency(additionalRate)} × ${formatPercentage(ADDITIONAL_RATE * 100)} = ${formatCurrency(additionalRate * ADDITIONAL_RATE)}

      2. National Insurance (${formatCurrency(ni)}):
         • 12% on £12,570 to £50,270
         • 2% above £50,270

      Total Tax: ${formatCurrency(incomeTax + ni)}
      Effective Rate: ${formatPercentage((incomeTax + ni) / income * 100)}
    `;
  },

  formatPensionBreakdown: (contributions: number, salary: number) => {
    const employeeRate = contributions / salary * 0.385;
    const employerRate = 0.08;
    const employeeAmount = contributions * 0.385;
    const employerAmount = contributions * 0.615;
    
    return `
      Pension Contributions
      ────────────────────
      Employee (${formatPercentage(employeeRate)}): ${formatCurrency(employeeAmount)}
      • Tax Relief: ${formatCurrency(employeeAmount * BASIC_RATE)} (basic rate)
      ${salary > BASIC_RATE_THRESHOLD ? `• Additional Relief: ${formatCurrency(employeeAmount * (HIGHER_RATE - BASIC_RATE))} (higher rate)` : ''}
      
      Employer (${formatPercentage(employerRate)}): ${formatCurrency(employerAmount)}
      
      Total: ${formatCurrency(contributions)}
      (${formatPercentage((employeeRate + employerRate))} of salary)
    `;
  },

  formatBalanceChange: (previous: number, current: number, change: number, label: string) => `
    ${label} Change
    ────────────────────
    Previous: ${formatCurrency(previous)}
    Change: ${formatCurrency(change)}
    New Balance: ${formatCurrency(current)}
    
    ${change >= 0 ? 'Increase' : 'Decrease'}: ${formatPercentage(Math.abs(change / previous) * 100)}
  `,

  formatStatePension: (age: number, niYears: number, yearIndex: number) => {
    const isEligibleAge = age >= STATE_PENSION_AGE;
    const isEligibleNI = niYears >= MIN_NI_YEARS;
    const niProportion = Math.min(1, niYears / FULL_NI_YEARS);
    const inflationMultiplier = Math.pow(1 + INFLATION_RATE, yearIndex);
    
    const weeklyAmount = FULL_STATE_PENSION_WEEKLY * niProportion * inflationMultiplier;
    const annualAmount = weeklyAmount * 52;

    let eligibilityStatus = 'Eligible';
    if (!isEligibleAge) {
      eligibilityStatus = `Not yet eligible (${STATE_PENSION_AGE - age} years until State Pension age)`;
    } else if (!isEligibleNI) {
      eligibilityStatus = `Not eligible (need ${MIN_NI_YEARS - niYears} more NI years)`;
    }

    return `
      State Pension Details
      ────────────────────
      Status: ${eligibilityStatus}

      Current Amounts (inflation adjusted):
      • Weekly: ${formatCurrency(weeklyAmount)}
      • Annual: ${formatCurrency(annualAmount)}

      Calculation Breakdown:
      • Base Weekly Amount: £${FULL_STATE_PENSION_WEEKLY.toFixed(2)}
      • NI Years: ${niYears}/${FULL_NI_YEARS} (${formatPercentage(niProportion * 100)})
      • Inflation Adjustment: ${formatPercentage(inflationMultiplier * 100 - 100)} over ${yearIndex} years

      Eligibility Requirements:
      • Minimum Age: ${STATE_PENSION_AGE}
      • Minimum NI Years: ${MIN_NI_YEARS}
      • Full Pension NI Years: ${FULL_NI_YEARS}
    `;
  }
};

export const getTooltipContent = {
  totalIncome: (row: SimulationRow) => `
    Income Breakdown
    ────────────────────
    • Salary: ${formatCurrency(row.totalIncome - row.additionalIncome)}
    • Additional Income: ${formatCurrency(row.additionalIncome)}
    • Total: ${formatCurrency(row.totalIncome)}
    
    Note: Increases by ${formatPercentage(INFLATION_RATE * 100)} annually for inflation
  `,

  totalTax: (row: SimulationRow) => 
    helpers.formatTaxBreakdown(row.totalIncome, row.incomeTax, row.nationalInsurance),

  netIncoming: (row: SimulationRow) => `
    Net Income Calculation
    ────────────────────
    • Gross Income: ${formatCurrency(row.totalIncome)}
    • Total Tax: ${formatCurrency(row.incomeTax + row.nationalInsurance)}
    • Net Income: ${formatCurrency(row.netIncoming)}
    
    Effective Tax Rate: ${formatPercentage((row.incomeTax + row.nationalInsurance) / row.totalIncome * 100)}
  `,

  pensionContributions: (row: SimulationRow) => 
    helpers.formatPensionBreakdown(row.pensionContributions, row.totalIncome),

  pensionFundBalance: (row: SimulationRow, index: number, rows: SimulationRow[]) => {
    const previousBalance = index > 0 ? rows[index - 1].pensionFundBalance : 0;
    const change = row.pensionFundBalance - previousBalance;
    return helpers.formatBalanceChange(
      previousBalance,
      row.pensionFundBalance,
      change,
      'Pension Fund'
    );
  },

  statePension: (row: SimulationRow, index: number) => 
    helpers.formatStatePension(row.age, Math.min(row.age - 18, FULL_NI_YEARS), index),

  livingExpenses: (row: SimulationRow) => `
    Living Expenses
    ────────────────────
    • Annual: ${formatCurrency(row.livingExpenses)}
    • Monthly: ${formatCurrency(row.livingExpenses / 12)}
    
    Note: Increases by ${formatPercentage(INFLATION_RATE * 100)} annually for inflation
  `,

  mortgageRepayment: (row: SimulationRow) => `
    Mortgage Payment
    ────────────────────
    • Annual: ${formatCurrency(row.mortgageRepayment)}
    • Monthly: ${formatCurrency(row.mortgageRepayment / 12)}
    
    Remaining Balance: ${formatCurrency(row.mortgageRemainingBalance)}
    ${row.mortgageRemainingBalance === 0 ? '(Mortgage fully paid)' : ''}
  `,

  mortgageRemainingBalance: (row: SimulationRow, index: number, rows: SimulationRow[]) => {
    const previousBalance = index > 0 ? rows[index - 1].mortgageRemainingBalance : row.mortgageRemainingBalance + row.mortgageRepayment;
    const interest = previousBalance * INFLATION_RATE;
    return `
      Mortgage Balance
      ────────────────────
      • Previous: ${formatCurrency(previousBalance)}
      • Interest (${formatPercentage(INFLATION_RATE * 100)}): ${formatCurrency(interest)}
      • Payment: ${formatCurrency(row.mortgageRepayment)}
      • New Balance: ${formatCurrency(row.mortgageRemainingBalance)}
      
      Progress: ${formatPercentage((1 - row.mortgageRemainingBalance / rows[0].mortgageRemainingBalance) * 100)} paid off
    `;
  },

  cashFlow: (row: SimulationRow) => `
    Cash Flow Breakdown
    ────────────────────
    Income:
    • Net Income: ${formatCurrency(row.netIncoming)}
    • State Pension: ${formatCurrency(row.statePension)}
    
    Expenses:
    • Living Expenses: ${formatCurrency(row.livingExpenses)}
    • Mortgage Payment: ${formatCurrency(row.mortgageRepayment)}
    
    Net Cash Flow: ${formatCurrency(row.cashFlow)}
    Monthly Average: ${formatCurrency(row.cashFlow / 12)}
  `,

  totalSavings: (row: SimulationRow, index: number, rows: SimulationRow[]) => {
    const previousSavings = index > 0 ? rows[index - 1].totalSavings : row.totalSavings - row.cashFlow;
    const growth = (row.totalSavings - previousSavings - row.cashFlow);
    return `
      Savings Details
      ────────────────────
      • Previous Balance: ${formatCurrency(previousSavings)}
      • Cash Flow: ${formatCurrency(row.cashFlow)}
      • Growth (${formatPercentage(INFLATION_RATE * 100)}): ${formatCurrency(growth)}
      • New Balance: ${formatCurrency(row.totalSavings)}
      
      Monthly Average: ${formatCurrency(row.totalSavings / 12)}
      Annual Return: ${formatPercentage(growth / previousSavings * 100)}
    `;
  },

  netWorth: (row: SimulationRow) => `
    Net Worth Breakdown
    ────────────────────
    Assets:
    • Total Savings: ${formatCurrency(row.totalSavings)}
    • Pension Balance: ${formatCurrency(row.pensionFundBalance)}
    
    Liabilities:
    • Mortgage Balance: ${formatCurrency(row.mortgageRemainingBalance)}
    
    Net Worth: ${formatCurrency(row.netWorth)}
    
    Composition:
    • Savings: ${formatPercentage(row.totalSavings / row.netWorth * 100)}
    • Pension: ${formatPercentage(row.pensionFundBalance / row.netWorth * 100)}
    • Mortgage: ${formatPercentage(-row.mortgageRemainingBalance / row.netWorth * 100)}
  `,
};