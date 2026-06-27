import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface IOrbitDotLoader {
  dotColor?: string;
  dotRadius?: number;
  centerRadius?: number;
  size?: number;
  duration?: number;
  numDots?: number;
  style?: object;
}

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const OrbitDotLoader: React.FC<IOrbitDotLoader> = ({
  dotColor = '#18181b',
  dotRadius = 4,
  centerRadius = 5,
  size = 40,
  duration = 900,
  numDots = 4,
  style,
}) => {
  const rotation = useSharedValue(0);
  const centerScale = useSharedValue(1);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration, easing: Easing.linear }),
      -1,
    );
  }, [duration]);

  useEffect(() => {
    centerScale.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 400, easing: Easing.out(Easing.ease) }),
        withTiming(1, { duration: 400, easing: Easing.in(Easing.ease) }),
      ),
      -1,
    );
  }, []);

  const rotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const centerProps = useAnimatedProps(() => ({
    r: centerRadius * centerScale.value,
  }));

  const center = size / 2;
  const orbitY = center - size * 0.3;

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Svg width={size} height={size}>
        <AnimatedCircle
          cx={center}
          cy={center}
          r={centerRadius}
          fill={dotColor}
          animatedProps={centerProps}
        />
      </Svg>
      <AnimatedView style={[styles.spinner, rotateStyle]}>
        <Svg width={size} height={size}>
          {Array.from({ length: numDots }).map((_, i) => (
            <Circle
              key={i}
              cx={center}
              cy={orbitY}
              r={dotRadius}
              fill={dotColor}
              transform={`rotate(${(360 / numDots) * i}, ${center}, ${center})`}
            />
          ))}
        </Svg>
      </AnimatedView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { justifyContent: 'center', alignItems: 'center' },
  spinner: { position: 'absolute', justifyContent: 'center', alignItems: 'center' },
});
