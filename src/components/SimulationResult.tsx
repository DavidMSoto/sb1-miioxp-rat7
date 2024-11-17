import React from 'react';
import { Paper, Typography, Button } from '@mui/material';
import { Rat } from 'lucide-react';
import { SimulationResult, OptimizationSuggestions, UserInputs } from '../types';
import { OptimizationPanel } from './OptimizationPanel';

interface SimulationResultProps {
  result: SimulationResult;
  onOptimize: () => void;
  optimizationSuggestions?: OptimizationSuggestions;
  onUpdateInputs: (updates: Partial<UserInputs>) => void;
}

export const SimulationResultMessage: React.FC<SimulationResultProps> = ({
  result,
  onOptimize,
  optimizationSuggestions,
  onUpdateInputs,
}) => {
  const { hasWon, failureAge } = result;

  const handleApplyPensionOptimization = () => {
    if (optimizationSuggestions?.pensionOptimization) {
      const { additionalContribution } = optimizationSuggestions.pensionOptimization;
      onUpdateInputs({
        pensionContributionRate: additionalContribution / result.rows[0].totalIncome * 100,
      });
    }
  };

  const handleApplyIsaOptimization = () => {
    if (optimizationSuggestions?.isaOptimization) {
      const { recommendedContribution } = optimizationSuggestions.isaOptimization;
      onUpdateInputs({
        initialSavings: result.rows[0].totalSavings + recommendedContribution,
      });
    }
  };

  const handleApplyExpenseOptimization = () => {
    if (optimizationSuggestions?.expenseOptimization) {
      const { recommendedReduction } = optimizationSuggestions.expenseOptimization;
      onUpdateInputs({
        livingExpenses: result.rows[0].livingExpenses - recommendedReduction,
      });
    }
  };

  return (
    <>
      <Paper
        className={`p-6 mt-6 flex items-center gap-4 ${
          hasWon ? 'bg-green-50' : 'bg-red-50'
        }`}
      >
        <Rat
          size={48}
          className={hasWon ? 'text-green-600' : 'text-red-600'}
        />
        <div className="flex-grow">
          <Typography variant="h5" className={hasWon ? 'text-green-700' : 'text-red-700'}>
            {hasWon
              ? "Congratulations! You've beaten the rat race!"
              : `You ran out of money at age ${failureAge}`}
          </Typography>
          <Typography className={hasWon ? 'text-green-600' : 'text-red-600'}>
            {hasWon
              ? "You've secured financial independence and will leave a legacy."
              : "Consider adjusting your plan to ensure long-term financial stability."}
          </Typography>
        </div>
        {!hasWon && (
          <Button
            variant="contained"
            color="primary"
            onClick={onOptimize}
            className="ml-4"
          >
            Let Me Help You
          </Button>
        )}
      </Paper>
      {optimizationSuggestions && (
        <OptimizationPanel
          suggestions={optimizationSuggestions}
          onApplyPensionOptimization={handleApplyPensionOptimization}
          onApplyIsaOptimization={handleApplyIsaOptimization}
          onApplyExpenseOptimization={handleApplyExpenseOptimization}
        />
      )}
    </>
  );
};