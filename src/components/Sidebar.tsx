import { useGraphStore } from '../store/useGraphStore';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const expression = useGraphStore((state) => state.expression);

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
          style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: '1.1rem',
            lineHeight: 1,
            color: '#666',
            padding: '4px 8px',
            borderRadius: '4px',
          }}
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      {/* Expression cell (Desmos-style row) */}
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
            <span style={{ color: '#aaa', fontSize: '0.85rem', userSelect: 'none' }}>1</span>
            <input
              value={expression}
              disabled
              readOnly
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                fontFamily: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
                fontSize: '1rem',
                color: '#333',
                outline: 'none',
                cursor: 'not-allowed',
              }}
            />
          </div>
        </div>
      )}
    </aside>
  );
}
