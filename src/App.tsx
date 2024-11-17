import React, { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Container } from '@mui/material';
import { UserInputs, SimulationResult, OptimizationSuggestions } from './types';
import { simulateFinancialJourney } from './utils/calculations';
import { optimizeFinancialPlan } from './utils/optimizations';
import { validateInputs } from './services/validation';
import { InputForm } from './components/InputForm';
import { ResultsTable } from './components/ResultsTable';
import { Charts } from './components/Charts';
import { SimulationResultMessage } from './components/SimulationResult';

const initialInputs: UserInputs = {
  birthDate: new Date(1990, 0, 1),
  expectedDeathAge: 85,
  retirementAge: 65,
  initialSavings: 10000,
  salary: 50000,
  additionalIncome: 0,
  livingExpenses: 25000,
  mortgageRemainingLiability: 200000,
  annualMortgageRepayment: 12000,
  currentNIYears: 5,
  pensionContributionRate: 5,
};

function App() {
  const [inputs, setInputs] = useState<UserInputs>(initialInputs);
  const [errors, setErrors] = useState<Partial<Record<keyof UserInputs, string>>>({});
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [optimizationSuggestions, setOptimizationSuggestions] = useState<OptimizationSuggestions | null>(null);

  const handleInputChange = (field: keyof UserInputs, value: number | Date) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const handleSimulate = () => {
    const validation = validateInputs(inputs);
    setErrors(validation.errors);
    
    if (validation.isValid) {
      const simulationResult = simulateFinancialJourney(inputs);
      setResult(simulationResult);
      setOptimizationSuggestions(null);
    }
  };

  const handleOptimize = () => {
    if (result) {
      const suggestions = optimizeFinancialPlan(inputs, result.rows);
      setOptimizationSuggestions(suggestions);
    }
  };

  const handleUpdateInputs = (updates: Partial<UserInputs>) => {
    setInputs(prev => {
      const newInputs = { ...prev, ...updates };
      const simulationResult = simulateFinancialJourney(newInputs);
      setResult(simulationResult);
      return newInputs;
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="xl" className="py-8">
        <InputForm
          inputs={inputs}
          onInputChange={handleInputChange}
          errors={errors}
          onSimulate={handleSimulate}
        />

        {result && (
          <>
            <SimulationResultMessage
              result={result}
              onOptimize={handleOptimize}
              optimizationSuggestions={optimizationSuggestions}
              onUpdateInputs={handleUpdateInputs}
            />
            <Charts data={result.rows} />
            <ResultsTable rows={result.rows} />
          </>
        )}
      </Container>
    </LocalizationProvider>
  );
}

export default App;