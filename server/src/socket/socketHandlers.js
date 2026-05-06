const Graph = require('../graph/Graph');
const { computeRoute } = require('../simulation/packetEngine');

// Singleton graph shared across all socket connections
const graph = new Graph();

function registerHandlers(io) {
  io.on('connection', (socket) => {
    console.log(`[WS] Client connected: ${socket.id}`);

    // Send current graph state to newly connected client
    socket.emit('graph:state', graph.serialize());

    // ─── Topology Events ──────────────────────────────────────────────────────

    socket.on('graph:sync', (state) => {
      // Client sends full topology (on load or bulk import)
      graph.loadFromState(state);
      socket.broadcast.emit('graph:state', graph.serialize());
    });

    socket.on('node:add', (node) => {
      graph.addNode(node);
      io.emit('node:added', node);
    });

    socket.on('node:remove', (id) => {
      graph.removeNode(id);
      io.emit('node:removed', id);
    });

    socket.on('node:move', ({ id, x, y }) => {
      const node = graph.nodes.get(id);
      if (node) { node.x = x; node.y = y; }
      // No broadcast needed — React Flow handles position locally
    });



    socket.on('edge:add', (edge) => {
      graph.addEdge(edge);
      io.emit('edge:added', edge);
    });

    socket.on('edge:remove', (id) => {
      graph.removeEdge(id);
      io.emit('edge:removed', id);
    });

    socket.on('edge:update', ({ id, weight }) => {
      graph.updateEdgeWeight(id, weight);
      io.emit('edge:updated', { id, weight });
    });

    // ─── Simulation Events ────────────────────────────────────────────────────

    socket.on('sim:route', ({ packetId, algorithm, source, target }) => {
      console.log(`[SEARCH] Id ${packetId}: ${algorithm} from ${source} → ${target}`);

      const result = computeRoute(graph, { algorithm, source, target });

      if (!result.success) {
        socket.emit('sim:error', { packetId, error: result.error });
        return;
      }

      // Emit full result: client drives the animation
      socket.emit('sim:result', {
        packetId,
        algorithm,
        source,
        target,
        steps: result.steps,
        path: result.path,
        edgePath: result.edgePath,
        totalCost: result.totalCost,
      });
    });

    // Reroute request (after failure)
    socket.on('sim:reroute', ({ packetId, algorithm, source, target }) => {
      console.log(`[SEARCH] Updating path search ${packetId} after topology change`);
      const result = computeRoute(graph, { algorithm, source, target });

      if (!result.success) {
        socket.emit('sim:error', { packetId, error: result.error || 'No path after reroute' });
        return;
      }

      socket.emit('sim:rerouted', {
        packetId,
        algorithm,
        steps: result.steps,
        path: result.path,
        edgePath: result.edgePath,
        totalCost: result.totalCost,
      });
    });

    socket.on('disconnect', () => {
      console.log(`[WS] Client disconnected: ${socket.id}`);
    });
  });
}

module.exports = registerHandlers;
