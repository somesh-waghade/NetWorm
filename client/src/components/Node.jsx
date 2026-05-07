import { Handle, Position } from '@xyflow/react';

const statusColors = {
  idle:    { border: '#cbd5e1', bg: '#ffffff', glow: '0 2px 4px rgba(0,0,0,0.05)',  text: '#64748b' },
  active:  { border: '#10b981', bg: '#ecfdf5', glow: '0 0 12px rgba(16,185,129,0.3)', text: '#065f46' },
  path:    { border: '#3b82f6', bg: '#eff6ff', glow: '0 0 16px rgba(59,130,246,0.3)', text: '#1e40af' },
  source:  { border: '#f59e0b', bg: '#fffbeb', glow: '0 0 16px rgba(245,158,11,0.3)',  text: '#92400e' },
  dest:    { border: '#8b5cf6', bg: '#f5f3ff', glow: '0 0 16px rgba(139,92,246,0.3)',  text: '#5b21b6' },
};

export default function Node({ data, selected }) {
  const { label, status = 'idle' } = data;
  const colors = statusColors[status] || statusColors.idle;

  return (
    <div
      style={{
        background: colors.bg,
        border: `2px solid ${colors.border}`,
        boxShadow: selected ? `0 0 0 2px #fff4, ${colors.glow}` : colors.glow,
        borderRadius: 12,
        padding: '10px 16px',
        minWidth: 80,
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        position: 'relative',
        userSelect: 'none',
      }}
    >
      <Handle type="target" position={Position.Top}    style={{ background: colors.border, border: 'none', width: 8, height: 8 }} />
      <Handle type="source" position={Position.Bottom} style={{ background: colors.border, border: 'none', width: 8, height: 8 }} />
      <Handle type="target" position={Position.Left}   style={{ background: colors.border, border: 'none', width: 8, height: 8 }} />
      <Handle type="source" position={Position.Right}  style={{ background: colors.border, border: 'none', width: 8, height: 8 }} />

      {/* Node icon */}
      <div style={{ fontSize: 20, marginBottom: 2 }}>
        {status === 'source' ? '🟢' : status === 'dest' ? '🔴' : '🔘'}
      </div>
      <div style={{ color: colors.text, fontWeight: 800, fontSize: 13, letterSpacing: 1 }}>
        {label}
      </div>
    </div>
  );
}
