import type { NodeProps } from 'reactflow';
import { Handle, Position } from 'reactflow';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export default function MathNode({ data }: NodeProps) {
  const html = katex.renderToString(data.tex || '', {
    displayMode: true,
    throwOnError: false
  });

  const isPowerNode = data.label === '^';

  return (
    <div style={{
      padding: '12px 24px',
      background: isPowerNode ? '#eff6ff' : '#ffffff',
      borderRadius: '8px',
      boxShadow: isPowerNode
        ? '0 4px 12px rgba(59,130,246,0.12), 0 1px 3px rgba(59,130,246,0.08)'
        : '0 4px 12px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.02)',
      border: isPowerNode ? '1px solid #bfdbfe' : '1px solid rgba(0, 0, 0, 0.03)',
      color: '#222222',
      fontFamily: 'system-ui, sans-serif',
      minWidth: '80px',
      textAlign: 'center',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
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