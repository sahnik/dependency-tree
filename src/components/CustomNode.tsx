import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';

interface CustomNodeData {
  label: string;
  sources: string[];
  targets: string[];
  color: string;
}

interface CustomNodeProps {
  data: CustomNodeData;
}

const CustomNode: React.FC<CustomNodeProps> = ({ data }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="custom-node"
      style={{
        backgroundColor: data.color,
        padding: '10px 20px',
        borderRadius: '8px',
        border: '2px solid #1e293b',
        minWidth: '120px',
        textAlign: 'center',
        cursor: 'move',
        position: 'relative',
        color: '#ffffff',
        fontWeight: '500',
        fontSize: '14px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
      
      {data.label}
      
      {showTooltip && (data.sources.length > 0 || data.targets.length > 0) && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginTop: '10px',
            backgroundColor: '#1e293b',
            color: '#e2e8f0',
            padding: '12px',
            borderRadius: '6px',
            fontSize: '12px',
            minWidth: '200px',
            zIndex: 1000,
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            border: '1px solid #334155'
          }}
        >
          {data.sources.length > 0 && (
            <div style={{ marginBottom: '8px' }}>
              <strong style={{ color: '#94a3b8' }}>Sources:</strong>
              <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                {data.sources.map((source, idx) => (
                  <li key={idx} style={{ color: '#cbd5e1' }}>{source}</li>
                ))}
              </ul>
            </div>
          )}
          {data.targets.length > 0 && (
            <div>
              <strong style={{ color: '#94a3b8' }}>Targets:</strong>
              <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                {data.targets.map((target, idx) => (
                  <li key={idx} style={{ color: '#cbd5e1' }}>{target}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
    </div>
  );
};

export default CustomNode;