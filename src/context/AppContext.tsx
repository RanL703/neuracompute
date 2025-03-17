import React, { createContext, useContext, useState } from 'react';
import { AppState } from '../types';

interface AppContextType {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    params: 65,
    modelQuant: 'Q4',
    useKvCache: true,
    kvCacheQuant: 'F16',
    contextLength: 4096,
    memoryMode: 'DISCRETE_GPU',
    systemMemory: 128,
    gpuVram: 24,
    backgroundStyle: 'medium'
  });

  return (
    <AppContext.Provider value={{ state, setState }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}; 