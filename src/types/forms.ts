import { UserInputs, SimulationRow } from './index';

export interface FormSectionProps {
  inputs: UserInputs;
  onInputChange: (field: keyof UserInputs, value: number | Date) => void;
  errors: Partial<Record<keyof UserInputs, string>>;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof UserInputs, string>>;
}

export interface ResultsTableProps {
  rows: SimulationRow[];
}