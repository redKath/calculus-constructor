import { useEffect, useRef } from 'react';
import * as math from 'mathjs';
import { MathfieldElement } from 'mathlive';
import { useGraphStore } from '../store/useGraphStore';

// Load MathLive glyph fonts + sounds from CDN (avoids Vite asset-path 404s)
MathfieldElement.fontsDirectory = 'https://cdn.jsdelivr.net/npm/mathlive/fonts';
MathfieldElement.soundsDirectory = null;

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

// math.js expression string -> LaTeX (for seeding the math field)
function toLatex(expr: string): string {
  try {
    return math.parse(expr).toTex({ parenthesis: 'auto' });
  } catch {
    return expr;
  }
}

// MathQuill LaTeX -> math.js-parseable expression string
function latexToMathjs(latex: string): string {
  let s = latex;
  s = s.replace(/\\left/g, '').replace(/\\right/g, '');
  s = s.replace(/\\cdot/g, '*').replace(/\\times/g, '*').replace(/\\div/g, '/');

  // Resolve braces innermost-first: ^{} and \sqrt{} clear inner braces so the
  // enclosing \frac{}{} can match on the next pass. Loop until stable.
  let prev: string;
  do {
    prev = s;
    s = s.replace(/\^\{([^{}]*)\}/g, '^($1)');          // ^{...} -> ^(...)
    s = s.replace(/\\sqrt\{([^{}]*)\}/g, 'sqrt($1)');   // \sqrt{a} -> sqrt(a)
    s = s.replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, '(($1)/($2))'); // \frac{a}{b} -> ((a)/(b))
  } while (s !== prev);

  // remaining \word -> word (\sin -> sin, \pi -> pi)
  s = s.replace(/\\([a-zA-Z]+)/g, '$1');
  // leftover braces -> parens
  s = s.replace(/\{/g, '(').replace(/\}/g, ')');
  // strip spacing macros / stray backslashes
  s = s.replace(/\\,|\\ |\\!/g, ' ').replace(/\\/g, '');
  return s.trim();
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const expression = useGraphStore((state) => state.expression);
  const setExpression = useGraphStore((state) => state.setExpression);

  const hostRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<MathfieldElement | null>(null);
  const skipSync = useRef(false); // true when expression change came from our own typing

  // Create the MathLive field once and wire live input -> graph
  useEffect(() => {
    const mf = new MathfieldElement();
    mf.value = toLatex(useGraphStore.getState().expression);
    mf.style.cssText = 'flex:1;min-width:0;border:none;font-size:1.1rem;';
    mf.addEventListener('input', () => {
      skipSync.current = true;
      setExpression(latexToMathjs(mf.value)); // invalid/empty -> empty graph (shows nothing)
    });
    hostRef.current?.appendChild(mf);
    fieldRef.current = mf;
    return () => {
      mf.remove();
      fieldRef.current = null;
    };
  }, [setExpression]);

  // Sync field from external expression changes (e.g. Power Rule rewrite), not our own edits
  useEffect(() => {
    if (skipSync.current) {
      skipSync.current = false;
      return;
    }
    if (fieldRef.current) fieldRef.current.value = toLatex(expression);
  }, [expression]);

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

      {/* Editable LaTeX equation cell */}
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
              background: '#ffffff',
            }}
          >
            <span style={{ color: '#aaa', fontSize: '0.85rem', userSelect: 'none', flexShrink: 0 }}>1</span>
            <div ref={hostRef} style={{ flex: 1, minWidth: 0, display: 'flex' }} />
          </div>
        </div>
      )}
    </aside>
  );
}
