import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { engine } from '@engine/musty';
import { useProfiles } from '@ui/hooks/useEngine';
import { ProfileCard } from '@ui/components/ProfileCard';
import { MustyFooter } from '@ui/components/MustyFooter';
import { createDefaultProfile } from '@config/defaults';
import { Profile } from '@config/schema';

export const Recipes: React.FC = () => {
  const navigation = useNavigation<any>();
  const { profiles, save, remove } = useProfiles();
  const [editing, setEditing] = useState<Profile | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const recipes = engine.recipes.getAll();

  const handleNew = (recipeId: string) => {
    const profile = createDefaultProfile({ recipeId, name: '', server: '', username: '', authRef: '' });
    setEditing(profile);
    setShowCreate(false);
  };

  const handleEdit = (profile: Profile) => setEditing(profile);

  const handleSave = async (profile: Profile) => {
    await save(profile);
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    Alert.alert('Delete Profile', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => remove(id) },
    ]);
  };

  const handleTest = async () => {
    Alert.alert('Test', 'Connection test would run here');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Recipes</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowCreate(true)}>
          <Text style={styles.addBtnText}>+ New</Text>
        </TouchableOpacity>
      </View>

      {showCreate && (
        <View style={styles.recipeGrid}>
          {recipes.map(r => (
            <TouchableOpacity key={r.id} style={styles.recipeCard} onPress={() => handleNew(r.id)}>
              <Text style={styles.recipeIcon}>📋</Text>
              <Text style={styles.recipeName}>{r.name}</Text>
              <Text style={styles.recipeDesc}>{r.description}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={[styles.recipeCard, styles.cancelCard]} onPress={() => setShowCreate(false)}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {!showCreate && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Saved Profiles</Text>
          {profiles.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No profiles yet</Text>
              <Text style={styles.emptySub}>Tap + New to create one</Text>
            </View>
          ) : (
            profiles.map(p => (
              <View key={p.id} style={styles.profileItem}>
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>{p.name}</Text>
                  <Text style={styles.profileServer}>{p.server}:{p.port}</Text>
                </View>
                <View style={styles.profileActions}>
                  <TouchableOpacity onPress={() => handleEdit(p)}>
                    <Text style={styles.actionBtn}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(p.id)} style={styles.deleteBtn}>
                    <Text style={styles.deleteBtnText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      )}

      {editing && (
        <ProfileCard
          profile={editing}
          onChange={setEditing}
          onSave={() => handleSave(editing!)}
          onTest={handleTest}
        />
      )}

      <MustyFooter />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 24, fontWeight: '700', color: '#111827' },
  addBtn: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#3B82F6', borderRadius: 8 },
  addBtnText: { color: '#fff', fontWeight: '600' },
  recipeGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24, gap: 12 },
  recipeCard: { flex: 1, minWidth: '45%', padding: 20, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center' },
  cancelCard: { borderColor: '#D1D5DB', backgroundColor: '#F9FAFB' },
  recipeIcon: { fontSize: 32, marginBottom: 8 },
  recipeName: { fontSize: 16, fontWeight: '600', textAlign: 'center', marginBottom: 4 },
  recipeDesc: { fontSize: 13, color: '#6B7280', textAlign: 'center' },
  cancelText: { color: '#6B7280', fontWeight: '600' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12, color: '#111827' },
  empty: { alignItems: 'center', padding: 40, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  emptyText: { fontSize: 16, fontWeight: '600', color: '#6B7280', marginBottom: 4 },
  emptySub: { fontSize: 14, color: '#9CA3AF' },
  profileItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 8 },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 16, fontWeight: '600' },
  profileServer: { fontSize: 14, color: '#6B7280', marginTop: 2 },
  profileActions: { flexDirection: 'row', gap: 8 },
  actionBtn: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#F3F4F6', borderRadius: 6 },
  deleteBtn: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#FEF2F2', borderRadius: 6, borderWidth: 1, borderColor: '#FECACA' },
  deleteBtnText: { color: '#EF4444', fontWeight: '600' },
});