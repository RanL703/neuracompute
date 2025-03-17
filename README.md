# LLM Inference Calculator - Android App

This is an Android version of the LLM Inference Calculator, built using Expo and React Native.

## Overview

This app uses a WebView to display the web version of the LLM Inference Calculator, enabling mobile access to the tool that calculates inference time for running LLMs locally based on LLM specs.

## Prerequisites

- Node.js and npm
- Expo CLI
- Android development environment set up (Android Studio with emulator)

## Setup and Running

1. Build the web app:
   ```bash
   cd ..
   npm install
   npm run build
   ```

2. Install Expo app dependencies:
   ```bash
   cd NeuraCompute
   npm install
   ```

3. Run both servers:
   ```bash
   cd ..
   npm run start-all
   ```

4. In the Expo interface that appears in the terminal, press 'a' to open the app in an Android emulator.

## Technology Stack

- React Native
- Expo
- WebView
- The original Vite+React web app

## Important Notes

- The app uses a WebView that connects to a local server running the Vite app.
- For production deployment, you would need to host the web app and update the URL in the App.tsx file. 