import type { JobData, GraphNode, GraphEdge } from '../types/index.js';

export function parseJobData(data: JobData[]): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const nodePositions = new Map<string, { x: number; y: number }>();

  // Create nodes
  data.forEach((job, index) => {
    const angle = (index * 2 * Math.PI) / data.length;
    const radius = 300;
    const x = Math.cos(angle) * radius + 400;
    const y = Math.sin(angle) * radius + 300;

    nodePositions.set(job.job, { x, y });

    nodes.push({
      id: job.job,
      type: 'custom',
      data: {
        label: job.job,
        sources: job.sources,
        targets: job.targets,
        color: job.color || '#6366f1'
      },
      position: { x, y }
    });
  });

  // Create edges based on dependencies
  data.forEach((job) => {
    job.dependencies.forEach((dep) => {
      if (nodePositions.has(dep)) {
        edges.push({
          id: `${dep}-${job.job}`,
          source: dep,
          target: job.job,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#64748b', strokeWidth: 2 },
          markerEnd: {
            type: 'arrowclosed',
            width: 20,
            height: 20,
            color: '#64748b',
          }
        });
      }
    });
  });

  return { nodes, edges };
}

export function layoutNodes(nodes: GraphNode[]): GraphNode[] {
  // Simple circular layout
  const radius = 300;
  const centerX = 400;
  const centerY = 300;

  return nodes.map((node, index) => {
    const angle = (index * 2 * Math.PI) / nodes.length;
    return {
      ...node,
      position: {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      }
    };
  });
}