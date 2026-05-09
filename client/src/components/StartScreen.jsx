import { PRESET_TOPOLOGIES } from '../utils/graphHelpers';

export default function StartScreen({ onBlankCanvas, onPreset }) {
  const presets = Object.entries(PRESET_TOPOLOGIES);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'radial-gradient(ellipse at 50% 40%, #f1f5f9 0%, #e2e8f0 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 40,
    }}>
      {/* Animated title */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 8 }}>📊</div>
        <h1 style={{
          fontSize: 52, fontWeight: 900, letterSpacing: 3,
          background: 'linear-gradient(135deg, #4f46e5, #6366f1, #8b5cf6)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: 8,
        }}>NetWorm</h1>
        <p style={{ color: '#64748b', fontSize: 16, letterSpacing: 2 }}>
          Graph Pathfinding Visualization
        </p>
      </div>

      {/* Option cards */}
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 860 }}>
        {/* Blank canvas */}
        <Card
          icon="✏️"
          title="Empty Graph"
          subtitle="Build your own graph from scratch"
          color="#6366f1"
          onClick={onBlankCanvas}
        />

        {/* Presets */}
        {presets.map(([key, topo]) => (
          <Card
            key={key}
            icon={topoIcon(key)}
            title={topo.label}
            subtitle={`${topo.nodes.length} nodes · ${topo.edges.length} edges`}
            color={topoColor(key)}
            onClick={() => onPreset(key)}
          />
        ))}
      </div>

      <p style={{ color: '#94a3b8', fontSize: 12 }}>Click a graph to begin</p>
    </div>
  );
}

function Card({ icon, title, subtitle, color, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: '#ffffff',
        border: `1px solid #e2e8f0`,
        borderRadius: 16,
        padding: '28px 32px',
        minWidth: 160,
        cursor: 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
        transition: 'all 0.25s ease',
        color,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = `${color}08`;
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.boxShadow = `0 10px 15px -3px ${color}33`;
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = '#ffffff';
        e.currentTarget.style.borderColor = '#e2e8f0';
        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
        e.currentTarget.style.transform = 'none';
      }}
    >
      <span style={{ fontSize: 32 }}>{icon}</span>
      <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: 1, color: '#1e293b' }}>{title}</span>
      <span style={{ color: '#64748b', fontSize: 12 }}>{subtitle}</span>
    </button>
  );
}

const topoIcon  = k => ({ ring: '🔄', star: '⭐', mesh: '🌐', internet: '🗺️' }[k] || '📍');
const topoColor = k => ({ ring: '#10b981', star: '#f59e0b', mesh: '#3b82f6', internet: '#8b5cf6' }[k] || '#6366f1');
