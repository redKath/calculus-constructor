import { create } from 'zustand';
import * as math from 'mathjs';
import { parseExpressionToGraph, renderASTToGraph } from '../engine/astParser';
import type { GraphData } from '../engine/astParser';

interface GraphState {
  expression: string;
  graphData: GraphData;
  focusedNodeId: string | null;
  mathAST: math.MathNode | null;
  nodeIdToAstNode: Map<string, math.MathNode>;
  setExpression: (newExpression: string) => void;
  setFocusedNodeId: (id: string | null) => void;
  applyPowerRule: () => void;
}

const initial = parseExpressionToGraph('3x^2 + 2x');

export const useGraphStore = create<GraphState>((set, get) => ({
  expression: '3x^2 + 2x',
  graphData: { nodes: initial.nodes, edges: initial.edges },
  focusedNodeId: null,
  mathAST: initial.rootAst,
  nodeIdToAstNode: initial.nodeIdToAstNode,

  setExpression: (newExpression) => {
    const result = parseExpressionToGraph(newExpression);
    set({
      expression: newExpression,
      graphData: { nodes: result.nodes, edges: result.edges },
      focusedNodeId: null,
      mathAST: result.rootAst,
      nodeIdToAstNode: result.nodeIdToAstNode,
    });
  },

  setFocusedNodeId: (id) => set({ focusedNodeId: id }),

  applyPowerRule: () => {
    const { focusedNodeId, mathAST, nodeIdToAstNode } = get();
    if (!focusedNodeId || !mathAST) return;

    const target = nodeIdToAstNode.get(focusedNodeId);
    if (!target || target.type !== 'OperatorNode') return;
    const opNode = target as math.OperatorNode;
    if (opNode.op !== '^') return;

    const base = opNode.args[0];
    const exp = opNode.args[1];
    if (exp.type !== 'ConstantNode') return;

    const baseStr = base.toString();
    const expStr = exp.toString();
    const newSubtree = math.parse(`(${expStr}) * (${baseStr}) ^ ((${expStr}) - 1)`);

    const newAST = mathAST.transform((n) => n === target ? newSubtree : n);

    const result = renderASTToGraph(newAST);
    set({
      expression: newAST.toString(),
      graphData: { nodes: result.nodes, edges: result.edges },
      mathAST: newAST,
      nodeIdToAstNode: result.nodeIdToAstNode,
      focusedNodeId: null,
    });
  },
}));