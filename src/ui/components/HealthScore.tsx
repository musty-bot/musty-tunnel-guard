import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HealthStatus, getStatusColor } from '../../engine/health';

interface HealthScoreProps {
  score: number;
  status: HealthStatus;
  size?: number;
}

export const HealthScore: React.FC<HealthScoreProps> = ({ score, status, size = 120 }) => {
  const color = getStatusColor(status);
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;

  return (
    <View style={styles.container}>
      <View style={[styles.circleContainer, { width: size, height: size }]}>
        <View style={[styles.circleBackground, { width: size, height: size }]} />
        <View
          style={[
            styles.circleRing,
            { width: size, height: size, borderColor: color },
            { borderWidth: strokeWidth },
          ]}
        />
        <View style={styles.scoreText}>
          <Text style={[styles.scoreValue, { color }]}>{score}</Text>
          <Text style={styles.scoreLabel}>{status}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  circleContainer: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  circleBackground: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 8,
    borderColor: '#E5E7EB',
  },
  circleRing: {
    position: 'absolute',
    borderRadius: 999,
    borderStyle: 'solid',
  },
  scoreText: { position: 'absolute', alignItems: 'center' },
  scoreValue: { fontSize: 36, fontWeight: '700' },
  scoreLabel: { fontSize: 12, color: '#6B7280', textTransform: 'capitalize' },
});