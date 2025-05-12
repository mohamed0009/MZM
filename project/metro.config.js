// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // Enable CSS support
  isCSSEnabled: true,
});

// This is needed for react-native-reanimated and gesture-handler
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  'react-native-reanimated': require.resolve('react-native-reanimated'),
  'react-native-gesture-handler': require.resolve('react-native-gesture-handler'),
};

module.exports = config; 