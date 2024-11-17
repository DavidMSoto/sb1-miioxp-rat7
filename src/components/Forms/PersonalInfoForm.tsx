import React from 'react';
import { Grid, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { FormSectionProps } from '../../types/forms';

export const PersonalInfoForm: React.FC<FormSectionProps> = ({
  inputs,
  onInputChange,
  errors,
}) => {
  return (
    <>
      <Grid item xs={12}>
        <Typography variant="h6" className="mb-4 text-gray-700">
          Personal Information
        </Typography>
      </Grid>

      <Grid item xs={12} md={4}>
        <DatePicker
          label="Birth Date"
          value={inputs.birthDate}
          onChange={(date) => onInputChange('birthDate', date as Date)}
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!errors.birthDate,
              helperText: errors.birthDate,
            },
          }}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Expected Death Age"
          type="number"
          value={inputs.expectedDeathAge}
          onChange={(e) => onInputChange('expectedDeathAge', Number(e.target.value))}
          error={!!errors.expectedDeathAge}
          helperText={errors.expectedDeathAge || 'Average UK life expectancy is 81'}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Target Retirement Age"
          type="number"
          value={inputs.retirementAge}
          onChange={(e) => onInputChange('retirementAge', Number(e.target.value))}
          error={!!errors.retirementAge}
          helperText={errors.retirementAge || 'State Pension age is 67'}
        />
      </Grid>
    </>
  );
};