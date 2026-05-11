/**
 * BFS — shortest hop path (ignores weights)
 * Returns: { steps, path, totalCost }
 * steps: array of { type, nodeId?, edgeId?, description }
 */
function bfs(adj, source, target) {
  const steps = [];
  const visited = new Set();
  const prev = {};      // nodeId → { from, edgeId }
  const queue = [source];
  visited.add(source);

  steps.push({ type: 'visit', nodeId: source, description: `Start BFS at ${source}` });

  let found = false;

  while (queue.length > 0) {
    const current = queue.shift();
    if (current === target) { found = true; break; }

    for (const { neighbor, weight, edgeId } of (adj[current] || [])) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        prev[neighbor] = { from: current, edgeId };
        steps.push({ type: 'visit', nodeId: neighbor, edgeId, description: `Visit ${neighbor} via edge ${edgeId}` });
        queue.push(neighbor);
      }
    }
  }

  if (!found) return { steps, path: [], totalCost: Infinity, success: false };

  // Reconstruct path
  const path = [];
  let cur = target;
  while (cur !== undefined) {
    path.unshift(cur);
    cur = prev[cur]?.from;
  }

  const edgePath = [];
  let totalCost = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const edge = (adj[path[i]] || []).find(e => e.neighbor === path[i + 1]);
    if (edge) { edgePath.push(edge.edgeId); totalCost += edge.weight; }
  }

  steps.push({ type: 'path', path, edgePath, description: `Path found: ${path.join(' → ')}` });

  return { steps, path, edgePath, totalCost, success: true };
}

module.exports = bfs;
