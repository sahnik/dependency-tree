import dagre from 'dagre';
import { MarkerType } from 'reactflow';
import type { JobData, GraphNode, GraphEdge } from '../types/index.js';

const nodeWidth = 172;
const nodeHeight = 36;

export type LayoutDirection = 'TB' | 'BT' | 'LR' | 'RL';

export function parseJobData(
  data: JobData[], 
  direction: LayoutDirection = 'TB'
): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  
  // Create a new directed graph
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  // Set graph options
  dagreGraph.setGraph({
    rankdir: direction,
    align: 'UL',
    nodesep: 50,
    ranksep: 50,
    marginx: 20,
    marginy: 20
  });

  // Create nodes and add them to the dagre graph
  data.forEach((job) => {
    const node: GraphNode = {
      id: job.job,
      type: 'custom',
      data: {
        label: job.job,
        sources: job.sources,
        targets: job.targets,
        color: job.color || '#6366f1'
      },
      position: { x: 0, y: 0 } // Will be updated by dagre
    };
    
    nodes.push(node);
    dagreGraph.setNode(job.job, { width: nodeWidth, height: nodeHeight });
  });

  // Create edges and add them to the dagre graph
  data.forEach((job) => {
    job.dependencies.forEach((dep) => {
      // Check if the dependency exists as a node
      if (data.some(j => j.job === dep)) {
        edges.push({
          id: `${dep}-${job.job}`,
          source: dep,
          target: job.job,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#64748b', strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: '#64748b',
          }
        });
        
        dagreGraph.setEdge(dep, job.job);
      }
    });
  });

  // Run the layout algorithm
  dagre.layout(dagreGraph);

  // Update node positions with the calculated layout
  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2
    };
  });

  return { nodes, edges };
}