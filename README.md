# Dependency Tree Visualization App

An interactive dependency visualization application built with React and react-flow. This app creates visual graphs from JSON data to display job dependencies with a modern dark theme.

## Features

- **Interactive Graph Visualization**
  - Automatic tree layout using Dagre algorithm
  - Multiple layout directions (Top-Bottom, Left-Right, Bottom-Top, Right-Left)
  - Zoom and pan controls
  - Draggable nodes
  - Animated edges with directional arrows
  - Color-coded nodes based on job configuration

- **Search Functionality**
  - Search for specific jobs
  - Highlights matching nodes
  - Auto-centers view on found nodes

- **Hover Tooltips**
  - Displays sources and targets when hovering over nodes
  - Clean, readable tooltip design

- **JSON File Upload**
  - Load custom dependency data from JSON files
  - Validates JSON structure
  - Error handling for invalid files

- **Dark Theme**
  - VSCode-inspired dark theme
  - Consistent styling throughout the application

## Performance Optimizations

This application is optimized to handle large dependency graphs with up to 1000+ nodes:

### Implemented Optimizations

1. **React Performance**
   - `React.memo` on custom node components to prevent unnecessary re-renders
   - `useCallback` and `useMemo` hooks for expensive operations
   - Custom comparison function for node equality checks
   - React 18's `useTransition` for non-blocking updates

2. **Search Optimization**
   - Indexed search using Map data structure for O(1) lookups
   - Debounced search input (300ms) to reduce re-renders
   - Efficient partial matching algorithm

3. **Rendering Optimizations**
   - Optional edge rendering for graphs with 100+ nodes
   - Optional minimap for navigation in large graphs
   - Disabled animations on edges for better performance
   - Viewport-based rendering (ReactFlow handles this automatically)

4. **Layout Calculation**
   - Asynchronous layout calculation with loading indicator
   - Efficient Dagre algorithm for hierarchical layouts
   - Optimized node positioning

5. **User Controls**
   - Performance options panel for large graphs
   - Toggle edge visibility to improve rendering speed
   - Toggle minimap for better navigation

### Performance Testing

The app includes built-in test data generators:
- Click "Test Data" to load graphs with 50, 100, 500, or 1000 nodes
- "Realistic" options generate multi-stage pipeline data

### Recommendations for Large Graphs

- For 500+ nodes: Consider hiding edges initially
- For 1000+ nodes: Use search to navigate instead of manual panning
- Use keyboard shortcuts for better navigation (arrow keys, +/- for zoom)

## Installation

```bash
npm install
```

## Usage

### Running the Application

```bash
npm run dev
```

The application will start at `http://localhost:5173`

### JSON Data Format

The application expects JSON data in the following format:

```json
[
  {
    "job": "Job Name",
    "dependencies": ["Dependency1", "Dependency2"],
    "sources": ["source1", "source2"],
    "targets": ["target1", "target2"],
    "color": "#3b82f6"
  }
]
```

### Loading Custom Data

1. Click the "Load JSON File" button in the top-right corner
2. Select a JSON file with the correct format
3. The graph will update automatically

## Example Data

The app includes sample data showing a typical build/deployment pipeline. See `sample-data.json` for a more complex example with data processing pipelines.

## Development

### Project Structure

```
src/
├── components/
│   ├── Graph/Graph.tsx        # Main graph component
│   ├── SearchBar/SearchBar.tsx # Search functionality
│   └── CustomNode.tsx         # Custom node with tooltips
├── types/index.ts             # TypeScript interfaces
├── utils/
│   ├── dataParser.ts          # JSON parsing & graph layout
│   └── dataLoader.ts          # File loading utility
└── App.tsx                    # Main app with file upload
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Technologies Used

- React 19 (with Concurrent Features)
- TypeScript
- Vite
- react-flow (ReactFlow) - Optimized graph rendering
- Dagre (Graph layout algorithm)
- CSS3 with custom styling