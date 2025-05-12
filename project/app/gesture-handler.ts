// This file is imported in app/_layout.tsx to ensure gesture handler is properly initialized
// It must be the first import in the app's entry point to work correctly
import { LogBox } from 'react-native';
import 'react-native-gesture-handler';

// Optionally suppress specific warnings related to gesture handler if needed
LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
]);

// No-op function - the import above is what's important
export default function GestureHandler() {
  return null;
} 