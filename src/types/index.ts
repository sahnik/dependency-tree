import type { Edge } from 'reactflow';

export interface JobData {
  job: string;
  dependencies: string[];
  sources: string[];
  targets: string[];
  color: string;
}

export interface GraphNode {
  id: string;
  type?: string;
  data: {
    label: string;
    sources: string[];
    targets: string[];
    color: string;
  };
  position: { x: number; y: number };
}

// Use ReactFlow's Edge type instead of custom GraphEdge
export type GraphEdge = Edge;