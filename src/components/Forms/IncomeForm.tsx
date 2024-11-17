import React from 'react';
import { Grid, TextField, Typography, InputAdornment } from '@mui/material';
import { FormSectionProps } from '../../types/forms';

export const IncomeForm: React.FC<FormSectionProps> = ({
  inputs,
  onInputChange,
  errors,
}) => {
  return (
    <>
      <Grid item xs={12}>
        <Typography variant="h6" className="mb-4 mt-4 text-gray-700">
          Income & Savings
        </Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Annual Salary"
          type="number"
          value={inputs.salary}
          onChange={(e) => onInputChange('salary', Number(e.target.value))}
          error={!!errors.salary}
          helperText={errors.salary}
          InputProps={{
            startAdornment: <InputAdornment position="start">£</InputAdornment>,
          }}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Additional Annual Income"
          type="number"
          value={inputs.additionalIncome}
          onChange={(e) => onInputChange('additionalIncome', Number(e.target.value))}
          error={!!errors.additionalIncome}
          helperText={errors.additionalIncome || 'Rental income, dividends, etc.'}
          InputProps={{
            startAdornment: <InputAdornment position="start">£</InputAdornment>,
          }}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Current Savings"
          type="number"
          value={inputs.initialSavings}
          onChange={(e) => onInputChange('initialSavings', Number(e.target.value))}
          error={!!errors.initialSavings}
          helperText={errors.initialSavings || 'Total amount in savings accounts'}
          InputProps={{
            startAdornment: <InputAdornment position="start">£</InputAdornment>,
          }}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Annual Living Expenses"
          type="number"
          value={inputs.livingExpenses}
          onChange={(e) => onInputChange('livingExpenses', Number(e.target.value))}
          error={!!errors.livingExpenses}
          helperText={errors.livingExpenses || 'Total yearly spending excluding mortgage'}
          InputProps={{
            startAdornment: <InputAdornment position="start">£</InputAdornment>,
          }}
        />
      </Grid>
    </>
  );
};