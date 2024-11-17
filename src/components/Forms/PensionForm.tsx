import React from 'react';
import { Grid, TextField, Typography, InputAdornment } from '@mui/material';
import { FormSectionProps } from '../../types/forms';

export const PensionForm: React.FC<FormSectionProps> = ({
  inputs,
  onInputChange,
  errors,
}) => {
  return (
    <>
      <Grid item xs={12}>
        <Typography variant="h6" className="mb-4 mt-4 text-gray-700">
          Pension Information
        </Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Current NI Years"
          type="number"
          value={inputs.currentNIYears}
          onChange={(e) => onInputChange('currentNIYears', Number(e.target.value))}
          error={!!errors.currentNIYears}
          helperText={errors.currentNIYears || '35 years needed for full State Pension'}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Pension Contribution Rate"
          type="number"
          value={inputs.pensionContributionRate}
          onChange={(e) => onInputChange('pensionContributionRate', Number(e.target.value))}
          error={!!errors.pensionContributionRate}
          helperText={errors.pensionContributionRate || 'Your contribution as % of salary'}
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
        />
      </Grid>
    </>
  );
};