import { ALGORITHM_INFO } from '../utils/graphHelpers';

export default function AlgoLog({ steps, currentStep, algorithm, status, errorMsg, stats }) {
  const algoInfo = ALGORITHM_INFO[algorithm] || {};
  const visibleSteps = steps.slice(0, currentStep + 1);

  const typeIcon = {
    visit:  '👁',
    relax:  '⚡',
    update: '✅',
    path:   '🛣',
  };

  return (
    <div style={{
      width: 300,
      background: '#ffffff',
      borderLeft: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid #e2e8f0',
        background: '#f8fafc',
      }}>
        <div style={{ color: algoInfo.color || '#6366f1', fontWeight: 900, fontSize: 15, letterSpacing: 1 }}>
          {algoInfo.label || 'Algorithm'} Trace
        </div>
        <div style={{ color: '#64748b', fontSize: 11, marginTop: 2 }}>{algoInfo.description}</div>
      </div>

      {/* Stats bar */}
      {stats && (
        <div style={{
          padding: '10px 16px',
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          gap: 16,
        }}>
          <Stat label="COST"  value={typeof stats.totalCost === 'number' ? stats.totalCost.toFixed(2) : '—'} color="#10b981" />
          <Stat label="NODES" value={stats.hops ?? '—'} color="#3b82f6" />
          <Stat label="STEPS" value={steps.length}      color="#f59e0b" />
        </div>
      )}

      {/* Error */}
      {status === 'error' && (
        <div style={{ padding: '10px 16px', background: '#fef2f2', color: '#dc2626', fontSize: 12, borderBottom: '1px solid #fca5a5' }}>
          ⚠ {errorMsg || 'No path found.'}
        </div>
      )}

      {/* Step log */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {visibleSteps.length === 0 && (
          <div style={{ color: '#94a3b8', textAlign: 'center', marginTop: 40, fontSize: 13 }}>
            Start a visualization to see the algorithm trace…
          </div>
        )}
        {[...visibleSteps].reverse().map((step, revIdx) => {
          const idx = visibleSteps.length - 1 - revIdx;
          const isLatest = idx === currentStep;
          return (
            <div
              key={idx}
              style={{
                padding: '7px 16px',
                borderBottom: '1px solid #f1f5f9',
                opacity: isLatest ? 1 : 0.6,
                background: isLatest ? '#f1f5f9' : 'transparent',
                transition: 'opacity 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 12 }}>{typeIcon[step.type] || '•'}</span>
                <span style={{
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: 1,
                  color: step.type === 'path' ? '#2563eb' : step.type === 'visit' ? '#059669' : step.type === 'relax' ? '#d97706' : '#64748b',
                }}>
                  {step.type?.toUpperCase()}
                </span>
                <span style={{ marginLeft: 'auto', color: '#94a3b8', fontSize: 10 }}>#{idx + 1}</span>
              </div>
              <div style={{ color: '#475569', fontSize: 11, fontWeight: 600, marginTop: 3, lineHeight: 1.4 }}>
                {step.description}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer: done / idle */}
      {status === 'done' && (
        <div style={{
          padding: '12px 16px',
          background: '#ecfdf5',
          borderTop: '1px solid #10b98144',
          color: '#059669',
          fontWeight: 800,
          fontSize: 13,
          textAlign: 'center',
        }}>
          ✓ Path found
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
      <span style={{ color, fontSize: 15, fontWeight: 900 }}>{value}</span>
      <span style={{ color: '#475569', fontSize: 9, fontWeight: 700, letterSpacing: 1, marginTop: 2 }}>{label}</span>
    </div>
  );
}
