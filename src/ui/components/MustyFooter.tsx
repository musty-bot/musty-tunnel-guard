import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { version, engineName, corporation } from '../../engine/version';

export const MustyFooter: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {engineName} v1 — Powered by {corporation}
      </Text>
      <Text style={styles.version}>Engine: {version}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  text: { fontSize: 12, color: '#9CA3AF' },
  version: { fontSize: 10, color: '#D1D5DB', marginTop: 2, fontFamily: 'monospace' },
});