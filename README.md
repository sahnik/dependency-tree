# Dependency Tree Visualization App

An interactive dependency visualization application built with React and react-flow. This app creates visual graphs from JSON data to display job dependencies with a modern dark theme.

## Features

- **Interactive Graph Visualization**
  - Automatic tree layout using Dagre algorithm
  - Multiple layout directions (Top-Bottom, Left-Right, Bottom-Top, Right-Left)
  - Zoom and pan controls
  - Draggable nodes
  - Selectable edges with hover highlighting
  - Connected node highlighting when edge is selected
  - Directional arrows on edges
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
- `npm run build:standalone` - Build as a single HTML file (for offline use)
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Running the Production Build

After building the app with `npm run build`, you need to serve it through an HTTP server. You cannot open the `index.html` file directly from the file system due to CORS restrictions.

**Option 1: Use Vite's preview command (recommended)**
```bash
npm run preview
```
This will serve the production build at `http://localhost:4173`

**Option 2: Use a static file server**
```bash
# If you have Python installed
python -m http.server 8000 --directory dist

# Or use npx serve
npx serve dist

# Or use http-server
npx http-server dist
```

**Option 3: Deploy to a hosting service**
- Netlify: Drag and drop the `dist` folder to [Netlify](https://www.netlify.com/)
- Vercel: Run `npx vercel` in the project directory
- GitHub Pages: Use the `gh-pages` branch with the `dist` folder

### Offline/Standalone Usage

If you need to run the app without a web server (e.g., from the file system), use the standalone build:

```bash
npm run build:standalone
```

This creates a single `dist/index.html` file that contains all CSS and JavaScript inline. You can:
- Open this file directly in a browser (double-click or `file://` URL)
- Email it as an attachment
- Share it via USB drive
- Use it in environments without web servers

The standalone file is larger (~450KB) but completely self-contained and works offline.

## Technologies Used

- React 19 (with Concurrent Features)
- TypeScript
- Vite
- react-flow (ReactFlow) - Optimized graph rendering
- Dagre (Graph layout algorithm)
- CSS3 with custom styling