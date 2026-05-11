/**
 * A* — heuristic-guided shortest path
 * Heuristic: Euclidean distance between node canvas positions
 */
function aStar(adj, source, target, getPos) {
  const steps = [];

  const heuristic = (a, b) => {
    const pa = getPos(a);
    const pb = getPos(b);
    return Math.sqrt((pa.x - pb.x) ** 2 + (pa.y - pb.y) ** 2) / 100; // scale down
  };

  const gScore = {};
  const fScore = {};
  const prev = {};
  const visited = new Set();

  for (const id of Object.keys(adj)) {
    gScore[id] = Infinity;
    fScore[id] = Infinity;
  }

  gScore[source] = 0;
  fScore[source] = heuristic(source, target);

  const openSet = [source];

  steps.push({ type: 'visit', nodeId: source, dist: 0, description: `A* start at ${source}, h=${heuristic(source, target).toFixed(2)}` });

  while (openSet.length > 0) {
    openSet.sort((a, b) => fScore[a] - fScore[b]);
    const current = openSet.shift();

    if (visited.has(current)) continue;
    visited.add(current);

    if (current === target) break;

    for (const { neighbor, weight, edgeId } of (adj[current] || [])) {
      if (visited.has(neighbor)) continue;

      const tentativeG = gScore[current] + weight;
      const h = heuristic(neighbor, target);

      steps.push({ type: 'relax', nodeId: neighbor, edgeId, fromNode: current, newDist: tentativeG, description: `A* relax ${current}→${neighbor}, g=${tentativeG.toFixed(2)}, h=${h.toFixed(2)}, f=${(tentativeG + h).toFixed(2)}` });

      if (tentativeG < gScore[neighbor]) {
        prev[neighbor] = { from: current, edgeId };
        gScore[neighbor] = tentativeG;
        fScore[neighbor] = tentativeG + h;
        openSet.push(neighbor);
        steps.push({ type: 'update', nodeId: neighbor, dist: tentativeG, description: `Updated g[${neighbor}]=${tentativeG.toFixed(2)}` });
      }
    }
  }

  if (gScore[target] === Infinity) return { steps, path: [], edgePath: [], totalCost: Infinity, success: false };

  const path = [];
  const edgePath = [];
  let cur = target;
  while (cur !== undefined) {
    path.unshift(cur);
    if (prev[cur]) edgePath.unshift(prev[cur].edgeId);
    cur = prev[cur]?.from;
  }

  steps.push({ type: 'path', path, edgePath, totalCost: gScore[target], description: `A* path: ${path.join(' → ')} | Cost: ${gScore[target].toFixed(2)}` });

  return { steps, path, edgePath, totalCost: gScore[target], success: true };
}

module.exports = aStar;
