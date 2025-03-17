import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Switch, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import { NavigationProps, ModelQuantization, KvCacheQuantization } from '../types';
import { styles } from '../styles/styles';
import { useAppContext } from '../context/AppContext';

export const CalculatorScreen: React.FC<NavigationProps> = ({ navigation }) => {
  const { state, setState } = useAppContext();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#1e293b', '#0f172a']}
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
                  <Text style={styles.sliderValue}>{state.params}B</Text>
                </View>
                <Slider
                  style={styles.slider}
                  minimumValue={1}
                  maximumValue={1000}
                  step={1}
                  value={state.params}
                  onValueChange={value => setState(prev => ({ ...prev, params: value }))}
                  minimumTrackTintColor="#3b82f6"
                  maximumTrackTintColor="rgba(255,255,255,0.2)"
                  thumbTintColor="#60a5fa"
                />
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    keyboardType="numeric"
                    value={state.params.toString()}
                    onChangeText={text => {
                      const value = parseInt(text);
                      if (!isNaN(value) && value >= 1 && value <= 1000) {
                        setState(prev => ({ ...prev, params: value }));
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
                      state.modelQuant === quant && styles.quantButtonActive
                    ]}
                    onPress={() => setState(prev => ({ ...prev, modelQuant: quant as ModelQuantization }))}
                  >
                    <Text
                      style={[
                        styles.quantButtonText,
                        state.modelQuant === quant && styles.quantButtonTextActive
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
                  <Text style={styles.sliderValue}>{state.contextLength}</Text>
                </View>
                <Slider
                  style={styles.slider}
                  minimumValue={128}
                  maximumValue={32768}
                  step={128}
                  value={state.contextLength}
                  onValueChange={value => setState(prev => ({ ...prev, contextLength: value }))}
                  minimumTrackTintColor="#3b82f6"
                  maximumTrackTintColor="rgba(255,255,255,0.2)"
                  thumbTintColor="#60a5fa"
                />
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    keyboardType="numeric"
                    value={state.contextLength.toString()}
                    onChangeText={text => {
                      const value = parseInt(text);
                      if (!isNaN(value) && value >= 128 && value <= 32768) {
                        // Round to nearest multiple of 128
                        setState(prev => ({ ...prev, contextLength: Math.round(value / 128) * 128 }));
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
                  value={state.useKvCache}
                  onValueChange={() => setState(prev => ({ ...prev, useKvCache: !prev.useKvCache }))}
                  thumbColor={state.useKvCache ? '#3b82f6' : '#f4f3f4'}
                  trackColor={{ false: '#767577', true: '#bfdbfe' }}
                  ios_backgroundColor="#3e3e3e"
                />
              </View>

              {state.useKvCache && (
                <View style={styles.kvCacheOptions}>
                  <Text style={styles.label}>KV Cache Quantization</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quantizationContainer}>
                    {['F32', 'F16', 'Q8', 'Q5', 'Q4'].map((quant) => (
                      <TouchableOpacity
                        key={quant}
                        style={[
                          styles.quantButton,
                          state.kvCacheQuant === quant && styles.quantButtonActive
                        ]}
                        onPress={() => setState(prev => ({ ...prev, kvCacheQuant: quant as KvCacheQuantization }))}
                      >
                        <Text
                          style={[
                            styles.quantButtonText,
                            state.kvCacheQuant === quant && styles.quantButtonTextActive
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
                    state.memoryMode === 'DISCRETE_GPU' && styles.memoryModeButtonActive
                  ]}
                  onPress={() => setState(prev => ({ ...prev, memoryMode: 'DISCRETE_GPU' }))}
                >
                  <Text
                    style={[
                      styles.memoryModeText,
                      state.memoryMode === 'DISCRETE_GPU' && styles.memoryModeTextActive
                    ]}
                  >
                    Discrete GPU
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.memoryModeButton,
                    state.memoryMode === 'UNIFIED_MEMORY' && styles.memoryModeButtonActive
                  ]}
                  onPress={() => setState(prev => ({ ...prev, memoryMode: 'UNIFIED_MEMORY' }))}
                >
                  <Text
                    style={[
                      styles.memoryModeText,
                      state.memoryMode === 'UNIFIED_MEMORY' && styles.memoryModeTextActive
                    ]}
                  >
                    Unified Memory
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* GPU VRAM */}
            {state.memoryMode === 'DISCRETE_GPU' && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>GPU VRAM (GB)</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.vramContainer}>
                  {[8, 12, 16, 24, 32, 40, 48, 80].map((vram) => (
                    <TouchableOpacity
                      key={vram}
                      style={[
                        styles.vramButton,
                        state.gpuVram === vram && styles.vramButtonActive
                      ]}
                      onPress={() => setState(prev => ({ ...prev, gpuVram: vram }))}
                    >
                      <Text
                        style={[
                          styles.vramButtonText,
                          state.gpuVram === vram && styles.vramButtonTextActive
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
                  <Text style={styles.sliderValue}>{state.systemMemory} GB</Text>
                </View>
                <Slider
                  style={styles.slider}
                  minimumValue={8}
                  maximumValue={512}
                  step={8}
                  value={state.systemMemory}
                  onValueChange={value => setState(prev => ({ ...prev, systemMemory: value }))}
                  minimumTrackTintColor="#3b82f6"
                  maximumTrackTintColor="rgba(255,255,255,0.2)"
                  thumbTintColor="#60a5fa"
                />
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    keyboardType="numeric"
                    value={state.systemMemory.toString()}
                    onChangeText={text => {
                      const value = parseInt(text);
                      if (!isNaN(value) && value >= 8 && value <= 512) {
                        // Round to nearest multiple of 8
                        setState(prev => ({ ...prev, systemMemory: Math.round(value / 8) * 8 }));
                      }
                    }}
                  />
                </View>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.navigate('Results')}
            >
              <Text style={styles.backButtonText}>View Results</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}; 