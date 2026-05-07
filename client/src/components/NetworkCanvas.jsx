import { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow, Background, Controls, MiniMap,
  addEdge, applyNodeChanges, applyEdgeChanges,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Node from './Node';
import WeightedEdge from './WeightedEdge';

const nodeTypes = { node: Node };
const edgeTypes = { weighted: WeightedEdge };

export default function NetworkCanvas({
  initialNodes = [],
  initialEdges = [],
  activeNodes,
  activeEdges,
  finalPath,
  finalEdgePath,
  source,
  target,
  onNodesChange: notifyNodesChange,
  onEdgesChange: notifyEdgesChange,
  onNodeClick,
  emit,
}) {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  // Sync when parent sends a new topology
  useEffect(() => {
    setNodes(initialNodes);
    notifyNodesChange?.(initialNodes);
  }, [JSON.stringify(initialNodes.map(n => n.id))]);

  useEffect(() => {
    setEdges(initialEdges);
    notifyEdgesChange?.(initialEdges);
  }, [JSON.stringify(initialEdges.map(e => e.id))]);

  // React Flow change handlers
  const handleNodesChange = useCallback((changes) => {
    setNodes(prev => {
      const next = applyNodeChanges(changes, prev);
      setTimeout(() => notifyNodesChange?.(next), 0);
      return next;
    });
  }, [notifyNodesChange]);

  const handleEdgesChange = useCallback((changes) => {
    setEdges(prev => {
      const next = applyEdgeChanges(changes, prev);
      setTimeout(() => notifyEdgesChange?.(next), 0);
      return next;
    });
  }, [notifyEdgesChange]);

  const onConnect = useCallback((params) => {
    const newEdge = {
      ...params,
      id: `E-${Date.now()}`,
      type: 'weighted',
      data: { weight: 1 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#334155' },
    };
    setEdges(prev => {
      const next = addEdge(newEdge, prev);
      notifyEdgesChange?.(next);
      return next;
    });
    emit('edge:add', { id: newEdge.id, source: params.source, target: params.target, weight: 1 });
  }, [emit, notifyEdgesChange]);

  const handleNodeDragStop = useCallback((_, node) => {
    emit('node:move', { id: node.id, x: node.position.x, y: node.position.y });
  }, [emit]);

  // Status helpers
  const getNodeStatus = useCallback((id) => {
    if (id === source)             return 'source';
    if (id === target)             return 'dest';
    if (finalPath.includes(id))    return 'path';
    if (activeNodes.has(id))       return 'active';
    return 'idle';
  }, [source, target, finalPath, activeNodes]);

  const getEdgeStatus = useCallback((id) => {
    if (finalEdgePath.includes(id)) return 'path';
    if (activeEdges.has(id))        return 'active';
    return 'idle';
  }, [finalEdgePath, activeEdges]);

  // Enrich nodes with simulation status
  const enrichedNodes = nodes.map(n => ({
    ...n,
    data: { ...n.data, status: getNodeStatus(n.id) },
  }));

  // Enrich edges with status + weight-change callback
  const enrichedEdges = edges.map(e => ({
    ...e,
    type: 'weighted',
    data: {
      ...e.data,
      status: getEdgeStatus(e.id),
      onWeightChange: (id, weight) => {
        setEdges(prev => prev.map(ed =>
          ed.id === id ? { ...ed, data: { ...ed.data, weight } } : ed
        ));
        emit('edge:update', { id, weight });
      },
    },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#334155' },
  }));

  return (
    <div style={{ flex: 1, background: '#f8fafc', position: 'relative' }}>
      <ReactFlow
        nodes={enrichedNodes}
        edges={enrichedEdges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onNodeDragStop={handleNodeDragStop}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        deleteKeyCode={null}
        proOptions={{ hideAttribution: true }}
        style={{ background: 'transparent' }}
      >
        <Background color="#cbd5e1" gap={28} size={1.2} />
        <Controls style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8 }} />
        <MiniMap
          nodeColor={n => {
            const s = getNodeStatus(n.id);
            return s === 'path' ? '#3b82f6' : s === 'active' ? '#10b981'
              : s === 'source' ? '#f59e0b' : s === 'dest' ? '#8b5cf6' : '#e2e8f0';
          }}
          style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8 }}
        />
      </ReactFlow>
    </div>
  );
}
