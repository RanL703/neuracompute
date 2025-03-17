import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  StyleSheet, 
  SafeAreaView, 
  Text, 
  View, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Switch,
  Platform,
  StatusBar as RNStatusBar,
  Animated,
  Dimensions
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';

// Define types
type MemoryMode = 'DISCRETE_GPU' | 'UNIFIED_MEMORY';
type ModelQuantization = 'F32' | 'F16' | 'Q8' | 'Q6' | 'Q5' | 'Q4' | 'Q3' | 'Q2' | 'GPTQ' | 'AWQ';
type KvCacheQuantization = 'F32' | 'F16' | 'Q8' | 'Q5' | 'Q4';
type BackgroundStyle = 'tiny' | 'small' | 'medium' | 'large' | 'xlarge' | 'massive';
type UtilizationClass = 'low' | 'medium' | 'high' | 'extreme';

// Define style keys for TypeScript
type StyleKeys = keyof typeof styles;

interface Recommendation {
  gpuType: string;
  vramNeeded: string;
  fitsUnified: boolean;
  systemRamNeeded: number;
  gpusRequired: number;
}

// Get screen dimensions
const { width, height } = Dimensions.get('window');

export default function App() {
  // State
  const [showWelcome, setShowWelcome] = useState(true);
  const [params, setParams] = useState<number>(65);
  const [modelQuant, setModelQuant] = useState<ModelQuantization>('Q4');
  const [useKvCache, setUseKvCache] = useState<boolean>(true);
  const [kvCacheQuant, setKvCacheQuant] = useState<KvCacheQuantization>('F16');
  const [contextLength, setContextLength] = useState<number>(4096);
  const [memoryMode, setMemoryMode] = useState<MemoryMode>('DISCRETE_GPU');
  const [systemMemory, setSystemMemory] = useState<number>(128);
  const [gpuVram, setGpuVram] = useState<number>(24);
  const [backgroundStyle, setBackgroundStyle] = useState<BackgroundStyle>('medium');

  // Animated values for orbs
  const orb1Position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const orb2Position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const orb3Position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const orbOpacity = useRef(new Animated.Value(0.6)).current;

  // Animate orbs
  useEffect(() => {
    if (showWelcome) {
      // Animate orb positions
      Animated.loop(
        Animated.sequence([
          Animated.timing(orb1Position, {
            toValue: { x: 50, y: 30 },
            duration: 15000,
            useNativeDriver: false,
          }),
          Animated.timing(orb1Position, {
            toValue: { x: 0, y: 0 },
            duration: 15000,
            useNativeDriver: false,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(orb2Position, {
            toValue: { x: -40, y: 60 },
            duration: 18000,
            useNativeDriver: false,
          }),
          Animated.timing(orb2Position, {
            toValue: { x: 0, y: 0 },
            duration: 18000,
            useNativeDriver: false,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(orb3Position, {
            toValue: { x: 30, y: -40 },
            duration: 12000,
            useNativeDriver: false,
          }),
          Animated.timing(orb3Position, {
            toValue: { x: 0, y: 0 },
            duration: 12000,
            useNativeDriver: false,
          }),
        ])
      ).start();

      // Animate orb opacity
      Animated.loop(
        Animated.sequence([
          Animated.timing(orbOpacity, {
            toValue: 0.8,
            duration: 5000,
            useNativeDriver: false,
          }),
          Animated.timing(orbOpacity, {
            toValue: 0.4,
            duration: 5000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    }
  }, [showWelcome]);

  // Helper functions
  const getModelQuantFactor = (q: ModelQuantization): number => {
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

  const getKvCacheQuantFactor = (k: KvCacheQuantization): number => {
    switch (k) {
      case 'F32': return 4.0;
      case 'F16': return 2.0;
      case 'Q8': return 1.0;
      case 'Q5': return 0.625;
      case 'Q4': return 0.5;
      default: return 1.0;
    }
  };

  const calculateRequiredVram = (): number => {
    // Model memory
    const modelFactor = getModelQuantFactor(modelQuant);
    const baseModelMem = params * modelFactor;

    // Context scaling
    let contextScale = contextLength / 2048;
    if (contextScale < 1) contextScale = 1;
    const modelMem = baseModelMem * contextScale;

    // KV cache memory
    let kvCacheMem = 0;
    if (useKvCache) {
      const kvFactor = getKvCacheQuantFactor(kvCacheQuant);
      const alpha = 0.2; // KV overhead fraction
      kvCacheMem = params * kvFactor * contextScale * alpha;
    }

    return modelMem + kvCacheMem;
  };

  const getMaxUnifiedVram = (memGB: number): number => memGB * 0.75;

  const calculateHardwareRecommendation = (): Recommendation => {
    const requiredVram = calculateRequiredVram();
    const recSystemMemory = systemMemory;

    if (memoryMode === 'UNIFIED_MEMORY') {
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
    const singleGpuVram = gpuVram;
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

  const calculateOnDiskSize = (): number => {
    let bitsPerParam: number;
    switch (modelQuant) {
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

    const totalBits = params * 1e9 * bitsPerParam;
    const bytes = totalBits / 8;
    const gigabytes = bytes / 1e9;
    const overheadFactor = 1.1; // ~10% overhead
    return gigabytes * overheadFactor;
  };

  const getUtilizationClass = (utilizationPercentage: number): string => {
    if (utilizationPercentage < 50) return 'low';
    if (utilizationPercentage < 75) return 'medium';
    if (utilizationPercentage < 90) return 'high';
    return 'extreme';
  };

  // Calculate complexity and update background style
  const calculateComplexity = useMemo(() => {
    // Base score from parameter count
    let baseScore = params;
    
    // Adjust for quantization
    const quantMultiplier = getModelQuantFactor(modelQuant) / 4.0;
    baseScore *= quantMultiplier;
    
    // Adjust for context length
    const contextFactor = contextLength / 2048;
    baseScore *= Math.max(1, contextFactor);
    
    // Add KV cache complexity if enabled
    if (useKvCache) {
      const kvFactor = getKvCacheQuantFactor(kvCacheQuant);
      baseScore *= (1 + 0.2 * kvFactor);
    }
    
    return baseScore;
  }, [params, modelQuant, contextLength, useKvCache, kvCacheQuant]);

  // Update background style based on complexity
  useEffect(() => {
    if (calculateComplexity <= 15) {
      setBackgroundStyle('tiny');
    } else if (calculateComplexity <= 32) {
      setBackgroundStyle('small');
    } else if (calculateComplexity <= 70) {
      setBackgroundStyle('medium');
    } else if (calculateComplexity <= 200) {
      setBackgroundStyle('large');
    } else if (calculateComplexity <= 500) {
      setBackgroundStyle('xlarge');
    } else {
      setBackgroundStyle('massive');
    }
  }, [calculateComplexity]);

  // Calculate recommendation
  const recommendation = calculateHardwareRecommendation();
  const onDiskSize = calculateOnDiskSize();
  const vramNeeded = parseFloat(recommendation.vramNeeded);
  const utilizationPercentage = (vramNeeded / gpuVram) * 100;
  const utilizationClass = getUtilizationClass(utilizationPercentage);

  // Welcome screen
  if (showWelcome) {
    // Get gradient colors based on background style
    const getGradientColors = () => {
      switch (backgroundStyle) {
        case 'tiny':
          return ['#10b981', '#065f46'] as const;
        case 'small':
          return ['#3b82f6', '#1e40af'] as const;
        case 'medium':
          return ['#2563eb', '#1e3a8a'] as const;
        case 'large':
          return ['#f59e0b', '#d97706'] as const;
        case 'xlarge':
          return ['#ea580c', '#c2410c'] as const;
        case 'massive':
          return ['#dc2626', '#b91c1c'] as const;
        default:
          return ['#2563eb', '#1e3a8a'] as const;
      }
    };

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <LinearGradient
          colors={getGradientColors()}
          style={styles.gradientBackground}
        >
          {/* Animated orbs */}
          <Animated.View 
            style={[
              styles.orb, 
              styles.orb1, 
              { 
                opacity: orbOpacity,
                transform: [
                  { translateX: orb1Position.x },
                  { translateY: orb1Position.y }
                ]
              }
            ]} 
          />
          <Animated.View 
            style={[
              styles.orb, 
              styles.orb2, 
              { 
                opacity: orbOpacity,
                transform: [
                  { translateX: orb2Position.x },
                  { translateY: orb2Position.y }
                ]
              }
            ]} 
          />
          <Animated.View 
            style={[
              styles.orb, 
              styles.orb3, 
              { 
                opacity: orbOpacity,
                transform: [
                  { translateX: orb3Position.x },
                  { translateY: orb3Position.y }
                ]
              }
            ]} 
          />

          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTitle}>LLM Inference Calculator</Text>
            <Text style={styles.welcomeDescription}>
              Instantly determine the hardware requirements for running Large Language Models locally.
              Get personalized GPU and memory recommendations based on model parameters, quantization level, and context length.
            </Text>
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => setShowWelcome(false)}
            >
              <Text style={styles.ctaButtonText}>Calculate Your Requirements</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  // Main calculator screen
  // Get gradient colors based on background style
  const getGradientColors = () => {
    switch (backgroundStyle) {
      case 'tiny':
        return ['#10b981', '#065f46'] as const;
      case 'small':
        return ['#3b82f6', '#1e40af'] as const;
      case 'medium':
        return ['#2563eb', '#1e3a8a'] as const;
      case 'large':
        return ['#f59e0b', '#d97706'] as const;
      case 'xlarge':
        return ['#ea580c', '#c2410c'] as const;
      case 'massive':
        return ['#dc2626', '#b91c1c'] as const;
      default:
        return ['#2563eb', '#1e3a8a'] as const;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={getGradientColors()}
        style={styles.gradientBackground}
      >
        <ScrollView style={styles.scrollView}>
          {/* Input Panel */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Model Configuration</Text>
            
            {/* Parameters slider */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Number of Parameters (Billions)</Text>
              <View style={styles.sliderContainer}>
                <View style={styles.sliderHeader}>
                  <Text style={styles.sliderLabel}>Model Size</Text>
                  <Text style={styles.sliderValue}>{params}B</Text>
                </View>
                <Slider
                  style={styles.slider}
                  minimumValue={1}
                  maximumValue={1000}
                  step={1}
                  value={params}
                  onValueChange={value => setParams(value)}
                  minimumTrackTintColor="#3b82f6"
                  maximumTrackTintColor="rgba(255,255,255,0.2)"
                  thumbTintColor="#60a5fa"
                />
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    keyboardType="numeric"
                    value={params.toString()}
                    onChangeText={text => {
                      const value = parseInt(text);
                      if (!isNaN(value) && value >= 1 && value <= 1000) {
                        setParams(value);
                      }
                    }}
                  />
                </View>
              </View>
            </View>

            {/* Model Quantization */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Model Quantization</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quantizationContainer}>
                {['F32', 'F16', 'Q8', 'Q6', 'Q5', 'Q4', 'Q3', 'Q2', 'GPTQ', 'AWQ'].map((quant) => (
                  <TouchableOpacity
                    key={quant}
                    style={[
                      styles.quantButton,
                      modelQuant === quant && styles.quantButtonActive
                    ]}
                    onPress={() => setModelQuant(quant as ModelQuantization)}
                  >
                    <Text
                      style={[
                        styles.quantButtonText,
                        modelQuant === quant && styles.quantButtonTextActive
                      ]}
                    >
                      {quant}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Context Length */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Context Length (Tokens)</Text>
              <View style={styles.sliderContainer}>
                <View style={styles.sliderHeader}>
                  <Text style={styles.sliderLabel}>Context Window</Text>
                  <Text style={styles.sliderValue}>{contextLength}</Text>
                </View>
                <Slider
                  style={styles.slider}
                  minimumValue={128}
                  maximumValue={32768}
                  step={128}
                  value={contextLength}
                  onValueChange={value => setContextLength(value)}
                  minimumTrackTintColor="#3b82f6"
                  maximumTrackTintColor="rgba(255,255,255,0.2)"
                  thumbTintColor="#60a5fa"
                />
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    keyboardType="numeric"
                    value={contextLength.toString()}
                    onChangeText={text => {
                      const value = parseInt(text);
                      if (!isNaN(value) && value >= 128 && value <= 32768) {
                        // Round to nearest multiple of 128
                        setContextLength(Math.round(value / 128) * 128);
                      }
                    }}
                  />
                </View>
              </View>
            </View>

            {/* KV Cache */}
            <View style={styles.formGroup}>
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Enable KV Cache</Text>
                <Switch
                  value={useKvCache}
                  onValueChange={setUseKvCache}
                  thumbColor={useKvCache ? '#3b82f6' : '#f4f3f4'}
                  trackColor={{ false: '#767577', true: '#bfdbfe' }}
                  ios_backgroundColor="#3e3e3e"
                />
              </View>

              {useKvCache && (
                <View style={styles.kvCacheOptions}>
                  <Text style={styles.label}>KV Cache Quantization</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quantizationContainer}>
                    {['F32', 'F16', 'Q8', 'Q5', 'Q4'].map((quant) => (
                      <TouchableOpacity
                        key={quant}
                        style={[
                          styles.quantButton,
                          kvCacheQuant === quant && styles.quantButtonActive
                        ]}
                        onPress={() => setKvCacheQuant(quant as KvCacheQuantization)}
                      >
                        <Text
                          style={[
                            styles.quantButtonText,
                            kvCacheQuant === quant && styles.quantButtonTextActive
                          ]}
                        >
                          {quant}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            <Text style={styles.sectionTitle}>System Configuration</Text>

            {/* Memory Mode */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>System Type</Text>
              <View style={styles.memoryModeContainer}>
                <TouchableOpacity
                  style={[
                    styles.memoryModeButton,
                    memoryMode === 'DISCRETE_GPU' && styles.memoryModeButtonActive
                  ]}
                  onPress={() => setMemoryMode('DISCRETE_GPU')}
                >
                  <Text
                    style={[
                      styles.memoryModeText,
                      memoryMode === 'DISCRETE_GPU' && styles.memoryModeTextActive
                    ]}
                  >
                    Discrete GPU
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.memoryModeButton,
                    memoryMode === 'UNIFIED_MEMORY' && styles.memoryModeButtonActive
                  ]}
                  onPress={() => setMemoryMode('UNIFIED_MEMORY')}
                >
                  <Text
                    style={[
                      styles.memoryModeText,
                      memoryMode === 'UNIFIED_MEMORY' && styles.memoryModeTextActive
                    ]}
                  >
                    Unified Memory
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* GPU VRAM */}
            {memoryMode === 'DISCRETE_GPU' && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>GPU VRAM (GB)</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.vramContainer}>
                  {[8, 12, 16, 24, 32, 40, 48, 80].map((vram) => (
                    <TouchableOpacity
                      key={vram}
                      style={[
                        styles.vramButton,
                        gpuVram === vram && styles.vramButtonActive
                      ]}
                      onPress={() => setGpuVram(vram)}
                    >
                      <Text
                        style={[
                          styles.vramButtonText,
                          gpuVram === vram && styles.vramButtonTextActive
                        ]}
                      >
                        {vram} GB
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* System Memory */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>System Memory (GB)</Text>
              <View style={styles.sliderContainer}>
                <View style={styles.sliderHeader}>
                  <Text style={styles.sliderLabel}>RAM</Text>
                  <Text style={styles.sliderValue}>{systemMemory} GB</Text>
                </View>
                <Slider
                  style={styles.slider}
                  minimumValue={8}
                  maximumValue={512}
                  step={8}
                  value={systemMemory}
                  onValueChange={value => setSystemMemory(value)}
                  minimumTrackTintColor="#3b82f6"
                  maximumTrackTintColor="rgba(255,255,255,0.2)"
                  thumbTintColor="#60a5fa"
                />
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    keyboardType="numeric"
                    value={systemMemory.toString()}
                    onChangeText={text => {
                      const value = parseInt(text);
                      if (!isNaN(value) && value >= 8 && value <= 512) {
                        // Round to nearest multiple of 8
                        setSystemMemory(Math.round(value / 8) * 8);
                      }
                    }}
                  />
                </View>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => setShowWelcome(true)}
            >
              <Text style={styles.backButtonText}>Back to Welcome Screen</Text>
            </TouchableOpacity>
          </View>

          {/* Results Panel */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Hardware Requirements</Text>
            
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>VRAM Needed</Text>
              <Text style={styles.resultHighlight}>{recommendation.vramNeeded} GB</Text>
            </View>
            
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>On-Disk Size</Text>
              <Text style={styles.resultValue}>{onDiskSize.toFixed(2)} GB</Text>
            </View>
            
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>GPU Configuration</Text>
              <Text style={styles.resultValue}>{recommendation.gpuType}</Text>
            </View>
            
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>GPUs Required</Text>
              <Text style={styles.resultValue}>
                {recommendation.gpusRequired === 0 
                  ? "Insufficient GPU memory" 
                  : recommendation.gpusRequired === 1 
                    ? "1 (Single GPU)" 
                    : `${recommendation.gpusRequired}`}
              </Text>
            </View>
            
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>System RAM</Text>
              <Text style={styles.resultValue}>{recommendation.systemRamNeeded.toFixed(1)} GB</Text>
            </View>
            
            {memoryMode === 'UNIFIED_MEMORY' && (
              <View style={[styles.statusBox, recommendation.fitsUnified ? styles.statusSuccess : styles.statusWarning]}>
                <Text style={recommendation.fitsUnified ? styles.statusTextSuccess : styles.statusTextWarning}>
                  {recommendation.fitsUnified 
                    ? "✓ Fits in unified memory!" 
                    : "⚠ Exceeds unified memory. Increase system RAM or reduce model size."}
                </Text>
              </View>
            )}
            
            {/* GPU Utilization */}
            {recommendation.gpusRequired > 0 && recommendation.gpusRequired <= 4 && (
              <View style={styles.utilizationContainer}>
                <Text style={styles.label}>GPU Utilization</Text>
                <View style={styles.utilizationBar}>
                  <View 
                    style={[
                      styles.utilizationFill, 
                      utilizationClass === 'low' ? styles.utilizationlow :
                      utilizationClass === 'medium' ? styles.utilizationmedium :
                      utilizationClass === 'high' ? styles.utilizationhigh :
                      styles.utilizationextreme,
                      { width: `${Math.min(100, utilizationPercentage)}%` }
                    ]} 
                  />
                </View>
                <View style={styles.utilizationLabels}>
                  <Text style={styles.utilizationLabel}>0%</Text>
                  <Text style={styles.utilizationLabel}>50%</Text>
                  <Text style={styles.utilizationLabel}>100%</Text>
                </View>
              </View>
            )}
            
            {/* Complexity indicator */}
            <View style={styles.complexityContainer}>
              <Text style={styles.complexityTitle}>Complexity Level</Text>
              <View style={[
                styles.complexityBox, 
                backgroundStyle === 'tiny' ? styles.complexitytiny :
                backgroundStyle === 'small' ? styles.complexitysmall :
                backgroundStyle === 'medium' ? styles.complexitymedium :
                backgroundStyle === 'large' ? styles.complexitylarge :
                backgroundStyle === 'xlarge' ? styles.complexityxlarge :
                styles.complexitymassive
              ]}>
                <Text style={[
                  backgroundStyle === 'tiny' ? styles.complexityTexttiny :
                  backgroundStyle === 'small' ? styles.complexityTextsmall :
                  backgroundStyle === 'medium' ? styles.complexityTextmedium :
                  backgroundStyle === 'large' ? styles.complexityTextlarge :
                  backgroundStyle === 'xlarge' ? styles.complexityTextxlarge :
                  styles.complexityTextmassive
                ]}>
                  {backgroundStyle === 'tiny' && 'Tiny (1-15B)'}
                  {backgroundStyle === 'small' && 'Small (16-32B)'}
                  {backgroundStyle === 'medium' && 'Medium (33-70B)'}
                  {backgroundStyle === 'large' && 'Large (71-200B)'}
                  {backgroundStyle === 'xlarge' && 'XLarge (201-500B)'}
                  {backgroundStyle === 'massive' && 'Massive (500B+)'}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  gradientBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  orb: {
    position: 'absolute',
    borderRadius: 300,
  },
  orb1: {
    width: 300,
    height: 300,
    backgroundColor: '#3b82f6',
    top: -100,
    right: '10%',
    opacity: 0.6,
  },
  orb2: {
    width: 350,
    height: 350,
    backgroundColor: '#7c3aed',
    bottom: -150,
    left: -150,
    opacity: 0.6,
  },
  orb3: {
    width: 200,
    height: 200,
    backgroundColor: '#10b981',
    top: '40%',
    right: -100,
    opacity: 0.6,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    margin: 16,
    borderRadius: 16,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
  },
  welcomeDescription: {
    fontSize: 16,
    color: '#e2e8f0',
    textAlign: 'center',
    marginBottom: 24,
  },
  ctaButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  ctaButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  card: {
    backgroundColor: 'rgba(19, 19, 32, 0.7)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 8,
  },
  sliderContainer: {
    marginBottom: 16,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sliderLabel: {
    fontSize: 14,
    color: '#e2e8f0',
  },
  sliderValue: {
    fontSize: 14,
    color: '#ffffff',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    overflow: 'hidden',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  inputContainer: {
    width: 80,
    alignSelf: 'flex-end',
  },
  textInput: {
    backgroundColor: 'rgba(12, 12, 20, 0.6)',
    color: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 8,
    textAlign: 'center',
  },
  quantizationContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  quantButton: {
    backgroundColor: 'rgba(12, 12, 20, 0.6)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  quantButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#60a5fa',
  },
  quantButtonText: {
    color: '#94a3b8',
  },
  quantButtonTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 16,
    color: '#e2e8f0',
  },
  kvCacheOptions: {
    marginLeft: 16,
    marginBottom: 16,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(59, 130, 246, 0.3)',
    paddingLeft: 16,
  },
  memoryModeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  memoryModeButton: {
    flex: 1,
    backgroundColor: 'rgba(12, 12, 20, 0.6)',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  memoryModeButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#60a5fa',
  },
  memoryModeText: {
    color: '#94a3b8',
  },
  memoryModeTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  vramContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  vramButton: {
    backgroundColor: 'rgba(12, 12, 20, 0.6)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  vramButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#60a5fa',
  },
  vramButtonText: {
    color: '#94a3b8',
  },
  vramButtonTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  backButtonText: {
    color: '#60a5fa',
    fontSize: 14,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  resultLabel: {
    fontSize: 16,
    color: '#94a3b8',
  },
  resultValue: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  resultHighlight: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  statusBox: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  statusWarning: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  statusTextSuccess: {
    color: '#10b981',
    fontWeight: '500',
  },
  statusTextWarning: {
    color: '#ef4444',
    fontWeight: '500',
  },
  utilizationContainer: {
    marginTop: 16,
  },
  utilizationBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: 8,
  },
  utilizationFill: {
    height: '100%',
    borderRadius: 4,
  },
  utilizationlow: {
    backgroundColor: '#10b981',
  },
  utilizationmedium: {
    backgroundColor: '#3b82f6',
  },
  utilizationhigh: {
    backgroundColor: '#f59e0b',
  },
  utilizationextreme: {
    backgroundColor: '#ef4444',
  },
  utilizationLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  utilizationLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  complexityContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  complexityTitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  complexityBox: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  complexitytiny: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  complexitysmall: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  complexitymedium: {
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
  },
  complexitylarge: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  complexityxlarge: {
    backgroundColor: 'rgba(234, 88, 12, 0.1)',
  },
  complexitymassive: {
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
  },
  complexityTexttiny: {
    color: '#10b981',
  },
  complexityTextsmall: {
    color: '#3b82f6',
  },
  complexityTextmedium: {
    color: '#2563eb',
  },
  complexityTextlarge: {
    color: '#f59e0b',
  },
  complexityTextxlarge: {
    color: '#ea580c',
  },
  complexityTextmassive: {
    color: '#dc2626',
  },
});
