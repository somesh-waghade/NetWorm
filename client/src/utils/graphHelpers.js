let nodeCounter = 1;
let edgeCounter = 1;

export const genNodeId = () => `N${nodeCounter++}`;
export const genEdgeId = () => `E${edgeCounter++}`;

export const PRESET_TOPOLOGIES = {
  ring: {
    label: 'Ring Graph',
    nodes: [
      { id: 'N1', label: 'N1', x: 400, y: 150 },
      { id: 'N2', label: 'N2', x: 650, y: 300 },
      { id: 'N3', label: 'N3', x: 550, y: 520 },
      { id: 'N4', label: 'N4', x: 250, y: 520 },
      { id: 'N5', label: 'N5', x: 150, y: 300 },
    ],
    edges: [
      { id: 'E1', source: 'N1', target: 'N2', weight: 4 },
      { id: 'E2', source: 'N2', target: 'N3', weight: 3 },
      { id: 'E3', source: 'N3', target: 'N4', weight: 2 },
      { id: 'E4', source: 'N4', target: 'N5', weight: 5 },
      { id: 'E5', source: 'N5', target: 'N1', weight: 1 },
    ],
  },
  star: {
    label: 'Star Graph',
    nodes: [
      { id: 'N1', label: 'N1', x: 400, y: 330 },
      { id: 'N2', label: 'N2', x: 400, y: 130 },
      { id: 'N3', label: 'N3', x: 600, y: 230 },
      { id: 'N4', label: 'N4', x: 600, y: 430 },
      { id: 'N5', label: 'N5', x: 200, y: 430 },
      { id: 'N6', label: 'N6', x: 200, y: 230 },
    ],
    edges: [
      { id: 'E1', source: 'N1', target: 'N2', weight: 2 },
      { id: 'E2', source: 'N1', target: 'N3', weight: 3 },
      { id: 'E3', source: 'N1', target: 'N4', weight: 1 },
      { id: 'E4', source: 'N1', target: 'N5', weight: 4 },
      { id: 'E5', source: 'N1', target: 'N6', weight: 2 },
    ],
  },
  mesh: {
    label: 'Mesh Graph',
    nodes: [
      { id: 'N1', label: 'N1', x: 200, y: 150 },
      { id: 'N2', label: 'N2', x: 500, y: 150 },
      { id: 'N3', label: 'N3', x: 700, y: 330 },
      { id: 'N4', label: 'N4', x: 500, y: 510 },
      { id: 'N5', label: 'N5', x: 200, y: 510 },
      { id: 'N6', label: 'N6', x: 50,  y: 330 },
    ],
    edges: [
      { id: 'E1',  source: 'N1', target: 'N2', weight: 2 },
      { id: 'E2',  source: 'N2', target: 'N3', weight: 3 },
      { id: 'E3',  source: 'N3', target: 'N4', weight: 2 },
      { id: 'E4',  source: 'N4', target: 'N5', weight: 4 },
      { id: 'E5',  source: 'N5', target: 'N6', weight: 1 },
      { id: 'E6',  source: 'N6', target: 'N1', weight: 3 },
      { id: 'E7',  source: 'N1', target: 'N4', weight: 6 },
      { id: 'E8',  source: 'N2', target: 'N5', weight: 5 },
      { id: 'E9',  source: 'N3', target: 'N6', weight: 7 },
    ],
  },
  complex: {
    label: 'Complex Map',
    nodes: [
      { id: 'N1', label: 'Alpha', x: 150, y: 200 },
      { id: 'N2', label: 'Beta', x: 400, y: 120 },
      { id: 'N3', label: 'Gamma',  x: 600, y: 280 },
      { id: 'N4', label: 'Delta',x: 750, y: 150 },
      { id: 'N5', label: 'Epsilon',x: 750, y: 420 },
      { id: 'N6', label: 'Zeta', x: 400, y: 480 },
      { id: 'N7', label: 'Eta',   x: 200, y: 400 },
    ],
    edges: [
      { id: 'E1', source: 'N1', target: 'N2', weight: 10 },
      { id: 'E2', source: 'N2', target: 'N3', weight: 5  },
      { id: 'E3', source: 'N3', target: 'N4', weight: 3  },
      { id: 'E4', source: 'N3', target: 'N5', weight: 4  },
      { id: 'E5', source: 'N3', target: 'N6', weight: 6  },
      { id: 'E6', source: 'N6', target: 'N7', weight: 8  },
      { id: 'E7', source: 'N7', target: 'N1', weight: 2  },
      { id: 'E8', source: 'N2', target: 'N7', weight: 7  },
      { id: 'E9', source: 'N4', target: 'N5', weight: 2  },
    ],
  },
};

export const ALGORITHM_INFO = {
  dijkstra:    { label: 'Dijkstra',     color: '#10b981', description: 'Shortest path (weighted)' },
  bfs:         { label: 'BFS',          color: '#3b82f6', description: 'Breadth-First Search' },
  bellman:     { label: 'Bellman-Ford', color: '#f59e0b', description: 'Handles negative weights' },
  astar:       { label: 'A*',           color: '#d946ef', description: 'Heuristic-guided search' },
};

