import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useEngine } from '@ui/hooks/useEngine';
import { LeakResult } from '@ui/components/LeakResult';
import { MustyFooter } from '@ui/components/MustyFooter';
import { LeakCheckResult } from '@engine/contracts/LeakCheck';

export const LeakTest: React.FC = () => {
  const { tunnel, health, loading, runLeakTest } = useEngine();
  const [results, setResults] = useState<LeakCheckResult[]>([]);
  const [testing, setTesting] = useState(false);

  const handleRunAll = async () => {
    if (!tunnel) return;
    setTesting(true);
    try {
      const res = await runLeakTest();
      if (res) setResults(res);
    } finally {
      setTesting(false);
    }
  };

  const handleFix = (checkId: string) => {
    console.log('Fix requested for:', checkId);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Leak Test</Text>
      </View>

      <View style={styles.statusCard}>
        <Text style={styles.statusLabel}>Overall Status</Text>
        <View style={styles.statusRow}>
          <View style={[styles.statusIndicator, { backgroundColor: health.status === 'secure' ? '#10B981' : health.status === 'warning' ? '#F59E0B' : health.status === 'leaking' ? '#EF4444' : '#6B7280' }]} />
          <Text style={styles.statusText}>{health.status.toUpperCase()}</Text>
        </View>
        <Text style={styles.scoreText}>Health Score: {health.score}/100</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Results</Text>
        {results.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No tests run yet</Text>
            <TouchableOpacity style={styles.runBtn} onPress={handleRunAll} disabled={!tunnel || testing}>
              <Text style={styles.runBtnText}>{testing ? 'Testing...' : 'Run All Tests'}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {results.map((r, i) => (
              <LeakResult key={i} result={r} onFix={() => handleFix(r.details)} />
            ))}
            <TouchableOpacity style={[styles.runBtn, styles.runBtnSecondary]} onPress={handleRunAll} disabled={!tunnel || testing}>
              <Text style={styles.runBtnText}>{testing ? 'Re-testing...' : 'Run Again'}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.infoTitle}>What these tests check:</Text>
        <View style={styles.infoList}>
          <Text style={styles.infoItem}>• DNS Leak — Your DNS queries route through the tunnel</Text>
          <Text style={styles.infoItem}>• IP Leak — Your public IP is hidden behind the tunnel</Text>
          <Text style={styles.infoItem}>• WebRTC Leak — Browser WebRTC doesn't expose real IP</Text>
        </View>
      </View>

      <MustyFooter />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 24 },
  title: { fontSize: 24, fontWeight: '700', color: '#111827' },
  statusCard: { padding: 20, backgroundColor: '#fff', borderRadius: 12, marginBottom: 24, borderWidth: 1, borderColor: '#E5E7EB' },
  statusLabel: { fontSize: 14, color: '#6B7280', marginBottom: 8 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  statusIndicator: { width: 12, height: 12, borderRadius: 6, marginRight: 10 },
  statusText: { fontSize: 18, fontWeight: '700' },
  scoreText: { fontSize: 14, color: '#6B7280' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12, color: '#111827' },
  empty: { alignItems: 'center', padding: 40, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  emptyText: { fontSize: 16, fontWeight: '600', color: '#6B7280', marginBottom: 16 },
  runBtn: { paddingHorizontal: 24, paddingVertical: 14, backgroundColor: '#3B82F6', borderRadius: 10 },
  runBtnSecondary: { backgroundColor: '#F3F4F6', marginTop: 16 },
  runBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  info: { padding: 16, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  infoTitle: { fontSize: 14, fontWeight: '600', marginBottom: 12, color: '#111827' },
  infoList: { gap: 6 },
  infoItem: { fontSize: 13, color: '#4B5563' },
});