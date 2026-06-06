import { create } from 'zustand';
import { parseExpressionToGraph } from '../engine/astParser';
import type { GraphData } from '../engine/astParser';

interface GraphState {
  expression: string;
  graphData: GraphData;
  focusedNodeId: string | null;
  setExpression: (newExpression: string) => void;
  setFocusedNodeId: (id: string | null) => void;
}

export const useGraphStore = create<GraphState>((set) => ({
  expression: '3x^2 + 2x', // Your Phase 1 Target Test Case
  graphData: parseExpressionToGraph('3x^2 + 2x'),
  focusedNodeId: null,
  setExpression: (newExpression) => set({
    expression: newExpression,
    graphData: parseExpressionToGraph(newExpression),
    focusedNodeId: null,
  }),
  setFocusedNodeId: (id) => set({ focusedNodeId: id }),
}));