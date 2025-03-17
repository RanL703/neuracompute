import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { NavigationProps } from '../types';
import { styles } from '../styles/styles';

export const WelcomeScreen: React.FC<NavigationProps> = ({ navigation }) => {
  const [showWelcome, setShowWelcome] = useState(true);

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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#1e293b', '#0f172a']}
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
            onPress={() => {
              setShowWelcome(false);
              navigation.navigate('Calculator');
            }}
          >
            <Text style={styles.ctaButtonText}>Calculate Your Requirements</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}; 