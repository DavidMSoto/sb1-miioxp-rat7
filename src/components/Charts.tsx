import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { Paper, Typography, Grid } from '@mui/material';
import { SimulationRow } from '../types';
import { formatCurrency } from '../utils/formatting';

interface ChartsProps {
  data: SimulationRow[];
}

const formatValue = (value: number) => formatCurrency(Math.round(value));

export const Charts: React.FC<ChartsProps> = ({ data }) => {
  return (
    <Grid container spacing={3} className="mt-4">
      <Grid item xs={12}>
        <Paper className="p-4">
          <Typography variant="h6" className="mb-4">
            Net Worth Over Time
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="age" label={{ value: 'Age', position: 'bottom' }} />
              <YAxis tickFormatter={(value) => formatValue(value).replace('£', '')} />
              <Tooltip formatter={(value) => formatValue(Number(value))} />
              <Legend />
              <Line
                type="monotone"
                dataKey="netWorth"
                stroke="#8884d8"
                name="Net Worth"
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper className="p-4">
          <Typography variant="h6" className="mb-4">
            Income vs Expenses
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="age" />
              <YAxis tickFormatter={(value) => formatValue(value).replace('£', '')} />
              <Tooltip formatter={(value) => formatValue(Number(value))} />
              <Legend />
              <Bar dataKey="netIncoming" fill="#82ca9d" name="Net Income" />
              <Bar
                dataKey="livingExpenses"
                fill="#8884d8"
                name="Living Expenses"
              />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper className="p-4">
          <Typography variant="h6" className="mb-4">
            Pension Fund Balance
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="age" />
              <YAxis tickFormatter={(value) => formatValue(value).replace('£', '')} />
              <Tooltip formatter={(value) => formatValue(Number(value))} />
              <Legend />
              <Line
                type="monotone"
                dataKey="pensionFundBalance"
                stroke="#82ca9d"
                name="Pension Balance"
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
  );
};