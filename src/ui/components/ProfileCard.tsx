import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { engine } from '../../engine/musty';
import { Profile } from '../../config/schema';

interface ProfileCardProps {
  profile: Profile;
  onChange: (profile: Profile) => void;
  onSave: () => void;
  onTest: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onChange, onSave, onTest }) => {
  const recipes = engine.recipes.getAll();
  const authMethods = engine.auth.getAll();

  const handleChange = (field: string, value: any) => {
    onChange({ ...profile, [field]: value, updatedAt: Date.now() });
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{profile.name || 'New Profile'}</Text>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={profile.name}
          onChangeText={v => handleChange('name', v)}
          placeholder="My Tunnel"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Recipe</Text>
        <Picker
          selectedValue={profile.recipeId}
          onValueChange={(v: string) => handleChange('recipeId', v)}
          style={styles.picker}
          mode="dropdown"
        >
          {recipes.map(r => (
            <Picker.Item key={r.id} label={r.name} value={r.id} />
          ))}
        </Picker>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Server</Text>
        <TextInput
          style={styles.input}
          value={profile.server}
          onChangeText={v => handleChange('server', v)}
          placeholder="example.com"
        />
      </View>

      <View style={styles.row}>
        <View style={styles.fieldHalf}>
          <Text style={styles.label}>Port</Text>
          <TextInput
            style={styles.input}
            value={String(profile.port)}
            onChangeText={v => handleChange('port', parseInt(v) || 22)}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.fieldHalf}>
          <Text style={styles.label}>Local Port</Text>
          <TextInput
            style={styles.input}
            value={String(profile.localPort)}
            onChangeText={v => handleChange('localPort', parseInt(v) || 1080)}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={profile.username}
          onChangeText={v => handleChange('username', v)}
          placeholder="user"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Auth Method</Text>
        <Picker
          selectedValue={profile.authType}
          onValueChange={(v: string) => handleChange('authType', v)}
          style={styles.picker}
          mode="dropdown"
        >
          {authMethods.map(a => (
            <Picker.Item key={a.id} label={a.name} value={a.id} />
          ))}
        </Picker>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.btnSecondary} onPress={onTest}>
          <Text style={styles.btnText}>Test Connection</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnPrimary} onPress={onSave}>
          <Text style={styles.btnText}>Save Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { padding: 20, backgroundColor: '#fff', borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 2 },
  header: { marginBottom: 20 },
  title: { fontSize: 18, fontWeight: '700' },
  field: { marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  fieldHalf: { flex: 1, marginRight: 8 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6, color: '#374151' },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12, fontSize: 16 },
  picker: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 },
  btnSecondary: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, backgroundColor: '#F3F4F6', marginRight: 8 },
  btnPrimary: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, backgroundColor: '#3B82F6' },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 14, textAlign: 'center' },
});