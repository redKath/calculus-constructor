import * as math from 'mathjs';
import type { Node, Edge } from 'reactflow';

export interface GraphData {
	nodes: Node[];
	edges: Edge[];
}

/**
* Translates a math string into React Flow nodes and edges via math.js
*/
export function parseExpressionToGraph(expression: string): GraphData {

	const nodes: Node[] = [];
	const edges: Edge[] = [];

	try {
		const rootMathNode = math.parse(expression);
		let idCounter = 0;

		// This internal helper function will walk the tree recursively
		function traverse(
			mathNode: math.MathNode, 
			parentId: string | null = null, 
			depth = 0, 
			horizontalOffset = 0
		): string {
			const currentId = `node-${idCounter++}`;

			// Determine what to display inside the node based on math.js node type
			let label = '';
			let tex = '';

			if (mathNode.type === 'OperatorNode') {
				const opNode = mathNode as math.OperatorNode;
				label = opNode.op;
				tex = opNode.op; // e.g. "+", "*", "^"
			} else if (mathNode.type === 'ConstantNode') {
				const constNode = mathNode as math.ConstantNode;
				label = String(constNode.value);
				tex = String(constNode.value);
			} else if (mathNode.type === 'SymbolNode') {
				const symNode = mathNode as math.SymbolNode;
				label = symNode.name;
				tex = symNode.name; // e.g. "x"
			} else {
				label = mathNode.type;
				tex = mathNode.toTex();
			}

			// Calculate a basic visual position layout (Y goes down with depth)
			// We will multiply depth and offset to separate nodes cleanly
			const position = {
				x: horizontalOffset * 180,
				y: depth * 120
			};

			// Push the formatted React Flow Node object into our collection
			nodes.push({
				id: currentId,
				type: 'mathNode', // This maps to your custom MathNode component
				position,
				data: { label, tex }
			});

			// If this node has a parent, create a directional line (Edge) connecting them
			if (parentId) {
				edges.push({
					id: `edge-${parentId}-${currentId}`,
					source: parentId,
					target: currentId,
					type: 'smoothstep'
				});
			}

			// RECURSION STEP: If this node has children (args), traverse them
			if ('args' in mathNode && Array.isArray(mathNode.args)) {
				mathNode.args.forEach((childArg, index) => {
					// Spread children out horizontally based on their index
					// e.g., index 0 goes left (-0.5), index 1 goes right (+0.5)
					const spreadFactor = index === 0 ? -1 : 1;
					const nextOffset = horizontalOffset + (spreadFactor * (1 / (depth + 1)));

					traverse(childArg, currentId, depth + 1, nextOffset);
				});
			}

			return currentId;
		}

		// Start the recursive machine from the root element
		traverse(rootMathNode, null, 0, 0);

	} catch (error) {
		console.error("Failed to parse expression math string:", error);
	}

	return { nodes, edges };
}