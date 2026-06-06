import { useState, useCallback, useEffect } from 'react';
import ReactFlow, { Background, BackgroundVariant, Controls, useReactFlow } from 'reactflow';
import type { Node } from 'reactflow';
import 'reactflow/dist/style.css';
import { useGraphStore } from './store/useGraphStore';
import MathNode from './components/MathNode';
import Sidebar from './components/Sidebar';
import { getSubtree } from './engine/graphUtils';

const nodeTypes = {
  mathNode: MathNode
};

function FitViewOnChange({ dep }: { dep: string | null }) {
  const { fitView } = useReactFlow();
  useEffect(() => {
    const id = setTimeout(() => fitView({ duration: 300 }), 50);
    return () => clearTimeout(id);
  }, [dep, fitView]);
  return null;
}

export default function App() {
  const { graphData, focusedNodeId, setFocusedNodeId } = useGraphStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const displayGraphData = focusedNodeId
    ? getSubtree(focusedNodeId, graphData)
    : graphData;

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      const hasChildren = graphData.edges.some(e => e.source === node.id);
      if (hasChildren) setFocusedNodeId(node.id);
    },
    [graphData.edges, setFocusedNodeId]
  );

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
      />

      <div style={{ flex: 1, height: '100%', backgroundColor: '#fafafa', position: 'relative' }}>

          {focusedNodeId !== null && (
            <button
              onClick={() => setFocusedNodeId(null)}
              style={{
                position: 'absolute', top: 12, left: 12, zIndex: 10,
                padding: '6px 14px', borderRadius: '6px',
                border: '1px solid #e0e0e0', background: '#ffffff',
                fontSize: '0.875rem', cursor: 'pointer',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              }}
            >
              ← Go Back
            </button>
          )}

          <ReactFlow
            nodes={displayGraphData.nodes}
            edges={displayGraphData.edges}
            nodeTypes={nodeTypes}
            onNodeClick={handleNodeClick}
            nodesDraggable={false}
            fitView
            defaultEdgeOptions={{
              type: 'smoothstep',
              style: { stroke: '#333', strokeWidth: 2 },
            }}
          >
            <FitViewOnChange dep={focusedNodeId} />
            <Background
              variant={BackgroundVariant.Lines}
              color="#eee"
              gap={25}
              size={1}
            />
            <Controls showInteractive={false} style={{ boxShadow: 'none', border: '1px solid #e0e0e0' }} />
          </ReactFlow>
      </div>
    </div>
  );
}
