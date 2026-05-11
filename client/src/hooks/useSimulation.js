import { useState, useCallback, useRef } from 'react';

/**
 * useSimulation — manages the packet step-through animation state machine.
 *
 * Modes:
 *   'auto'   → steps play automatically at a configurable speed
 *   'manual' → user clicks "Next Step"
 *
 * States: idle → routing → stepping → done | error
 */
export function useSimulation() {
  const [mode, setMode] = useState('auto');       // 'auto' | 'manual'
  const [speed, setSpeed] = useState(600);         // ms per step
  const [status, setStatus] = useState('idle');    // idle | routing | stepping | done | error
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [activeNodes, setActiveNodes] = useState(new Set());
  const [activeEdges, setActiveEdges] = useState(new Set());
  const [finalPath, setFinalPath] = useState([]);
  const [finalEdgePath, setFinalEdgePath] = useState([]);
  const [packetPos, setPacketPos] = useState(null); // { nodeIndex } along path
  const [stats, setStats] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const timerRef = useRef(null);

  const reset = useCallback(() => {
    clearInterval(timerRef.current);
    setStatus('idle');
    setSteps([]);
    setCurrentStep(-1);
    setActiveNodes(new Set());
    setActiveEdges(new Set());
    setFinalPath([]);
    setFinalEdgePath([]);
    setPacketPos(null);
    setStats(null);
    setErrorMsg('');
  }, []);

  /** Apply a single step to highlight state */
  const applyStep = useCallback((step, idx, allSteps) => {
    setCurrentStep(idx);
    if (step.type === 'visit' || step.type === 'update') {
      setActiveNodes(prev => new Set([...prev, step.nodeId]));
      if (step.edgeId) setActiveEdges(prev => new Set([...prev, step.edgeId]));
    } else if (step.type === 'relax') {
      if (step.edgeId) setActiveEdges(prev => new Set([...prev, step.edgeId]));
      if (step.nodeId) setActiveNodes(prev => new Set([...prev, step.nodeId]));
    } else if (step.type === 'path') {
      setFinalPath(step.path || []);
      setFinalEdgePath(step.edgePath || []);
    }
  }, []);

  /** Called when sim:result arrives from server */
  const loadResult = useCallback((result) => {
    clearInterval(timerRef.current);
    setSteps(result.steps);
    setCurrentStep(-1);
    setActiveNodes(new Set());
    setActiveEdges(new Set());
    setFinalPath([]);
    setFinalEdgePath([]);
    setPacketPos(null);
    setStats({ totalCost: result.totalCost, hops: result.path.length - 1, algorithm: result.algorithm });
    setStatus('stepping');
  }, []);

  /** Advance one step (manual mode) */
  const nextStep = useCallback(() => {
    setCurrentStep(prev => {
      const next = prev + 1;
      if (next >= steps.length) { setStatus('done'); return prev; }
      applyStep(steps[next], next, steps);
      return next;
    });
  }, [steps, applyStep]);

  /** Start auto-play */
  const startAuto = useCallback(() => {
    let idx = currentStep;
    timerRef.current = setInterval(() => {
      idx++;
      if (idx >= steps.length) {
        clearInterval(timerRef.current);
        setStatus('done');
        return;
      }
      applyStep(steps[idx], idx, steps);
      setCurrentStep(idx);
    }, speed);
  }, [steps, currentStep, speed, applyStep]);

  const stopAuto = useCallback(() => clearInterval(timerRef.current), []);

  const setError = useCallback((msg) => {
    setStatus('error');
    setErrorMsg(msg);
  }, []);

  return {
    mode, setMode,
    speed, setSpeed,
    status, setStatus,
    steps, currentStep,
    activeNodes, activeEdges,
    finalPath, finalEdgePath,
    packetPos,
    stats,
    errorMsg,
    reset,
    loadResult,
    nextStep,
    startAuto,
    stopAuto,
    setError,
  };
}
