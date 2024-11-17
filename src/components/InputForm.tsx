import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Alert,
} from '@mui/material';
import { UserInputs } from '../types';
import { PersonalInfoForm } from './Forms/PersonalInfoForm';
import { IncomeForm } from './Forms/IncomeForm';
import { PensionForm } from './Forms/PensionForm';

interface InputFormProps {
  inputs: UserInputs;
  onInputChange: (field: keyof UserInputs, value: number | Date) => void;
  errors: Partial<Record<keyof UserInputs, string>>;
  onSimulate: () => void;
}

export const InputForm: React.FC<InputFormProps> = ({
  inputs,
  onInputChange,
  errors,
  onSimulate,
}) => {
  return (
    <Paper className="p-6">
      <Typography variant="h5" className="mb-6 text-center">
        UK Financial Independence Calculator
      </Typography>

      <Alert severity="info" className="mb-6">
        Enter your financial details below to simulate your journey to financial independence.
        All calculations include inflation adjustments and follow current UK tax rules.
      </Alert>

      <Grid container spacing={4}>
        <PersonalInfoForm
          inputs={inputs}
          onInputChange={onInputChange}
          errors={errors}
        />
        
        <IncomeForm
          inputs={inputs}
          onInputChange={onInputChange}
          errors={errors}
        />

        <PensionForm
          inputs={inputs}
          onInputChange={onInputChange}
          errors={errors}
        />
      </Grid>

      <Box className="mt-8 text-center">
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={onSimulate}
          className="px-8 py-3"
        >
          Calculate Financial Journey
        </Button>
      </Box>
    </Paper>
  );
};