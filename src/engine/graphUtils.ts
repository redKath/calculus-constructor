import type { GraphData } from './astParser';

export function getSubtree(nodeId: string, graphData: GraphData): GraphData {
  const included = new Set<string>();
  const queue = [nodeId];

  while (queue.length > 0) {
    const current = queue.shift()!;
    included.add(current);
    for (const edge of graphData.edges) {
      if (edge.source === current && !included.has(edge.target)) {
        queue.push(edge.target);
      }
    }
  }

  return {
    nodes: graphData.nodes.filter(n => included.has(n.id)),
    edges: graphData.edges.filter(e => included.has(e.source) && included.has(e.target)),
  };
}
