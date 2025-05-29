import React, { useCallback, useMemo, useEffect } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  ReactFlowProvider
} from 'reactflow';
import type { Connection, Edge, Node } from 'reactflow';
import 'reactflow/dist/style.css';

import CustomNode from '../CustomNode.js';
import SearchBar from '../SearchBar/SearchBar.js';
import type { JobData, GraphNode, GraphEdge } from '../../types/index.js';
import { parseJobData } from '../../utils/dataParser.js';

interface GraphProps {
  data: JobData[];
}

const nodeTypes = {
  custom: CustomNode,
};

const GraphComponent: React.FC<GraphProps> = ({ data }) => {
  const { fitView, setCenter, getNode } = useReactFlow();
  
  const initialData = useMemo(() => parseJobData(data), [data]);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialData.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialData.edges);

  useEffect(() => {
    const newData = parseJobData(data);
    setNodes(newData.nodes);
    setEdges(newData.edges);
    setTimeout(() => fitView({ padding: 0.1 }), 100);
  }, [data, setNodes, setEdges, fitView]);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleSearch = useCallback((searchTerm: string) => {
    if (!searchTerm) {
      // Reset all nodes to default state
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          style: undefined
        }))
      );
      return;
    }

    // Find the node that matches the search term
    const searchLower = searchTerm.toLowerCase();
    const matchingNode = nodes.find(
      (node) => node.data.label.toLowerCase().includes(searchLower)
    );

    if (matchingNode) {
      // Highlight the matching node and dim others
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          style: node.id === matchingNode.id
            ? { opacity: 1 }
            : { opacity: 0.3 }
        }))
      );

      // Center the view on the matching node
      const node = getNode(matchingNode.id);
      if (node) {
        setCenter(node.position.x, node.position.y, {
          zoom: 1.5,
          duration: 800
        });
      }
    }
  }, [nodes, setNodes, setCenter, getNode]);

  const defaultEdgeOptions = {
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#64748b', strokeWidth: 2 },
    markerEnd: {
      type: 'arrowclosed',
      width: 20,
      height: 20,
      color: '#64748b',
    },
  };

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#0f172a' }}>
      <SearchBar onSearch={handleSearch} />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        style={{ backgroundColor: '#0f172a' }}
      >
        <Controls 
          style={{
            button: {
              backgroundColor: '#1e293b',
              color: '#e2e8f0',
              border: '1px solid #334155',
            }
          }}
        />
        <Background 
          variant="dots" 
          gap={12} 
          size={1} 
          color="#1e293b"
        />
      </ReactFlow>
    </div>
  );
};

const Graph: React.FC<GraphProps> = (props) => {
  return (
    <ReactFlowProvider>
      <GraphComponent {...props} />
    </ReactFlowProvider>
  );
};

export default Graph;