import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, TabBarIconProps } from './src/types';
import { AppProvider } from './src/context/AppContext';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { CalculatorScreen } from './src/screens/CalculatorScreen';
import { ResultsScreen } from './src/screens/ResultsScreen';

const Tab = createBottomTabNavigator<RootStackParamList>();

const App = () => {
  return (
    <AppProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Tab.Navigator
          screenOptions={{
            tabBarStyle: {
              backgroundColor: '#1e293b',
              borderTopColor: 'rgba(255,255,255,0.1)',
            },
            tabBarActiveTintColor: '#3b82f6',
            tabBarInactiveTintColor: '#64748b',
            headerShown: false,
          }}
        >
          <Tab.Screen 
            name="Welcome" 
            component={WelcomeScreen}
            options={{
              tabBarIcon: ({ color, size }: TabBarIconProps) => (
                <Ionicons name="home-outline" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen 
            name="Calculator" 
            component={CalculatorScreen}
            options={{
              tabBarIcon: ({ color, size }: TabBarIconProps) => (
                <Ionicons name="calculator-outline" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen 
            name="Results" 
            component={ResultsScreen}
            options={{
              tabBarIcon: ({ color, size }: TabBarIconProps) => (
                <Ionicons name="stats-chart-outline" size={size} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
};

export default App; 