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

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
}