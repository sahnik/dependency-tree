import { useState } from 'react';
import Graph from './components/Graph/Graph.js';
import type { JobData } from './types/index.js';
import { loadDataFromFile } from './utils/dataLoader.js';
import './App.css';

// Sample data for testing
const sampleData: JobData[] = [
  {
    job: "Frontend Build",
    dependencies: [],
    sources: ["src/components", "src/styles"],
    targets: ["dist/bundle.js", "dist/styles.css"],
    color: "#3b82f6"
  },
  {
    job: "Backend Build",
    dependencies: [],
    sources: ["src/api", "src/services"],
    targets: ["dist/server.js"],
    color: "#10b981"
  },
  {
    job: "Run Tests",
    dependencies: ["Frontend Build", "Backend Build"],
    sources: ["tests/"],
    targets: ["test-results.xml"],
    color: "#f59e0b"
  },
  {
    job: "Deploy Staging",
    dependencies: ["Run Tests"],
    sources: ["dist/"],
    targets: ["staging.example.com"],
    color: "#8b5cf6"
  },
  {
    job: "Deploy Production",
    dependencies: ["Deploy Staging"],
    sources: ["dist/"],
    targets: ["production.example.com"],
    color: "#ef4444"
  }
];

function App() {
  const [data, setData] = useState<JobData[]>(sampleData);
  const [error, setError] = useState<string>('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const loadedData = await loadDataFromFile(file);
      setData(loadedData);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load file');
    }
  };

  return (
    <>
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 5,
        backgroundColor: '#1e293b',
        padding: '12px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}>
        <label htmlFor="file-upload" style={{
          display: 'inline-block',
          padding: '8px 20px',
          backgroundColor: '#3b82f6',
          color: 'white',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          transition: 'background-color 0.2s'
        }}>
          Load JSON File
          <input
            id="file-upload"
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </label>
        {error && (
          <div style={{
            marginTop: '8px',
            color: '#ef4444',
            fontSize: '12px'
          }}>
            {error}
          </div>
        )}
      </div>
      <Graph data={data} />
    </>
  );
}

export default App