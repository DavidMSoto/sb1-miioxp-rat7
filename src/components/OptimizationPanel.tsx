import React from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Collapse,
  IconButton,
  Button,
} from '@mui/material';
import {
  TrendingUp,
  Wallet,
  PiggyBank,
  ChevronDown,
  ChevronUp,
  Check,
} from 'lucide-react';
import { OptimizationSuggestions } from '../types';
import { OptimizationPanelProps } from './PensionOptimizer/types';

export const OptimizationPanel: React.FC<OptimizationPanelProps> = ({
  suggestions,
  onApplyPensionOptimization,
  onApplyIsaOptimization,
  onApplyExpenseOptimization,
}) => {
  const [expanded, setExpanded] = React.useState(true);
  const [appliedSuggestions, setAppliedSuggestions] = React.useState<Record<string, boolean>>({});

  const handleApply = (key: string, callback?: () => void) => {
    if (callback) {
      callback();
      setAppliedSuggestions(prev => ({ ...prev, [key]: true }));
    }
  };

  return (
    <Paper className="p-4 mt-6 bg-blue-50">
      <div className="flex items-center justify-between mb-4">
        <Typography variant="h6" className="text-blue-900">
          Financial Optimization Suggestions
        </Typography>
        <IconButton onClick={() => setExpanded(!expanded)} size="small">
          {expanded ? <ChevronUp /> : <ChevronDown />}
        </IconButton>
      </div>

      <Collapse in={expanded}>
        <List>
          {suggestions.pensionOptimization && (
            <ListItem className="bg-white rounded-lg mb-2 shadow-sm">
              <ListItemIcon>
                <PiggyBank className="text-blue-600" />
              </ListItemIcon>
              <ListItemText
                primary="Pension Optimization"
                secondary={suggestions.pensionOptimization.message}
                primaryTypographyProps={{ className: 'font-semibold' }}
                secondaryTypographyProps={{ className: 'text-gray-600' }}
              />
              <ListItemSecondaryAction>
                {appliedSuggestions.pension ? (
                  <span className="flex items-center text-green-600">
                    <Check size={16} className="mr-1" />
                    Applied
                  </span>
                ) : (
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => handleApply('pension', onApplyPensionOptimization)}
                  >
                    Apply
                  </Button>
                )}
              </ListItemSecondaryAction>
            </ListItem>
          )}

          {suggestions.isaOptimization && (
            <ListItem className="bg-white rounded-lg mb-2 shadow-sm">
              <ListItemIcon>
                <TrendingUp className="text-green-600" />
              </ListItemIcon>
              <ListItemText
                primary="ISA Investment Opportunity"
                secondary={suggestions.isaOptimization.message}
                primaryTypographyProps={{ className: 'font-semibold' }}
                secondaryTypographyProps={{ className: 'text-gray-600' }}
              />
              <ListItemSecondaryAction>
                {appliedSuggestions.isa ? (
                  <span className="flex items-center text-green-600">
                    <Check size={16} className="mr-1" />
                    Applied
                  </span>
                ) : (
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => handleApply('isa', onApplyIsaOptimization)}
                  >
                    Apply
                  </Button>
                )}
              </ListItemSecondaryAction>
            </ListItem>
          )}

          {suggestions.expenseOptimization && (
            <ListItem className="bg-white rounded-lg mb-2 shadow-sm">
              <ListItemIcon>
                <Wallet className="text-red-600" />
              </ListItemIcon>
              <ListItemText
                primary="Expense Optimization"
                secondary={suggestions.expenseOptimization.message}
                primaryTypographyProps={{ className: 'font-semibold' }}
                secondaryTypographyProps={{ className: 'text-gray-600' }}
              />
              <ListItemSecondaryAction>
                {appliedSuggestions.expense ? (
                  <span className="flex items-center text-green-600">
                    <Check size={16} className="mr-1" />
                    Applied
                  </span>
                ) : (
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => handleApply('expense', onApplyExpenseOptimization)}
                  >
                    Apply
                  </Button>
                )}
              </ListItemSecondaryAction>
            </ListItem>
          )}
        </List>
      </Collapse>
    </Paper>
  );
};