import ELK from 'elkjs/lib/elk.bundled.js';
import { MarkerType } from 'reactflow';
import type { JobData, GraphNode, GraphEdge } from '../types/index.js';

const elk = new ELK();

const nodeWidth = 172;
const nodeHeight = 36;

export type LayoutDirection = 'TB' | 'BT' | 'LR' | 'RL';

export type LayoutAlgorithm = 'layered' | 'force' | 'stress' | 'mrtree' | 'radial' | 'disco' | 'sporeOverlap' | 'sporeCompaction';

export interface LayoutOptions {
  direction?: LayoutDirection;
  algorithm?: LayoutAlgorithm;
  spacing?: number;
  edgeRouting?: 'POLYLINE' | 'ORTHOGONAL' | 'SPLINES';
}

export async function parseJobData(
  data: JobData[], 
  options: LayoutOptions = {}
): Promise<{ nodes: GraphNode[]; edges: GraphEdge[] }> {
  const {
    direction = 'TB',
    algorithm = 'layered',
    spacing = 50,
    edgeRouting = 'ORTHOGONAL'
  } = options;
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  
  // Map direction to ELK format
  const elkDirection = {
    'TB': 'DOWN',
    'BT': 'UP',
    'LR': 'RIGHT',
    'RL': 'LEFT'
  }[direction];

  // Create ELK nodes
  const elkNodes = data.map((job) => ({
    id: job.job,
    width: nodeWidth,
    height: nodeHeight,
    labels: [{ text: job.job }],
    layoutOptions: {
      'nodeLabels.placement': '[H_CENTER, V_CENTER, INSIDE]'
    }
  }));

  // Create ELK edges
  const elkEdges: any[] = [];
  data.forEach((job) => {
    job.dependencies.forEach((dep) => {
      if (data.some(j => j.job === dep)) {
        elkEdges.push({
          id: `${dep}-${job.job}`,
          sources: [dep],
          targets: [job.job]
        });
      }
    });
  });

  // Configure layout options based on algorithm
  const layoutOptions: any = {
    'elk.algorithm': algorithm,
    'elk.direction': elkDirection,
    'elk.spacing.nodeNode': spacing,
    'elk.spacing.edgeNode': spacing * 0.5,
    'elk.layered.spacing.nodeNodeBetweenLayers': spacing * 1.5,
    'elk.edgeRouting': edgeRouting,
  };

  // Algorithm-specific options
  if (algorithm === 'layered') {
    layoutOptions['elk.layered.thoroughness'] = 7;
    layoutOptions['elk.layered.nodePlacement.strategy'] = 'NETWORK_SIMPLEX';
    layoutOptions['elk.layered.crossingMinimization.strategy'] = 'LAYER_SWEEP';
  } else if (algorithm === 'force') {
    layoutOptions['elk.force.iterations'] = 300;
    layoutOptions['elk.force.repulsivePower'] = 2;
  } else if (algorithm === 'stress') {
    layoutOptions['elk.stress.desiredEdgeLength'] = spacing * 2;
  } else if (algorithm === 'mrtree') {
    layoutOptions['elk.mrtree.searchOrder'] = 'DFS';
  }

  // Create the graph structure for ELK
  const graph = {
    id: 'root',
    layoutOptions,
    children: elkNodes,
    edges: elkEdges
  };

  try {
    // Run the layout algorithm
    const layoutedGraph = await elk.layout(graph);

    // Create React Flow nodes from ELK results
    layoutedGraph.children?.forEach((elkNode) => {
      const jobData = data.find(j => j.job === elkNode.id)!;
      nodes.push({
        id: elkNode.id,
        type: 'custom',
        data: {
          label: jobData.job,
          sources: jobData.sources,
          targets: jobData.targets,
          color: jobData.color || '#6366f1'
        },
        position: { x: elkNode.x || 0, y: elkNode.y || 0 }
      });
    });

    // Create React Flow edges
    elkEdges.forEach((elkEdge) => {
      edges.push({
        id: elkEdge.id,
        source: elkEdge.sources[0],
        target: elkEdge.targets[0],
        type: 'custom',
        animated: false,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: '#64748b',
        }
      });
    });

    return { nodes, edges };
  } catch (error) {
    console.error('Layout failed:', error);
    // Fallback to simple grid layout
    const cols = Math.ceil(Math.sqrt(data.length));
    data.forEach((job, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      nodes.push({
        id: job.job,
        type: 'custom',
        data: {
          label: job.job,
          sources: job.sources,
          targets: job.targets,
          color: job.color || '#6366f1'
        },
        position: {
          x: col * (nodeWidth + spacing),
          y: row * (nodeHeight + spacing)
        }
      });
    });

    // Still create edges
    data.forEach((job) => {
      job.dependencies.forEach((dep) => {
        if (data.some(j => j.job === dep)) {
          edges.push({
            id: `${dep}-${job.job}`,
            source: dep,
            target: job.job,
            type: 'custom',
            animated: false,
            markerEnd: {
              type: MarkerType.ArrowClosed,
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
}