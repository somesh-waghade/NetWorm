# NetWorm — Pathfinding Algorithm Visualization

NetWorm is a full-stack interactive web application designed to visualize and explore how pathfinding algorithms traverse graphs in real-time.

Built with **React, Node.js, Socket.IO, and React Flow**, it brings core computer science concepts to life with a modern, dynamic UI.

![NetWorm Interface](./client/public/favicon.ico) *(UI Screenshots can be added here)*

## 🌟 Core Features

- **Interactive Graph Builder**: Add nodes, draw edges, and set weights via an intuitive drag-and-drop canvas.
- **Pathfinding Algorithms**:
  - **Dijkstra** — Shortest path in weighted graphs.
  - **BFS (Breadth-First Search)** — Shortest path in unweighted graphs (hop count).
  - **Bellman-Ford** — Robust pathfinding that handles negative edge weights.
  - **A\*** — Heuristic-guided search using canvas coordinates for optimal efficiency.
- **Real-Time Visualization**: Watch algorithms "think" step-by-step with live tracing of visited nodes and edge relaxations.
- **Dynamic Topology Changes**: Modify the graph structure mid-visualization and watch the algorithm automatically recalculate the path.
- **Preset Graph Types**: Quickly load common structures like Rings, Stars, Meshes, and Complex Maps.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, React Flow, Tailwind CSS v4, Socket.IO Client
- **Backend**: Node.js, Express, Socket.IO
- **Algorithms**: Pure JavaScript graph processing using an Adjacency List representation.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### 1. Start the Backend Server
```bash
cd server
npm install
npm run dev
# The server will start on http://localhost:3001
```

### 2. Start the Frontend Client
```bash
cd client
npm install
npm run dev
# The visualization app will be available at http://localhost:5173
```

## 🎮 How to Use

1. **Build Your Graph**: Start with an Empty Graph or choose a Preset. Use the `+ Node` button to add nodes, and drag between node handles to create edges.
2. **Configure Weights**: Click on any edge weight label to edit its value.
3. **Set Path Targets**: Select a **Start Node** (🟢) and an **End Node** (🔴) from the left panel.
4. **Choose Algorithm**: Select Dijkstra, BFS, Bellman-Ford, or A*.
5. **Visualize**: Click `Start Visualization`. Watch the process in Auto mode (adjust delay with the slider) or use Manual mode to step through one action at a time.
6. **Dynamic Interaction**: If a path search is active and you modify the graph (remove nodes/edges), it will immediately find a new path!

## 📜 Architecture

- **Client**: `NetworkCanvas` handles React Flow interactions. State is managed via React hooks (`useSimulation`) and synced to the server over WebSockets.
- **Server**: Maintains a global `Graph.js` state. When a search request is received, it runs the algorithm in `packetEngine.js`, generating a detailed array of `steps` for the UI.
- **Socket.IO**: Ensures real-time synchronization between the builder and the engine.

## 📝 License

MIT License.
