import type { NodeProps } from 'reactflow';
import { Handle, Position } from 'reactflow';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export default function MathNode({ data }: NodeProps) {
  // Render LaTeX cleanly
  const html = katex.renderToString(data.tex || '', {
    displayMode: true, // Centers math and scales it beautifully like a textbook
    throwOnError: false
  });

  return (
    <div style={{ 
      padding: '12px 24px', 
      background: '#ffffff', 
      borderRadius: '8px',
      // High-end subtle drop shadow instead of harsh borders
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.02)',
      border: '1px solid rgba(0, 0, 0, 0.03)',
      color: '#222222',
      fontFamily: 'system-ui, sans-serif',
      minWidth: '80px',
      textAlign: 'center',
      transition: 'all 0.2s ease'
    }}>
      {/* Hide the default ugly React Flow circle handles by making them tiny/invisible */}
      <Handle 
        type="target" 
        position={Position.Top} 
        style={{ background: '#333', width: '6px', height: '6px', border: 'none' }} 
      />
      
      {/* Math Content Area */}
      <div 
        className="desmos-math-container"
        style={{ fontSize: '1.2rem', padding: '4px 0' }}
        dangerouslySetInnerHTML={{ __html: html }} 
      />
      
      <Handle 
        type="source" 
        position={Position.Bottom} 
        style={{ background: '#333', width: '6px', height: '6px', border: 'none' }} 
      />
    </div>
  );
}