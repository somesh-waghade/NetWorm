import { useState, useCallback, useEffect, useRef } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import NetworkCanvas from './components/NetworkCanvas';
import ControlPanel from './components/ControlPanel';
import AlgoLog from './components/AlgoLog';
import StartScreen from './components/StartScreen';
import { useSocket } from './hooks/useSocket';
import { useSimulation } from './hooks/useSimulation';
import { genNodeId, PRESET_TOPOLOGIES } from './utils/graphHelpers';

const toFlowNode = (n) => ({
  id: n.id,
  type: 'node',
  position: { x: n.x ?? 200, y: n.y ?? 200 },
  data: { label: n.label ?? n.id, failed: n.failed ?? false },
});

const toFlowEdge = (e) => ({
  id: e.id,
  source: e.source,
  target: e.target,
  type: 'weighted',
  data: { weight: e.weight ?? 1 },
});

export default function App() {
  const [showStart, setShowStart] = useState(true);
  const [flowNodes, setFlowNodes]   = useState([]);
  const [flowEdges, setFlowEdges]   = useState([]);

  // These hold the live React Flow node/edge arrays (updated by canvas)
  const [panelNodes, setPanelNodes] = useState([]);

  const [algorithm, setAlgorithm] = useState('dijkstra');
  const [source, setSource]       = useState('');
  const [target, setTarget]       = useState('');
  const [simMode, setSimMode]     = useState('auto');

  const { emit, on, off, connected } = useSocket();
  const sim = useSimulation();

  const packetIdRef  = useRef(0);
  const autoTimerRef = useRef(null);
  const stepsRef     = useRef([]);   // keep steps accessible inside interval

  // ─── Socket listeners ──────────────────────────────────────────────────────
  useEffect(() => {
    const handleResult = (result) => {
      stepsRef.current = result.steps;
      sim.loadResult(result);
    };
    const handleRerouted = (result) => {
      stepsRef.current = result.steps;
      sim.reset();
      sim.loadResult(result);
    };
    const handleError = ({ error }) => sim.setError(error);

    on('sim:result',  handleResult);
    on('sim:rerouted', handleRerouted);
    on('sim:error',   handleError);
    return () => { off('sim:result'); off('sim:rerouted'); off('sim:error'); };
  }, []);

  // ─── Auto-play: kicks off whenever status transitions to 'stepping' in auto mode ──
  useEffect(() => {
    if (sim.status !== 'stepping' || simMode !== 'auto') return;
    clearInterval(autoTimerRef.current);
    sim.startAuto();
    return () => sim.stopAuto();
  }, [sim.status, simMode]);

  // ─── Topology helpers ─────────────────────────────────────────────────────
  const loadTopology = useCallback((nodes, edges) => {
    setFlowNodes(nodes.map(toFlowNode));
    setFlowEdges(edges.map(toFlowEdge));
    setPanelNodes(nodes.map(toFlowNode));
    setSource('');
    setTarget('');
    emit('graph:sync', { nodes, edges });
  }, [emit]);

  const handlePreset      = (key) => { loadTopology(PRESET_TOPOLOGIES[key].nodes, PRESET_TOPOLOGIES[key].edges); setShowStart(false); };
  const handleBlankCanvas = ()    => { loadTopology([], []); setShowStart(false); };

  // ─── Topology mutations ───────────────────────────────────────────────────
  const handleAddNode = () => {
    const id = genNodeId();
    const node = { id, label: id, x: 300 + Math.random() * 200, y: 200 + Math.random() * 200 };
    const fn = toFlowNode(node);
    setFlowNodes(prev => [...prev, fn]);
    setPanelNodes(prev => [...prev, fn]);
    emit('node:add', node);
  };

  const handleDeleteSelected = useCallback(() => {
    let hasDeleted = false;
    let deletedSourceOrTarget = false;

    setFlowNodes(prev => {
      const toRemove = new Set(prev.filter(n => n.selected).map(n => n.id));
      if (toRemove.size > 0) hasDeleted = true;
      if (toRemove.has(source) || toRemove.has(target)) deletedSourceOrTarget = true;
      
      toRemove.forEach(id => emit('node:remove', id));
      const next = prev.filter(n => !toRemove.has(n.id));
      setPanelNodes(next);
      return next;
    });

    setFlowEdges(prev => {
      const toRemove = new Set(prev.filter(e => e.selected).map(e => e.id));
      if (toRemove.size > 0) hasDeleted = true;
      toRemove.forEach(id => emit('edge:remove', id));
      return prev.filter(e => !toRemove.has(e.id));
    });

    setTimeout(() => {
      if (hasDeleted && (sim.status === 'stepping' || sim.status === 'done')) {
        if (deletedSourceOrTarget) {
          sim.reset();
          if (source && panelNodes.find(n => n.id === source)?.selected) setSource('');
          if (target && panelNodes.find(n => n.id === target)?.selected) setTarget('');
        } else {
          emit('sim:reroute', { packetId: ++packetIdRef.current, algorithm, source, target });
        }
      }
    }, 0);
  }, [emit, sim, algorithm, source, target, panelNodes]);



  // Sync panelNodes whenever canvas reports node changes
  const handleCanvasNodesChange = useCallback((nodes) => {
    setPanelNodes(nodes);
    setFlowNodes(nodes);
  }, []);

  const handleCanvasEdgesChange = useCallback((edges) => {
    setFlowEdges(edges);
  }, []);

  // ─── Simulation ───────────────────────────────────────────────────────────
  const handleStartSim = () => {
    if (!source || !target) return;
    clearInterval(autoTimerRef.current);
    sim.reset();
    sim.setStatus('routing');
    emit('sim:route', { packetId: ++packetIdRef.current, algorithm, source, target });
  };

  const handleNextStep = () => sim.nextStep();

  const handleReset = () => {
    clearInterval(autoTimerRef.current);
    sim.stopAuto();
    sim.reset();
  };

  const handleAlgorithmChange = (algo) => {
    setAlgorithm(algo);
    handleReset();
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', fontFamily: "'Inter', sans-serif", overflow: 'hidden' }}>
      {showStart && <StartScreen onBlankCanvas={handleBlankCanvas} onPreset={handlePreset} />}

      <ControlPanel
        nodes={panelNodes}
        algorithm={algorithm}   setAlgorithm={handleAlgorithmChange}
        source={source}         setSource={setSource}
        target={target}         setTarget={setTarget}
        simMode={simMode}       setSimMode={setSimMode}
        speed={sim.speed}       setSpeed={sim.setSpeed}
        status={sim.status}
        currentStep={sim.currentStep}
        totalSteps={sim.steps.length}
        onStartSim={handleStartSim}
        onNextStep={handleNextStep}
        onReset={handleReset}
        connected={connected}
        onAddNode={handleAddNode}
        onDeleteSelected={handleDeleteSelected}
      />

      <ReactFlowProvider>
        <NetworkCanvas
          initialNodes={flowNodes}
          initialEdges={flowEdges}
          activeNodes={sim.activeNodes}
          activeEdges={sim.activeEdges}
          finalPath={sim.finalPath}
          finalEdgePath={sim.finalEdgePath}
          source={source}
          target={target}
          onNodesChange={handleCanvasNodesChange}
          onEdgesChange={handleCanvasEdgesChange}
          onNodeClick={useCallback(() => {}, [])}
          emit={emit}
        />
      </ReactFlowProvider>

      <AlgoLog
        steps={sim.steps}
        currentStep={sim.currentStep}
        algorithm={algorithm}
        status={sim.status}
        errorMsg={sim.errorMsg}
        stats={sim.stats}
      />
    </div>
  );
}
