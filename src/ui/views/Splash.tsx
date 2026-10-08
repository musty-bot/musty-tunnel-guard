import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { engineName, corporation, version } from '../../engine/version';

export const Splash: React.FC = () => {
  const navigation = useNavigation<any>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Dashboard');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>🛡️</Text>
        <Text style={styles.name}>Tunnel Guard</Text>
      </View>
      <Text style={styles.powered}>Powered by {corporation}</Text>
      <Text style={styles.engine}>{engineName} v1</Text>
      <ActivityIndicator size="large" color="#3B82F6" style={styles.spinner} />
      <Text style={styles.version}>Engine: {version}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  logoContainer: { alignItems: 'center', marginBottom: 24 },
  logo: { fontSize: 64 },
  name: { fontSize: 28, fontWeight: '700', color: '#111827', marginTop: 8 },
  powered: { fontSize: 16, color: '#6B7280', marginBottom: 4 },
  engine: { fontSize: 14, color: '#9CA3AF', marginBottom: 24 },
  spinner: { marginVertical: 16 },
  version: { fontSize: 11, color: '#D1D5DB', fontFamily: 'monospace' },
});