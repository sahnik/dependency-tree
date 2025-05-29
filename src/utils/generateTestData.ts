import type { JobData } from '../types/index.js';

/**
 * Generates test data for performance testing
 * Creates a hierarchical dependency structure with multiple layers
 */
export function generateTestData(nodeCount: number): JobData[] {
  const data: JobData[] = [];
  const colors = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // amber
    '#8b5cf6', // violet
    '#ef4444', // red
    '#06b6d4', // cyan
    '#ec4899', // pink
    '#14b8a6', // teal
  ];
  
  // Calculate optimal layer distribution
  const layers = Math.ceil(Math.log2(nodeCount));
  const nodesPerLayer = Math.ceil(nodeCount / layers);
  
  let nodeIndex = 0;
  
  // Generate nodes layer by layer
  for (let layer = 0; layer < layers && nodeIndex < nodeCount; layer++) {
    const layerNodeCount = Math.min(nodesPerLayer, nodeCount - nodeIndex);
    const prevLayerStart = Math.max(0, nodeIndex - nodesPerLayer);
    const prevLayerEnd = nodeIndex;
    
    for (let i = 0; i < layerNodeCount && nodeIndex < nodeCount; i++) {
      const dependencies: string[] = [];
      
      // Add dependencies from previous layer (except for first layer)
      if (layer > 0) {
        // Each node depends on 1-3 nodes from previous layer
        const depCount = Math.min(3, prevLayerEnd - prevLayerStart);
        const selectedDeps = new Set<number>();
        
        for (let d = 0; d < depCount; d++) {
          let depIndex;
          do {
            depIndex = prevLayerStart + Math.floor(Math.random() * (prevLayerEnd - prevLayerStart));
          } while (selectedDeps.has(depIndex));
          
          selectedDeps.add(depIndex);
          dependencies.push(`Job-${depIndex}`);
        }
      }
      
      data.push({
        job: `Job-${nodeIndex}`,
        dependencies,
        sources: [`source-${nodeIndex}-a`, `source-${nodeIndex}-b`],
        targets: [`target-${nodeIndex}-a`, `target-${nodeIndex}-b`],
        color: colors[layer % colors.length]
      });
      
      nodeIndex++;
    }
  }
  
  return data;
}

/**
 * Generates a more realistic test scenario with named stages
 */
export function generateRealisticTestData(scale: number = 1): JobData[] {
  const stages = [
    { name: 'Data Ingestion', prefix: 'ingest', color: '#0ea5e9' },
    { name: 'Validation', prefix: 'validate', color: '#8b5cf6' },
    { name: 'Transform', prefix: 'transform', color: '#10b981' },
    { name: 'Aggregate', prefix: 'aggregate', color: '#f59e0b' },
    { name: 'ML Processing', prefix: 'ml', color: '#ec4899' },
    { name: 'Export', prefix: 'export', color: '#3b82f6' },
    { name: 'Notify', prefix: 'notify', color: '#06b6d4' }
  ];
  
  const data: JobData[] = [];
  
  stages.forEach((stage, stageIndex) => {
    const jobCount = Math.ceil(scale * (10 + Math.random() * 20));
    
    for (let i = 0; i < jobCount; i++) {
      const dependencies: string[] = [];
      
      // Add dependencies from previous stage
      if (stageIndex > 0) {
        const prevStage = stages[stageIndex - 1];
        const depCount = Math.min(3, Math.ceil(Math.random() * 3));
        
        for (let d = 0; d < depCount; d++) {
          const depIndex = Math.floor(Math.random() * 10);
          dependencies.push(`${prevStage.prefix}_job_${depIndex}`);
        }
      }
      
      data.push({
        job: `${stage.prefix}_job_${i}`,
        dependencies,
        sources: [`${stage.prefix}/input/${i}`, `config/${stage.prefix}.json`],
        targets: [`${stage.prefix}/output/${i}`, `logs/${stage.prefix}_${i}.log`],
        color: stage.color
      });
    }
  });
  
  return data;
}