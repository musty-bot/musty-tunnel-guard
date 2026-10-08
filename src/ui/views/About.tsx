import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { engineName, corporation, version, appId } from '../../engine/version';
import { MustyFooter } from '../components/MustyFooter';

export const About: React.FC = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.logo}>🛡️</Text>
        <Text style={styles.name}>Tunnel Guard</Text>
        <Text style={styles.tagline}>Secure tunnels you can prove.</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Engine</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Name</Text>
          <Text style={styles.infoValue}>{engineName}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Version</Text>
          <Text style={styles.infoValue}>{version}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Corporation</Text>
          <Text style={styles.infoValue}>{corporation}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>App ID</Text>
          <Text style={styles.infoValue}>{appId}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Philosophy</Text>
        <Text style={styles.philosophy}>
          Tunnel Guard combines a guided SSH tunnel manager with a DNS/IP/WebRTC 
          leak verifier — the safety net that makes the tunnel trustworthy.
        </Text>
        <Text style={styles.philosophy}>
          Everything runs locally. No accounts. No servers. No telemetry.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Polymorphic Contracts</Text>
        <View style={styles.contracts}>
          {[
            { name: 'Recipe', desc: 'Guided tunnel presets (Safe Public WiFi, Remote Database, Home Server)' },
            { name: 'LeakCheck', desc: 'Verification steps (DNS, IP, WebRTC)' },
            { name: 'DnsProvider', desc: 'Resolver configs (Cloudflare, Quad9, NextDNS)' },
            { name: 'AuthMethod', desc: 'Credential resolution (Key, Password)' },
          ].map((c, i) => (
            <View key={i} style={styles.contractCard}>
              <Text style={styles.contractName}>{c.name}</Text>
              <Text style={styles.contractDesc}>{c.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Links</Text>
        <TouchableOpacity style={styles.link} onPress={() => Linking.openURL('https://github.com/musty/tunnel-guard')}>
          <Text>GitHub Repository</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.link} onPress={() => Linking.openURL('https://musty.corp')}>
          <Text>Musty Corporations</Text>
        </TouchableOpacity>
      </View>

      <MustyFooter />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: 20, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 32 },
  logo: { fontSize: 64, marginBottom: 12 },
  name: { fontSize: 28, fontWeight: '700', color: '#111827' },
  tagline: { fontSize: 16, color: '#6B7280', marginTop: 4 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12, color: '#111827' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  infoLabel: { fontSize: 14, color: '#6B7280' },
  infoValue: { fontSize: 14, fontWeight: '500', color: '#111827', fontFamily: 'monospace' },
  philosophy: { fontSize: 14, color: '#4B5563', lineHeight: 22, marginBottom: 12 },
  contracts: { gap: 10 },
  contractCard: { padding: 16, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  contractName: { fontSize: 14, fontWeight: '600', color: '#111827' },
  contractDesc: { fontSize: 13, color: '#6B7280', marginTop: 4 },
  link: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
});