import { useState } from 'react';
import Graph from './components/Graph/Graph.js';
import type { JobData } from './types/index.js';
import { loadDataFromFile } from './utils/dataLoader.js';
import { generateTestData, generateRealisticTestData } from './utils/generateTestData.js';
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
  const [showTestOptions, setShowTestOptions] = useState(false);

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

  const loadTestData = (nodeCount: number) => {
    const testData = generateTestData(nodeCount);
    setData(testData);
    setError('');
    setShowTestOptions(false);
  };

  const loadRealisticTestData = (scale: number) => {
    const testData = generateRealisticTestData(scale);
    setData(testData);
    setError('');
    setShowTestOptions(false);
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
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
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
          
          <button
            onClick={() => setShowTestOptions(!showTestOptions)}
            style={{
              padding: '8px 20px',
              backgroundColor: '#10b981',
              color: 'white',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              border: 'none',
              transition: 'background-color 0.2s'
            }}
          >
            Test Data
          </button>
        </div>
        
        {showTestOptions && (
          <div style={{
            backgroundColor: '#0f172a',
            padding: '12px',
            borderRadius: '6px',
            border: '1px solid #334155'
          }}>
            <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '8px' }}>
              Load Test Data:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              <button onClick={() => loadTestData(50)} style={testButtonStyle}>
                50 nodes
              </button>
              <button onClick={() => loadTestData(100)} style={testButtonStyle}>
                100 nodes
              </button>
              <button onClick={() => loadTestData(500)} style={testButtonStyle}>
                500 nodes
              </button>
              <button onClick={() => loadTestData(1000)} style={testButtonStyle}>
                1000 nodes
              </button>
              <button onClick={() => loadRealisticTestData(5)} style={testButtonStyle}>
                Realistic (Small)
              </button>
              <button onClick={() => loadRealisticTestData(15)} style={testButtonStyle}>
                Realistic (Large)
              </button>
            </div>
          </div>
        )}
        
        {error && (
          <div style={{
            color: '#ef4444',
            fontSize: '12px'
          }}>
            {error}
          </div>
        )}
        
        <div style={{
          color: '#64748b',
          fontSize: '11px',
          marginTop: '4px'
        }}>
          Current: {data.length} nodes
        </div>
      </div>
      <Graph data={data} />
    </>
  );
}

const testButtonStyle: React.CSSProperties = {
  padding: '4px 12px',
  backgroundColor: '#334155',
  color: '#e2e8f0',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '12px',
  border: 'none',
  transition: 'background-color 0.2s'
};

export default App;