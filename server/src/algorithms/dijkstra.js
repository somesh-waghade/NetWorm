/**
 * Dijkstra — weighted shortest path
 * Returns: { steps, path, edgePath, totalCost, success }
 */
function dijkstra(adj, source, target) {
  const steps = [];
  const dist = {};
  const prev = {};
  const visited = new Set();

  for (const id of Object.keys(adj)) dist[id] = Infinity;
  dist[source] = 0;

  // Simple priority queue via sorted array (good enough for simulation scale)
  const pq = [{ id: source, dist: 0 }];

  steps.push({ type: 'visit', nodeId: source, dist: 0, description: `Init Dijkstra at ${source}, dist=0` });

  while (pq.length > 0) {
    pq.sort((a, b) => a.dist - b.dist);
    const { id: u } = pq.shift();

    if (visited.has(u)) continue;
    visited.add(u);

    if (u === target) break;

    for (const { neighbor: v, weight, edgeId } of (adj[u] || [])) {
      if (visited.has(v)) continue;
      const newDist = dist[u] + weight;
      steps.push({ type: 'relax', nodeId: v, edgeId, fromNode: u, newDist, oldDist: dist[v], description: `Relax edge ${u}→${v}, new dist=${newDist}` });
      if (newDist < dist[v]) {
        dist[v] = newDist;
        prev[v] = { from: u, edgeId };
        pq.push({ id: v, dist: newDist });
        steps.push({ type: 'update', nodeId: v, dist: newDist, description: `Updated dist[${v}]=${newDist}` });
      }
    }
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

  steps.push({ type: 'path', path, edgePath, totalCost: dist[target], description: `Shortest path: ${path.join(' → ')} | Cost: ${dist[target]}` });

  return { steps, path, edgePath, totalCost: dist[target], success: true };
}

module.exports = dijkstra;
