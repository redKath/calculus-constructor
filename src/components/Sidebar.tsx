import katex from 'katex';
import 'katex/dist/katex.min.css';
import * as math from 'mathjs';
import { useGraphStore } from '../store/useGraphStore';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

function toLatex(expr: string): string {
  try {
    return math.parse(expr).toTex({ parenthesis: 'auto' });
  } catch {
    return expr;
  }
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const expression = useGraphStore((state) => state.expression);

  const latexHtml = katex.renderToString(toLatex(expression), {
    throwOnError: false,
    displayMode: false,
  });

  return (
    <aside
      style={{
        width: collapsed ? '48px' : '320px',
        height: '100%',
        flexShrink: 0,
        background: '#ffffff',
        borderRight: '1px solid #e0e0e0',
        boxShadow: '2px 0 8px rgba(0, 0, 0, 0.03)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s ease',
        overflow: 'hidden',
      }}
    >
      {/* Header row: title + collapse toggle */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          padding: '12px',
          borderBottom: '1px solid #f0f0f0',
          minHeight: '48px',
          boxSizing: 'border-box',
        }}
      >
        {!collapsed && (
          <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#333' }}>
            Equations
          </span>
        )}
        <button
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = '#f0f0f0';
            (e.currentTarget as HTMLButtonElement).style.color = '#333';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            (e.currentTarget as HTMLButtonElement).style.color = '#666';
          }}
          style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: '1.1rem',
            lineHeight: 1,
            color: '#666',
            padding: '4px 8px',
            borderRadius: '4px',
            transition: 'background 0.15s ease, color 0.15s ease',
          }}
        >
          {collapsed ? '»' : '«'}
        </button>
      </div>

      {/* Expression cell */}
      {!collapsed && (
        <div style={{ padding: '12px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 12px',
              border: '1px solid #e0e0e0',
              borderRadius: '6px',
              background: '#fafafa',
            }}
          >
            <span style={{ color: '#aaa', fontSize: '0.85rem', userSelect: 'none', flexShrink: 0 }}>1</span>
            <div
              className="desmos-math-container"
              dangerouslySetInnerHTML={{ __html: latexHtml }}
              style={{ fontSize: '1.1rem', color: '#1a1a1a', lineHeight: 1.4 }}
            />
          </div>
        </div>
      )}
    </aside>
  );
}
