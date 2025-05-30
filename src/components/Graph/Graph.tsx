import React, { useCallback, useMemo, useEffect, useState, useTransition } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
  MiniMap,
  BackgroundVariant,
  MarkerType
} from 'reactflow';
import type { Connection, Edge, DefaultEdgeOptions } from 'reactflow';
import 'reactflow/dist/style.css';

import CustomNode from '../CustomNode.js';
import CustomEdge from '../CustomEdge.js';
import SearchBar from '../SearchBar/SearchBar.js';
import type { JobData, GraphNode, GraphEdge } from '../../types/index.js';
import { parseJobData, type LayoutDirection } from '../../utils/dataParser.js';

interface GraphProps {
  data: JobData[];
}

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

// Performance settings for large graphs
const PERFORMANCE_SETTINGS = {
  nodeCountThreshold: 100, // Show performance options above this node count
  edgeCountThreshold: 500, // Warn about edge count above this
  searchDebounceMs: 300
};

const GraphComponent: React.FC<GraphProps> = ({ data }) => {
  const { fitView, setCenter, getNode } = useReactFlow();
  const [layoutDirection, setLayoutDirection] = useState<LayoutDirection>('TB');
  const [isLoading, setIsLoading] = useState(false);
  const [showEdges, setShowEdges] = useState(true);
  const [showMiniMap, setShowMiniMap] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [, setSelectedEdgeId] = useState<string | null>(null);
  
  // Create a search index for better performance
  const searchIndex = useMemo(() => {
    const index = new Map<string, GraphNode>();
    return index;
  }, []);
  
  const calculateLayout = useCallback((jobData: JobData[], direction: LayoutDirection) => {
    setIsLoading(true);
    // Use setTimeout to allow UI to update before heavy calculation
    return new Promise<{ nodes: GraphNode[]; edges: GraphEdge[] }>((resolve) => {
      setTimeout(() => {
        const result = parseJobData(jobData, direction);
        // Build search index
        result.nodes.forEach(node => {
          searchIndex.set(node.id.toLowerCase(), node);
        });
        setIsLoading(false);
        resolve(result);
      }, 0);
    });
  }, [searchIndex]);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Initial load and layout changes
  useEffect(() => {
    calculateLayout(data, layoutDirection).then((newData) => {
      startTransition(() => {
        setNodes(newData.nodes);
        setEdges(showEdges ? newData.edges : []);
        setTimeout(() => fitView({ padding: 0.1, maxZoom: 1.5 }), 100);
      });
    });
  }, [data, layoutDirection, showEdges, calculateLayout, setNodes, setEdges, fitView]);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Optimized search with debouncing
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  
  const handleSearch = useCallback((searchTerm: string) => {
    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Debounce search
    const timeout = setTimeout(() => {
      if (!searchTerm) {
        // Reset all nodes to default state
        startTransition(() => {
          setNodes((nds) =>
            nds.map((node) => ({
              ...node,
              style: undefined
            }))
          );
        });
        return;
      }

      // Use indexed search for better performance
      const searchLower = searchTerm.toLowerCase();
      let matchingNode: GraphNode | undefined;
      
      // First try exact match
      matchingNode = searchIndex.get(searchLower);
      
      // If no exact match, try partial match
      if (!matchingNode) {
        for (const [key, node] of searchIndex) {
          if (key.includes(searchLower)) {
            matchingNode = node;
            break;
          }
        }
      }

      if (matchingNode) {
        const nodeId = matchingNode.id;
        
        // Highlight the matching node and dim others
        startTransition(() => {
          setNodes((nds) =>
            nds.map((node) => ({
              ...node,
              style: node.id === nodeId
                ? { opacity: 1 }
                : { opacity: 0.3 }
            }))
          );
        });

        // Center the view on the matching node
        const node = getNode(nodeId);
        if (node) {
          setCenter(node.position.x, node.position.y, {
            zoom: 1.5,
            duration: 800
          });
        }
      }
    }, PERFORMANCE_SETTINGS.searchDebounceMs);

    setSearchTimeout(timeout);
  }, [searchIndex, setNodes, setCenter, getNode, searchTimeout]);

  const defaultEdgeOptions: DefaultEdgeOptions = {
    type: 'custom',
    animated: false, // Disable animation for better performance
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: '#64748b',
    },
  };

  // Show performance options for large graphs
  const showPerformanceOptions = data.length > PERFORMANCE_SETTINGS.nodeCountThreshold;

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#0f172a' }}>
      <SearchBar onSearch={handleSearch} />
      
      {/* Loading indicator */}
      {(isLoading || isPending) && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          backgroundColor: '#1e293b',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #334155',
            borderTopColor: '#3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <span style={{ color: '#e2e8f0', fontSize: '14px' }}>
            {isLoading ? 'Calculating layout...' : 'Updating graph...'}
          </span>
        </div>
      )}
      
      {/* Performance options */}
      {showPerformanceOptions && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 5,
          backgroundColor: '#1e293b',
          padding: '12px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}>
            Performance Options ({data.length} nodes)
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e2e8f0', fontSize: '14px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={showEdges}
              onChange={(e) => setShowEdges(e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            Show edges
          </label>
          <div style={{ color: '#64748b', fontSize: '11px', marginTop: '4px' }}>
            Click edges to highlight connections
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e2e8f0', fontSize: '14px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={showMiniMap}
              onChange={(e) => setShowMiniMap(e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            Show minimap
          </label>
        </div>
      )}
      
      {/* Layout Direction Selector */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        zIndex: 5,
        backgroundColor: '#1e293b',
        padding: '12px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        display: 'flex',
        gap: '8px',
        alignItems: 'center'
      }}>
        <span style={{ color: '#94a3b8', fontSize: '14px', marginRight: '8px' }}>Layout:</span>
        <button
          onClick={() => setLayoutDirection('TB')}
          disabled={isLoading || isPending}
          style={{
            padding: '6px 12px',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: layoutDirection === 'TB' ? '#3b82f6' : '#334155',
            color: '#e2e8f0',
            fontSize: '12px',
            cursor: isLoading || isPending ? 'not-allowed' : 'pointer',
            opacity: isLoading || isPending ? 0.5 : 1,
            transition: 'background-color 0.2s'
          }}
        >
          Top-Bottom
        </button>
        <button
          onClick={() => setLayoutDirection('LR')}
          disabled={isLoading || isPending}
          style={{
            padding: '6px 12px',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: layoutDirection === 'LR' ? '#3b82f6' : '#334155',
            color: '#e2e8f0',
            fontSize: '12px',
            cursor: isLoading || isPending ? 'not-allowed' : 'pointer',
            opacity: isLoading || isPending ? 0.5 : 1,
            transition: 'background-color 0.2s'
          }}
        >
          Left-Right
        </button>
        <button
          onClick={() => setLayoutDirection('BT')}
          disabled={isLoading || isPending}
          style={{
            padding: '6px 12px',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: layoutDirection === 'BT' ? '#3b82f6' : '#334155',
            color: '#e2e8f0',
            fontSize: '12px',
            cursor: isLoading || isPending ? 'not-allowed' : 'pointer',
            opacity: isLoading || isPending ? 0.5 : 1,
            transition: 'background-color 0.2s'
          }}
        >
          Bottom-Top
        </button>
        <button
          onClick={() => setLayoutDirection('RL')}
          disabled={isLoading || isPending}
          style={{
            padding: '6px 12px',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: layoutDirection === 'RL' ? '#3b82f6' : '#334155',
            color: '#e2e8f0',
            fontSize: '12px',
            cursor: isLoading || isPending ? 'not-allowed' : 'pointer',
            opacity: isLoading || isPending ? 0.5 : 1,
            transition: 'background-color 0.2s'
          }}
        >
          Right-Left
        </button>
      </div>
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeClick={(_, edge) => {
          setSelectedEdgeId(edge.id);
          // Highlight connected nodes
          startTransition(() => {
            setNodes((nds) =>
              nds.map((node) => ({
                ...node,
                style: node.id === edge.source || node.id === edge.target
                  ? { opacity: 1, filter: 'drop-shadow(0 0 8px #3b82f6)' }
                  : { opacity: 0.3 }
              }))
            );
          });
        }}
        onPaneClick={() => {
          setSelectedEdgeId(null);
          // Reset node highlighting
          startTransition(() => {
            setNodes((nds) =>
              nds.map((node) => ({
                ...node,
                style: undefined
              }))
            );
          });
        }}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        style={{ backgroundColor: '#0f172a' }}
        // Selection
        selectNodesOnDrag={false}
        // Performance optimizations
        minZoom={0.1}
        maxZoom={2}
        nodesDraggable={!isLoading}
        nodesConnectable={false}
        elementsSelectable={!isLoading}
        panOnScroll={true}
        selectionOnDrag={true}
        zoomOnDoubleClick={false}
        attributionPosition="bottom-left"
      >
        <Controls />
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={12} 
          size={1} 
          color="#1e293b"
        />
        {showMiniMap && (
          <MiniMap 
            nodeColor={(node) => node.data.color}
            style={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155'
            }}
            maskColor="#0f172a88"
          />
        )}
      </ReactFlow>
      
      {/* Add spin animation */}
      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
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