import type { JobData } from '../types/index.js';

export async function loadDataFromFile(file: File): Promise<JobData[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const data = JSON.parse(text);
        
        // Validate the data structure
        if (Array.isArray(data)) {
          // Array of job objects
          const validData = data.filter(item => 
            item.job && 
            Array.isArray(item.dependencies) &&
            Array.isArray(item.sources) &&
            Array.isArray(item.targets)
          );
          resolve(validData);
        } else if (data.job) {
          // Single job object
          resolve([data]);
        } else {
          reject(new Error('Invalid JSON structure'));
        }
      } catch (error) {
        reject(new Error('Failed to parse JSON file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
}