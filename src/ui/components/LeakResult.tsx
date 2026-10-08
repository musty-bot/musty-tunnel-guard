import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LeakCheckResult } from '../../engine/contracts/LeakCheck';

interface LeakResultProps {
  result: LeakCheckResult;
  onFix?: () => void;
}

export const LeakResult: React.FC<LeakResultProps> = ({ result, onFix }) => {
  const passed = result.passed;

  return (
    <View style={[styles.container, { borderLeftColor: passed ? '#10B981' : '#EF4444' }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: passed ? '#10B981' : '#EF4444' }]}>
          {passed ? '✓ Passed' : '✗ Failed'}
        </Text>
        <Text style={styles.details}>{result.details}</Text>
      </View>
      {result.fix && onFix && (
        <TouchableOpacity style={styles.fixBtn} onPress={onFix}>
          <Text style={styles.fixBtnText}>Apply Fix</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff', borderRadius: 8, borderLeftWidth: 4, marginBottom: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 16, fontWeight: '600' },
  details: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  fixBtn: { marginTop: 12, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#3B82F6', borderRadius: 6, alignSelf: 'flex-start' },
  fixBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});