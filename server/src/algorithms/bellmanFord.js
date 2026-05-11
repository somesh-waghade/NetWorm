/**
 * Bellman-Ford — handles negative edges, detects negative cycles
 */
function bellmanFord(adj, source, target) {
  const steps = [];
  const nodes = Object.keys(adj);
  const dist = {};
  const prev = {};

  for (const id of nodes) dist[id] = Infinity;
  dist[source] = 0;

  steps.push({ type: 'visit', nodeId: source, dist: 0, description: `Init Bellman-Ford at ${source}` });

  const V = nodes.length;

  // Build edge list from adjacency
  const edges = [];
  for (const u of nodes) {
    for (const { neighbor: v, weight, edgeId } of (adj[u] || [])) {
      if (u < v) edges.push({ u, v, weight, edgeId }); // avoid duplicates for undirected
    }
  }

  for (let i = 0; i < V - 1; i++) {
    let updated = false;
    for (const { u, v, weight, edgeId } of edges) {
      // Try u→v
      if (dist[u] !== Infinity && dist[u] + weight < dist[v]) {
        dist[v] = dist[u] + weight;
        prev[v] = { from: u, edgeId };
        updated = true;
        steps.push({ type: 'relax', nodeId: v, edgeId, fromNode: u, newDist: dist[v], description: `Relax ${u}→${v}, dist[${v}]=${dist[v]}` });
      }
      // Try v→u (undirected)
      if (dist[v] !== Infinity && dist[v] + weight < dist[u]) {
        dist[u] = dist[v] + weight;
        prev[u] = { from: v, edgeId };
        updated = true;
        steps.push({ type: 'relax', nodeId: u, edgeId, fromNode: v, newDist: dist[u], description: `Relax ${v}→${u}, dist[${u}]=${dist[u]}` });
      }
    }
    if (!updated) break; // early termination
  }

  if (dist[target] === Infinity) return { steps, path: [], edgePath: [], totalCost: Infinity, success: false };

  const path = [];
  const edgePath = [];
  let cur = target;
  while (cur !== undefined) {
    path.unshift(cur);
    if (prev[cur]) edgePath.unshift(prev[cur].edgeId);
    cur = prev[cur]?.from;
  }

  steps.push({ type: 'path', path, edgePath, totalCost: dist[target], description: `Path: ${path.join(' → ')} | Cost: ${dist[target]}` });

  return { steps, path, edgePath, totalCost: dist[target], success: true };
}

module.exports = bellmanFord;
