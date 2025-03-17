import { AppState, ModelQuantization, KvCacheQuantization, Recommendation, UtilizationClass } from '../types';

export const getModelQuantFactor = (q: ModelQuantization): number => {
  switch (q) {
    case 'F32': return 4.0;
    case 'F16': return 2.0;
    case 'Q8': return 1.0;
    case 'Q6': return 0.75;
    case 'Q5': return 0.625;
    case 'Q4': return 0.5;
    case 'Q3': return 0.375;
    case 'Q2': return 0.25;
    case 'GPTQ': return 0.4;
    case 'AWQ': return 0.35;
    default: return 1.0;
  }
};

export const getKvCacheQuantFactor = (k: KvCacheQuantization): number => {
  switch (k) {
    case 'F32': return 4.0;
    case 'F16': return 2.0;
    case 'Q8': return 1.0;
    case 'Q5': return 0.625;
    case 'Q4': return 0.5;
    default: return 1.0;
  }
};

export const calculateRequiredVram = (state: AppState): number => {
  // Model memory
  const modelFactor = getModelQuantFactor(state.modelQuant);
  const baseModelMem = state.params * modelFactor;

  // Context scaling
  let contextScale = state.contextLength / 2048;
  if (contextScale < 1) contextScale = 1;
  const modelMem = baseModelMem * contextScale;

  // KV cache memory
  let kvCacheMem = 0;
  if (state.useKvCache) {
    const kvFactor = getKvCacheQuantFactor(state.kvCacheQuant);
    const alpha = 0.2; // KV overhead fraction
    kvCacheMem = state.params * kvFactor * contextScale * alpha;
  }

  return modelMem + kvCacheMem;
};

export const getMaxUnifiedVram = (memGB: number): number => memGB * 0.75;

export const calculateHardwareRecommendation = (state: AppState): Recommendation => {
  const requiredVram = calculateRequiredVram(state);
  const recSystemMemory = state.systemMemory;

  if (state.memoryMode === 'UNIFIED_MEMORY') {
    const unifiedLimit = getMaxUnifiedVram(recSystemMemory);
    if (requiredVram <= unifiedLimit) {
      return {
        gpuType: 'Unified memory (ex: Apple silicon, AMD Ryzen™ Al Max+ 395)',
        vramNeeded: requiredVram.toFixed(1),
        fitsUnified: true,
        systemRamNeeded: recSystemMemory,
        gpusRequired: 1,
      };
    } else {
      return {
        gpuType: 'Unified memory (insufficient)',
        vramNeeded: requiredVram.toFixed(1),
        fitsUnified: false,
        systemRamNeeded: recSystemMemory,
        gpusRequired: 0,
      };
    }
  }

  // Discrete GPU
  const singleGpuVram = state.gpuVram;
  if (requiredVram <= singleGpuVram) {
    return {
      gpuType: `Single ${singleGpuVram}GB GPU`,
      vramNeeded: requiredVram.toFixed(1),
      fitsUnified: false,
      systemRamNeeded: Math.max(recSystemMemory, requiredVram),
      gpusRequired: 1,
    };
  } else {
    // multiple GPUs
    const count = Math.ceil(requiredVram / singleGpuVram);
    return {
      gpuType: `Discrete GPUs (${singleGpuVram}GB each)`,
      vramNeeded: requiredVram.toFixed(1),
      fitsUnified: false,
      systemRamNeeded: Math.max(recSystemMemory, requiredVram),
      gpusRequired: count,
    };
  }
};

export const calculateOnDiskSize = (state: AppState): number => {
  let bitsPerParam: number;
  switch (state.modelQuant) {
    case 'F32': bitsPerParam = 32; break;
    case 'F16': bitsPerParam = 16; break;
    case 'Q8': bitsPerParam = 8; break;
    case 'Q6': bitsPerParam = 6; break;
    case 'Q5': bitsPerParam = 5; break;
    case 'Q4': bitsPerParam = 4; break;
    case 'Q3': bitsPerParam = 3; break;
    case 'Q2': bitsPerParam = 2; break;
    case 'GPTQ': bitsPerParam = 4; break;
    case 'AWQ': bitsPerParam = 4; break;
    default: bitsPerParam = 8; break;
  }

  const totalBits = state.params * 1e9 * bitsPerParam;
  const bytes = totalBits / 8;
  const gigabytes = bytes / 1e9;
  const overheadFactor = 1.1; // ~10% overhead
  return gigabytes * overheadFactor;
};

export const getUtilizationClass = (utilizationPercentage: number): UtilizationClass => {
  if (utilizationPercentage < 50) return 'low';
  if (utilizationPercentage < 75) return 'medium';
  if (utilizationPercentage < 90) return 'high';
  return 'extreme';
}; 