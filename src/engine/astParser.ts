import * as math from 'mathjs';
import type { Node, Edge } from 'reactflow';

export interface GraphData {
	nodes: Node[];
	edges: Edge[];
}

export interface ParseResult extends GraphData {
	nodeIdToAstNode: Map<string, math.MathNode>;
	rootAst: math.MathNode;
}

function buildGraph(rootMathNode: math.MathNode): ParseResult {
	const nodes: Node[] = [];
	const edges: Edge[] = [];
	const nodeIdToAstNode = new Map<string, math.MathNode>();
	let idCounter = 0;

	function traverse(
		mathNode: math.MathNode,
		parentId: string | null = null,
		depth = 0,
		horizontalOffset = 0
	): string {
		const currentId = `node-${idCounter++}`;
		nodeIdToAstNode.set(currentId, mathNode);

		let label = '';
		let tex = '';

		if (mathNode.type === 'OperatorNode') {
			const opNode = mathNode as math.OperatorNode;
			label = opNode.op;
			tex = opNode.op;
		} else if (mathNode.type === 'ConstantNode') {
			const constNode = mathNode as math.ConstantNode;
			label = String(constNode.value);
			tex = String(constNode.value);
		} else if (mathNode.type === 'SymbolNode') {
			const symNode = mathNode as math.SymbolNode;
			label = symNode.name;
			tex = symNode.name;
		} else {
			label = mathNode.type;
			tex = mathNode.toTex();
		}

		const position = {
			x: horizontalOffset * 180,
			y: depth * 120
		};

		nodes.push({
			id: currentId,
			type: 'mathNode',
			position,
			data: { label, tex }
		});

		if (parentId) {
			edges.push({
				id: `edge-${parentId}-${currentId}`,
				source: parentId,
				target: currentId,
				type: 'smoothstep'
			});
		}

		if ('args' in mathNode && Array.isArray(mathNode.args)) {
			mathNode.args.forEach((childArg, index) => {
				const spreadFactor = index === 0 ? -1 : 1;
				const nextOffset = horizontalOffset + (spreadFactor * (1 / (depth + 1)));
				traverse(childArg, currentId, depth + 1, nextOffset);
			});
		}

		return currentId;
	}

	traverse(rootMathNode, null, 0, 0);

	return { nodes, edges, nodeIdToAstNode, rootAst: rootMathNode };
}

export function parseExpressionToGraph(expression: string): ParseResult {
	try {
		const rootMathNode = math.parse(expression);
		return buildGraph(rootMathNode);
	} catch (error) {
		console.error("Failed to parse expression math string:", error);
		return { nodes: [], edges: [], nodeIdToAstNode: new Map(), rootAst: math.parse('0') };
	}
}

export function renderASTToGraph(ast: math.MathNode): ParseResult {
	return buildGraph(ast);
}