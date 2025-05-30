import type { JobData } from '../types/index.js';

export function generateSimpleTestData(): JobData[] {
  return [
    {
      job: 'data-ingestion',
      dependencies: [],
      sources: ['api-gateway', 'file-system'],
      targets: ['raw-data-lake'],
      color: '#6366f1'
    },
    {
      job: 'data-validation',
      dependencies: ['data-ingestion'],
      sources: ['raw-data-lake'],
      targets: ['validated-data'],
      color: '#8b5cf6'
    },
    {
      job: 'data-transformation',
      dependencies: ['data-validation'],
      sources: ['validated-data'],
      targets: ['transformed-data'],
      color: '#ec4899'
    },
    {
      job: 'feature-engineering',
      dependencies: ['data-transformation'],
      sources: ['transformed-data'],
      targets: ['feature-store'],
      color: '#ef4444'
    },
    {
      job: 'model-training',
      dependencies: ['feature-engineering'],
      sources: ['feature-store'],
      targets: ['model-registry'],
      color: '#f59e0b'
    },
    {
      job: 'model-evaluation',
      dependencies: ['model-training'],
      sources: ['model-registry', 'test-data'],
      targets: ['evaluation-metrics'],
      color: '#10b981'
    },
    {
      job: 'model-deployment',
      dependencies: ['model-evaluation'],
      sources: ['model-registry', 'evaluation-metrics'],
      targets: ['production-endpoint'],
      color: '#3b82f6'
    }
  ];
}

export function generateComplexTestData(nodeCount: number = 50): JobData[] {
  const jobs: JobData[] = [];
  const colors = [
    '#6366f1', // Indigo
    '#8b5cf6', // Purple
    '#ec4899', // Pink
    '#ef4444', // Red
    '#f59e0b', // Amber
    '#10b981', // Emerald
    '#14b8a6', // Teal
    '#3b82f6', // Blue
  ];

  // Create nodes
  for (let i = 0; i < nodeCount; i++) {
    jobs.push({
      job: `job-${i}`,
      dependencies: [],
      sources: [`source-${i}-1`, `source-${i}-2`],
      targets: [`target-${i}-1`, `target-${i}-2`, `target-${i}-3`],
      color: colors[i % colors.length]
    });
  }

  // Create dependencies to form a complex DAG
  // Create layers
  const layers = Math.ceil(Math.sqrt(nodeCount));
  const nodesPerLayer = Math.ceil(nodeCount / layers);

  for (let i = 0; i < nodeCount; i++) {
    const currentLayer = Math.floor(i / nodesPerLayer);
    
    if (currentLayer < layers - 1) {
      // Connect to 1-3 nodes in the next layer
      const connectionsCount = Math.floor(Math.random() * 3) + 1;
      const nextLayerStart = (currentLayer + 1) * nodesPerLayer;
      const nextLayerEnd = Math.min(nextLayerStart + nodesPerLayer, nodeCount);
      
      const connections = new Set<number>();
      while (connections.size < connectionsCount && nextLayerStart < nextLayerEnd) {
        const targetIdx = Math.floor(Math.random() * (nextLayerEnd - nextLayerStart)) + nextLayerStart;
        if (targetIdx < nodeCount) {
          connections.add(targetIdx);
        }
      }
      
      connections.forEach(targetIdx => {
        jobs[targetIdx].dependencies.push(`job-${i}`);
      });
    }

    // Add some cross-layer connections for complexity
    if (currentLayer < layers - 2 && Math.random() > 0.7) {
      const skipLayer = currentLayer + 2;
      const skipLayerStart = skipLayer * nodesPerLayer;
      if (skipLayerStart < nodeCount) {
        const targetIdx = Math.min(skipLayerStart + Math.floor(Math.random() * nodesPerLayer), nodeCount - 1);
        jobs[targetIdx].dependencies.push(`job-${i}`);
      }
    }
  }

  return jobs;
}

