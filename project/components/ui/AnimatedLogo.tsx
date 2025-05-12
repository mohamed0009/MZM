import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, Easing } from 'react-native';
import { HeartPulse } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface AnimatedLogoProps {
  size?: number;
  color?: string;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ 
  size = 48, 
  color = Colors.light.gradientStart 
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.15, // Scale up
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1, // Scale down
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [scaleAnim]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <HeartPulse size={size} color={color} strokeWidth={2} />
    </Animated.View>
  );
};

export default AnimatedLogo; 