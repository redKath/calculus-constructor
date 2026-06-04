import ReactFlow, { Background, BackgroundVariant, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import { useGraphStore } from './store/useGraphStore';
import MathNode from './components/MathNode';

const nodeTypes = {
  mathNode: MathNode
};

export default function App() {
  const { graphData } = useGraphStore();

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#fafafa' }}>
      <ReactFlow 
        nodes={graphData.nodes} 
        edges={graphData.edges}
        nodeTypes={nodeTypes}
        fitView
        // Desmos uses smooth panning without rigid constraint styling
        defaultEdgeOptions={{
          type: 'smoothstep', // Clean, sharp right-angle or curved breaks
          style: { stroke: '#333', strokeWidth: 2 },
        }}
      >
        {/* Desmos uses a fine grid pattern instead of dots */}
        <Background 
          variant={BackgroundVariant.Lines} 
          color="#eee" 
          gap={25} 
          size={1} 
        />
        <Controls showInteractive={false} style={{ boxShadow: 'none', border: '1px solid #e0e0e0' }} />
      </ReactFlow>
    </div>
  );
}