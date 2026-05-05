/**
 * Graph — adjacency-list representation
 * Nodes:  Map<id, { id, label, x, y, failed }>
 * Edges:  Map<id, { id, source, target, weight }>
 */
class Graph {
  constructor() {
    this.nodes = new Map();
    this.edges = new Map();
  }

  addNode(node) {
    this.nodes.set(node.id, { ...node });
  }

  removeNode(id) {
    this.nodes.delete(id);
    // remove all edges connected to this node
    for (const [eid, e] of this.edges) {
      if (e.source === id || e.target === id) this.edges.delete(eid);
    }
  }



  addEdge(edge) {
    this.edges.set(edge.id, {
      ...edge,
      weight: Number(edge.weight) || 1,
    });
  }

  removeEdge(id) {
    this.edges.delete(id);
  }

  updateEdgeWeight(id, weight) {
    if (this.edges.has(id)) {
      this.edges.get(id).weight = Number(weight) || 1;
    }
  }

  /** Returns adjacency list */
  getAdjacency() {
    const adj = {};
    for (const [id] of this.nodes) {
      adj[id] = [];
    }
    for (const [, edge] of this.edges) {
      const { source, target, weight, id } = edge;
      if (adj[source] !== undefined && adj[target] !== undefined) {
        adj[source].push({ neighbor: target, weight, edgeId: id });
        adj[target].push({ neighbor: source, weight, edgeId: id }); // undirected
      }
    }
    return adj;
  }

  getNodePosition(id) {
    const n = this.nodes.get(id);
    return n ? { x: n.x || 0, y: n.y || 0 } : { x: 0, y: 0 };
  }

  serialize() {
    return {
      nodes: Array.from(this.nodes.values()),
      edges: Array.from(this.edges.values()),
    };
  }

  /** Bulk-replace graph state (used when client sends full topology) */
  loadFromState({ nodes = [], edges = [] }) {
    this.nodes.clear();
    this.edges.clear();
    nodes.forEach((n) => this.addNode(n));
    edges.forEach((e) => this.addEdge(e));
  }
}

module.exports = Graph;
