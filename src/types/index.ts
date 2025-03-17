import { NavigationProp } from '@react-navigation/native';

export type ModelQuantization = 'F32' | 'F16' | 'Q8' | 'Q6' | 'Q5' | 'Q4' | 'Q3' | 'Q2' | 'GPTQ' | 'AWQ';
export type KvCacheQuantization = 'F32' | 'F16' | 'Q8' | 'Q5' | 'Q4';
export type MemoryMode = 'DISCRETE_GPU' | 'UNIFIED_MEMORY';
export type BackgroundStyle = 'tiny' | 'small' | 'medium' | 'large' | 'xlarge' | 'massive';
export type UtilizationClass = 'low' | 'medium' | 'high' | 'extreme';

export interface Recommendation {
  gpuType: string;
  vramNeeded: string;
  fitsUnified: boolean;
  systemRamNeeded: number;
  gpusRequired: number;
}

export type RootStackParamList = {
  Welcome: undefined;
  Calculator: undefined;
  Results: undefined;
};

export type NavigationProps = {
  navigation: NavigationProp<RootStackParamList>;
};

export type TabBarIconProps = {
  focused: boolean;
  color: string;
  size: number;
};

export interface AppState {
  params: number;
  modelQuant: ModelQuantization;
  useKvCache: boolean;
  kvCacheQuant: KvCacheQuantization;
  contextLength: number;
  memoryMode: MemoryMode;
  systemMemory: number;
  gpuVram: number;
  backgroundStyle: BackgroundStyle;
} 