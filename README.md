# neuracompute an LLM Inference Calculator - Mobile App

A beautiful, native mobile app for calculating hardware requirements for running Large Language Models (LLMs) locally. Built with React Native and Expo.

## Features

- 🎨 Beautiful, modern UI with animated elements
- 📱 Fully native mobile experience
- 🧮 Real-time calculations for:
  - VRAM requirements
  - System memory needs
  - Storage requirements
  - Multi-GPU configurations
- 🔄 Support for various quantization methods
- 💾 KV Cache optimization options
- 🖥️ Unified and discrete memory configurations

## Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- For iOS development:
  - macOS
  - Xcode
  - iOS Simulator
- For Android development:
  - Android Studio
  - Android SDK
  - Android Emulator

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/RanL703/neuracompute.git
   cd neuracompute
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npx expo start
   ```

4. Run on your preferred platform:
   - Press `a` for Android
   - Press `i` for iOS (requires macOS)
   - Scan QR code with Expo Go app on your device

## Project Structure

```
src/
├── context/
│   └── AppContext.tsx    # Global state management
├── screens/
│   ├── WelcomeScreen.tsx # Welcome screen with animations
│   ├── CalculatorScreen.tsx # Main calculator interface
│   └── ResultsScreen.tsx # Results display
├── types/
│   └── index.ts         # TypeScript type definitions
├── utils/
│   └── calculations.ts  # Calculation helper functions
└── styles/
    └── styles.ts       # Shared styles
```

## Features in Detail

### Welcome Screen
- Animated background with floating orbs
- Clear call-to-action
- Modern, minimalist design

### Calculator Screen
- Model Configuration:
  - Parameter count adjustment
  - Quantization selection (F32 to AWQ)
  - Context length configuration
  - KV Cache settings
- System Configuration:
  - Memory mode selection (Discrete/Unified)
  - VRAM configuration
  - System memory settings

### Results Screen
- Hardware Requirements:
  - VRAM utilization visualization
  - Storage requirements
  - GPU configuration recommendations
  - System memory requirements
- Status indicators for memory compatibility

## Technology Stack

- React Native
- Expo
- React Navigation
- TypeScript
- Linear Gradient
- Animated API
- Vector Icons

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 