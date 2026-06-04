import { create } from 'zustand';
import { parseExpressionToGraph } from '../engine/astParser';
import type { GraphData } from '../engine/astParser';

interface GraphState {
  expression: string;
  graphData: GraphData;
  setExpression: (newExpression: string) => void;
}

export const useGraphStore = create<GraphState>((set) => ({
  expression: '3x^2 + 2x', // Your Phase 1 Target Test Case
  graphData: parseExpressionToGraph('3x^2 + 2x'),
  setExpression: (newExpression) => set({
    expression: newExpression,
    graphData: parseExpressionToGraph(newExpression)
  }),
}));