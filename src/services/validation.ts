import { UserInputs } from '../types';
import { ValidationResult } from '../types/forms';
import { FULL_NI_YEARS } from '../utils/constants';

export const validateInputs = (inputs: UserInputs): ValidationResult => {
  const errors: Partial<Record<keyof UserInputs, string>> = {};

  if (!inputs.birthDate) {
    errors.birthDate = 'Birth date is required';
  }

  if (inputs.expectedDeathAge <= 0) {
    errors.expectedDeathAge = 'Expected death age must be positive';
  }

  if (inputs.retirementAge <= 0) {
    errors.retirementAge = 'Retirement age must be positive';
  }

  if (inputs.retirementAge >= inputs.expectedDeathAge) {
    errors.retirementAge = 'Retirement age must be less than expected death age';
  }

  if (inputs.salary < 0) {
    errors.salary = 'Salary cannot be negative';
  }

  if (inputs.additionalIncome < 0) {
    errors.additionalIncome = 'Additional income cannot be negative';
  }

  if (inputs.livingExpenses < 0) {
    errors.livingExpenses = 'Living expenses cannot be negative';
  }

  if (inputs.mortgageRemainingLiability < 0) {
    errors.mortgageRemainingLiability = 'Mortgage balance cannot be negative';
  }

  if (inputs.annualMortgageRepayment < 0) {
    errors.annualMortgageRepayment = 'Mortgage repayment cannot be negative';
  }

  if (inputs.currentNIYears < 0 || inputs.currentNIYears > FULL_NI_YEARS) {
    errors.currentNIYears = `NI years must be between 0 and ${FULL_NI_YEARS}`;
  }

  if (inputs.pensionContributionRate < 0 || inputs.pensionContributionRate > 100) {
    errors.pensionContributionRate = 'Pension contribution rate must be between 0 and 100';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};