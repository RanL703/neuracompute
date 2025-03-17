import React, { useMemo } from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProps } from '../types';
import { styles } from '../styles/styles';
import { useAppContext } from '../context/AppContext';
import {
  calculateHardwareRecommendation,
  calculateOnDiskSize,
  calculateRequiredVram,
  getMaxUnifiedVram,
  getUtilizationClass
} from '../utils/calculations';

export const ResultsScreen: React.FC<NavigationProps> = () => {
  const { state } = useAppContext();
  
  // Calculate recommendation
  const recommendation = useMemo(() => calculateHardwareRecommendation(state), [state]);
  const onDiskSize = useMemo(() => calculateOnDiskSize(state), [state]);
  const vramNeeded = parseFloat(recommendation.vramNeeded);
  const utilizationPercentage = state.memoryMode === 'DISCRETE_GPU' 
    ? (vramNeeded / state.gpuVram) * 100 
    : (vramNeeded / getMaxUnifiedVram(state.systemMemory)) * 100;
  const utilizationClass = getUtilizationClass(utilizationPercentage);

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#1e293b', '#0f172a']}
        style={styles.gradientBackground}
      >
        <View style={styles.content}>
          {/* Hardware Requirements */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hardware Requirements</Text>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="hardware-chip" size={24} color="#3b82f6" />
                <Text style={styles.cardTitle}>System Configuration</Text>
              </View>
              
              {/* VRAM Utilization */}
              <View style={styles.utilizationContainer}>
                <View style={styles.utilizationHeader}>
                  <Text style={styles.utilizationLabel}>VRAM Needed</Text>
                  <Text style={styles.utilizationValue}>{vramNeeded.toFixed(1)} GB</Text>
                </View>
                <View style={styles.utilizationBarContainer}>
                  <View 
                    style={[
                      styles.utilizationBar,
                      styles[`utilization${utilizationClass}`],
                      { width: `${Math.min(utilizationPercentage, 100)}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.utilizationPercentage}>
                  {utilizationPercentage.toFixed(1)}% Utilization
                </Text>
              </View>

              {/* Storage Requirements */}
              <View style={styles.storageContainer}>
                <Text style={styles.storageLabel}>On-disk Size</Text>
                <Text style={styles.storageValue}>{onDiskSize.toFixed(1)} GB</Text>
              </View>

              {/* GPU Configuration */}
              <View style={styles.gpuContainer}>
                <Text style={styles.gpuLabel}>GPU Configuration</Text>
                <Text style={styles.gpuValue}>
                  {recommendation.gpuType}
                  {recommendation.gpusRequired > 1 && ` (${recommendation.gpusRequired}x)`}
                </Text>
              </View>

              {/* System Memory */}
              <View style={styles.memoryContainer}>
                <Text style={styles.memoryLabel}>System Memory</Text>
                <Text style={styles.memoryValue}>
                  {recommendation.systemRamNeeded.toFixed(1)} GB Required
                </Text>
              </View>

              {/* Unified Memory Status */}
              {state.memoryMode === 'UNIFIED_MEMORY' && (
                <View style={[
                  styles.statusBox,
                  recommendation.fitsUnified ? styles.statusSuccess : styles.statusWarning
                ]}>
                  <Text style={recommendation.fitsUnified ? styles.statusTextSuccess : styles.statusTextWarning}>
                    {recommendation.fitsUnified 
                      ? 'Model fits in unified memory'
                      : 'Model exceeds unified memory capacity'}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}; 