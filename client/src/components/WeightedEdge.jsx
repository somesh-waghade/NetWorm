import { getBezierPath, EdgeLabelRenderer, BaseEdge } from '@xyflow/react';
import { useState } from 'react';

export default function WeightedEdge({
  id, sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition,
  data = {},
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');

  const { weight = 1, status = 'idle', onWeightChange } = data;

  const [edgePath, labelX, labelY] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });

  const strokeColor =
    status === 'path'   ? '#3b82f6' :
    status === 'active' ? '#10b981' :
    '#cbd5e1';

  const labelColor = 
    status === 'path'   ? '#1e40af' :
    status === 'active' ? '#065f46' :
    '#64748b'; // Darker slate for text on light background

  const strokeWidth = status === 'path' ? 3 : status === 'active' ? 2 : 1.5;

  return (
    <>
      <BaseEdge
        path={edgePath}
        style={{
          stroke: strokeColor,
          strokeWidth,
          filter: status !== 'idle' ? `drop-shadow(0 0 6px ${strokeColor})` : 'none',
          transition: 'stroke 0.3s ease, stroke-width 0.3s ease',
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
            zIndex: 10,
          }}
          className="nodrag nopan"
        >
          {editing ? (
            <input
              autoFocus
              type="number"
              min={1}
              defaultValue={weight}
              style={{
                width: 48, textAlign: 'center', borderRadius: 6,
                background: '#0f172a', color: '#f1f5f9',
                border: '1px solid #6ee7b7', fontSize: 13, padding: '2px 4px',
                boxShadow: '0 0 10px #6ee7b744',
              }}
              onBlur={(e) => {
                setEditing(false);
                const v = parseInt(e.target.value, 10);
                if (!isNaN(v) && v > 0 && onWeightChange) onWeightChange(id, v);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') e.target.blur();
                if (e.key === 'Escape') setEditing(false);
              }}
            />
          ) : (
            <button
              onClick={() => { setDraft(String(weight)); setEditing(true); }}
              style={{
                background: '#ffffff',
                border: `1px solid ${status === 'idle' ? '#e2e8f0' : labelColor}`,
                color: labelColor,
                borderRadius: 6,
                padding: '2px 10px',
                fontSize: 13,
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: status !== 'idle' ? `0 0 12px ${labelColor}44` : '0 2px 4px rgba(0,0,0,0.05)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.borderColor = '#6ee7b7';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.borderColor = status === 'idle' ? '#475569' : labelColor;
              }}
              title="Click to edit weight"
            >
              {weight}
            </button>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