export function generateTreeTestData(nodeCount: number = 100, branchingFactor: number = 3): JobData[] {
  const jobs: JobData[] = [];
  const colors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#ef4444', 
    '#f59e0b', '#10b981', '#14b8a6', '#3b82f6'
  ];

  // Create all nodes first
  for (let i = 0; i < nodeCount; i++) {
    jobs.push({
      job: `node-${i}`,
      dependencies: [],
      sources: [`src-${i}`],
      targets: [`tgt-${i}`],
      color: colors[Math.floor(i / (nodeCount / colors.length))]
    });
  }

  // Create tree structure
  for (let i = 0; i < nodeCount; i++) {
    const childStart = i * branchingFactor + 1;
    const childEnd = Math.min(childStart + branchingFactor, nodeCount);
    
    for (let j = childStart; j < childEnd; j++) {
      jobs[j].dependencies.push(`node-${i}`);
    }
  }

  return jobs;
}

export function generateNetworkTestData(nodeCount: number = 100, connectivity: number = 0.1): JobData[] {
  const jobs: JobData[] = [];
  const colors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#ef4444', 
    '#f59e0b', '#10b981', '#14b8a6', '#3b82f6'
  ];

  // Create nodes in clusters
  const clusterCount = Math.ceil(Math.sqrt(nodeCount / 4));
  const nodesPerCluster = Math.ceil(nodeCount / clusterCount);

  for (let i = 0; i < nodeCount; i++) {
    const cluster = Math.floor(i / nodesPerCluster);
    jobs.push({
      job: `node-${i}`,
      dependencies: [],
      sources: [`cluster-${cluster}-src`],
      targets: [`cluster-${cluster}-tgt`],
      color: colors[cluster % colors.length]
    });
  }

  // Create connections
  for (let i = 0; i < nodeCount; i++) {
    const cluster = Math.floor(i / nodesPerCluster);
    
    // Intra-cluster connections (higher probability)
    const clusterStart = cluster * nodesPerCluster;
    const clusterEnd = Math.min(clusterStart + nodesPerCluster, nodeCount);
    
    for (let j = clusterStart; j < clusterEnd; j++) {
      if (i !== j && Math.random() < connectivity * 2) {
        // Avoid cycles by only connecting to higher indices
        if (j > i) {
          jobs[j].dependencies.push(`node-${i}`);
        }
      }
    }
    
    // Inter-cluster connections (lower probability)
    for (let j = 0; j < nodeCount; j++) {
      const otherCluster = Math.floor(j / nodesPerCluster);
      if (otherCluster !== cluster && Math.random() < connectivity / 2) {
        // Avoid cycles
        if (j > i) {
          jobs[j].dependencies.push(`node-${i}`);
        }
      }
    }
  }

  return jobs;
}

export function generatePipelineTestData(stages: number = 5, jobsPerStage: number = 4): JobData[] {
  const jobs: JobData[] = [];
  const colors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#ef4444', 
    '#f59e0b', '#10b981', '#14b8a6', '#3b82f6'
  ];

  const stageNames = [
    'ingestion', 'validation', 'transformation', 'aggregation', 
    'enrichment', 'analysis', 'reporting', 'export'
  ];

  // Create stages
  for (let stage = 0; stage < stages; stage++) {
    const stageName = stageNames[stage % stageNames.length];
    
    for (let j = 0; j < jobsPerStage; j++) {
      const jobName = `${stageName}-job-${j}`;
      const job: JobData = {
        job: jobName,
        dependencies: [],
        sources: [`${stageName}-source-${j}`],
        targets: [`${stageName}-output-${j}`],
        color: colors[stage % colors.length]
      };

      // Connect to previous stage
      if (stage > 0) {
        const prevStageName = stageNames[(stage - 1) % stageNames.length];
        // Connect to 1-2 jobs from previous stage
        const connections = Math.floor(Math.random() * 2) + 1;
        for (let k = 0; k < connections; k++) {
          const prevJob = Math.floor(Math.random() * jobsPerStage);
          job.dependencies.push(`${prevStageName}-job-${prevJob}`);
        }
      }

      jobs.push(job);
    }
  }

  return jobs;
}