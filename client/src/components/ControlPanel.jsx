import { ALGORITHM_INFO } from '../utils/graphHelpers';

const ALGOS = Object.entries(ALGORITHM_INFO);

export default function ControlPanel({
  nodes,
  algorithm, setAlgorithm,
  source, setSource,
  target, setTarget,
  simMode, setSimMode,
  speed, setSpeed,
  status,
  currentStep, totalSteps,
  onStartSim,
  onNextStep,
  onReset,
  connected,
  onAddNode,
  onDeleteSelected,
}) {
  const isRunning  = status === 'stepping';
  const isDone     = status === 'done';
  const isError    = status === 'error';
  const canStart   = status === 'idle' && source && target && source !== target;
  const canNext    = isRunning && simMode === 'manual';

  const nodeOptions = nodes.map(n => (
    <option key={n.id} value={n.id}>{n.data?.label || n.id}</option>
  ));

  return (
    <aside style={{
      width: 270,
      background: '#ffffff',
      borderRight: '1px solid #e2e8f0',
      padding: '20px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      overflowY: 'auto',
      flexShrink: 0,
    }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 22 }}>📊</span>
          <h1 style={{ color: '#6366f1', fontSize: 20, fontWeight: 900, letterSpacing: 1 }}>NetWorm</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: connected ? '#10b981' : '#ef4444', boxShadow: connected ? '0 0 6px rgba(16,185,129,0.2)' : 'none' }} />
          <span style={{ color: '#64748b', fontSize: 11 }}>{connected ? 'Sync Connected' : 'Disconnected'}</span>
        </div>
      </div>

      <Divider label="GRAPH STRUCTURE" />

      {/* Add / Delete node */}
      <div style={{ display: 'flex', gap: 8 }}>
        <PanelBtn onClick={onAddNode} color="#6366f1" flex>＋ Node</PanelBtn>
        <PanelBtn onClick={onDeleteSelected} color="#f87171" flex>✕ Remove</PanelBtn>
      </div>

      <Divider label="ALGORITHM" />

      {/* Algorithm selector */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {ALGOS.map(([key, info]) => (
          <button
            key={key}
            onClick={() => setAlgorithm(key)}
            style={{
              background: algorithm === key ? `${info.color}11` : '#f8fafc',
              border: `1px solid ${algorithm === key ? info.color : '#e2e8f0'}`,
              borderRadius: 8,
              padding: '8px 12px',
              color: algorithm === key ? info.color : '#64748b',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              transition: 'all 0.2s',
              boxShadow: algorithm === key ? `0 2px 8px ${info.color}22` : 'none',
            }}
          >
            <span>{info.label}</span>
            <span style={{ fontSize: 10, opacity: 0.7 }}>{info.description}</span>
          </button>
        ))}
      </div>

      <Divider label="SEARCH PATH" />

      {/* Source / Destination */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <label style={labelStyle}>
          <span style={{ color: '#fbbf24' }}>🟢 Start Node</span>
          <Select value={source} onChange={e => setSource(e.target.value)}>
            <option value="">— pick —</option>
            {nodeOptions}
          </Select>
        </label>
        <label style={labelStyle}>
          <span style={{ color: '#a855f7' }}>🔴 End Node</span>
          <Select value={target} onChange={e => setTarget(e.target.value)}>
            <option value="">— pick —</option>
            {nodeOptions}
          </Select>
        </label>
      </div>

      <Divider label="VISUALIZATION" />

      {/* Mode toggle */}
      <div style={{ display: 'flex', gap: 0, borderRadius: 8, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
        {['auto', 'manual'].map(m => (
          <button
            key={m}
            onClick={() => setSimMode(m)}
            style={{
              flex: 1,
              padding: '7px 0',
              background: simMode === m ? '#6366f111' : '#f8fafc',
              color:  simMode === m ? '#6366f1' : '#64748b',
              border: 'none',
              fontWeight: 700,
              fontSize: 12,
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >{m}</button>
        ))}
      </div>

      {/* Speed slider (auto only) */}
      {simMode === 'auto' && (
        <label style={labelStyle}>
          <span>Step Delay: {speed}ms</span>
          <input
            type="range" min={100} max={2000} step={100}
            value={speed}
            onChange={e => setSpeed(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#6366f1' }}
          />
        </label>
      )}

      {/* Simulation controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <PanelBtn
          onClick={onStartSim}
          disabled={!canStart && !isDone && !isError}
          color="#6366f1"
          full
          glow
        >
          {isRunning ? '▶ Visualizing…' : '▶ Start Visualization'}
        </PanelBtn>

        {canNext && (
          <PanelBtn onClick={onNextStep} color="#93c5fd" full>
            ⏭ Next Step ({currentStep + 1}/{totalSteps})
          </PanelBtn>
        )}

        {(isRunning || isDone || isError) && (
          <PanelBtn onClick={onReset} color="#f87171" full>↺ Clear Search</PanelBtn>
        )}
      </div>

      {/* Step counter */}
      {totalSteps > 0 && (
        <div style={{ color: '#64748b', fontSize: 11, textAlign: 'center' }}>
          Step {Math.max(0, currentStep + 1)} / {totalSteps}
        </div>
      )}
    </aside>
  );
}

/* ── Tiny helpers ─────────────────────────────────────────── */
const labelStyle = { display: 'flex', flexDirection: 'column', gap: 4, color: '#475569', fontSize: 12, fontWeight: 700 };

function Divider({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
      <span style={{ color: '#64748b', fontSize: 10, fontWeight: 800, letterSpacing: 2 }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
    </div>
  );
}

function Select({ value, onChange, children }) {
  return (
    <select
      value={value}
      onChange={onChange}
      style={{
        background: '#f8fafc',
        color: '#1e293b',
        border: '1px solid #e2e8f0',
        borderRadius: 6,
        padding: '6px 8px',
        fontSize: 13,
        fontWeight: 700,
        outline: 'none',
        cursor: 'pointer',
      }}
    >{children}</select>
  );
}

function PanelBtn({ onClick, disabled, color, children, full, flex, glow }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: full ? '100%' : flex ? undefined : 'auto',
        flex: flex ? 1 : undefined,
        background: disabled ? '#f1f5f9' : `${color}11`,
        border: `1px solid ${disabled ? '#e2e8f0' : color}`,
        borderRadius: 8,
        padding: '9px 12px',
        color: disabled ? '#94a3b8' : color,
        fontWeight: 700,
        fontSize: 13,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
        boxShadow: glow && !disabled ? `0 4px 12px ${color}33` : 'none',
      }}
    >{children}</button>
  );
}
