const bfs = require('../algorithms/bfs');
const dijkstra = require('../algorithms/dijkstra');
const bellmanFord = require('../algorithms/bellmanFord');
const aStar = require('../algorithms/aStar');

const ALGORITHMS = { 
  bfs, 
  dijkstra, 
  bellmanFord, 
  bellman: bellmanFord, 
  aStar, 
  astar: aStar 
};

/**
 * Run a routing algorithm and return all steps + result.
 * Does NOT emit — caller handles emission.
 */
function computeRoute(graph, { algorithm, source, target }) {
  const adj = graph.getAdjacency();

  if (!adj[source]) return { success: false, error: `Source node "${source}" not found or failed` };
  if (!adj[target]) return { success: false, error: `Target node "${target}" not found or failed` };

  const algoFn = ALGORITHMS[algorithm];
  if (!algoFn) return { success: false, error: `Unknown algorithm: ${algorithm}` };

  if (algorithm === 'aStar' || algorithm === 'astar') {
    return algoFn(adj, source, target, (id) => graph.getNodePosition(id));
  }
  return algoFn(adj, source, target);
}

module.exports = { computeRoute };
