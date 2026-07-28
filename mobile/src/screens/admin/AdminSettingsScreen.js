import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function AdminSettingsScreen() {
  const { user, logout } = useAuth();
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const changePassword = async () => {
    if (!current || !newPass || !confirm) return Alert.alert('Error', 'Fill in all fields.');
    if (newPass !== confirm) return Alert.alert('Error', 'New passwords do not match.');
    if (newPass.length < 6) return Alert.alert('Error', 'Password must be at least 6 characters.');
    setLoading(true);
    try {
      await api.put('/members/password', { currentPassword: current, newPassword: newPass });
      Alert.alert('✅ Success', 'Password updated successfully.');
      setCurrent(''); setNewPass(''); setConfirm('');
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message || 'Failed to update password.');
    } finally { setLoading(false); }
  };

  return (
    <ScrollView style={s.container}>
      <View style={s.profileCard}>
        <View style={s.avatar}>
          <Text style={s.avatarText}>{(user.full_name || 'A').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}</Text>
        </View>
        <Text style={s.name}>{user.full_name}</Text>
        <Text style={s.role}>{user.role.replace('_', ' ')}</Text>
        <Text style={s.email}>{user.email}</Text>
      </View>

      <View style={s.section}>
        <Text style={s.sectionTitle}>🔒 Change Password</Text>
        {[['Current Password', current, setCurrent], ['New Password', newPass, setNewPass], ['Confirm New Password', confirm, setConfirm]].map(([label, val, setter]) => (
          <View key={label}>
            <Text style={s.label}>{label}</Text>
            <TextInput style={s.input} value={val} onChangeText={setter} secureTextEntry placeholderTextColor="#9ca3af" placeholder="••••••" />
          </View>
        ))}
        <TouchableOpacity style={s.btn} onPress={changePassword} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Update Password</Text>}
        </TouchableOpacity>
      </View>

      <View style={s.section}>
        <Text style={s.sectionTitle}>ℹ️ Organization Info</Text>
        {[['Organization', 'Gbeh-lay United Youths for Growth and Development'], ['Acronym', 'GUYGD'], ['Location', 'Gbeh-lay, Liberia'], ['Version', '1.0.0']].map(([k, v]) => (
          <View key={k} style={s.row}>
            <Text style={s.rowLabel}>{k}</Text>
            <Text style={s.rowVal}>{v}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={s.logoutBtn} onPress={() => Alert.alert('Logout', 'Are you sure?', [{ text: 'Cancel' }, { text: 'Logout', style: 'destructive', onPress: logout }])}>
        <Text style={s.logoutText}>🚪 Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  profileCard: { backgroundColor: '#1a1f36', padding: 28, alignItems: 'center' },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#2d6a4f', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  avatarText: { color: '#fff', fontSize: 22, fontWeight: '900' },
  name: { color: '#fff', fontSize: 18, fontWeight: '800' },
  role: { color: '#4ade80', fontSize: 13, fontWeight: '600', textTransform: 'capitalize', marginTop: 2 },
  email: { color: '#8b9bb4', fontSize: 12, marginTop: 2 },
  section: { backgroundColor: '#fff', margin: 16, borderRadius: 12, padding: 16, elevation: 2 },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: '#1a1f36', marginBottom: 14 },
  label: { fontSize: 12, fontWeight: '700', color: '#6b7280', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 11, fontSize: 14, color: '#1a1f36', marginBottom: 12 },
  btn: { backgroundColor: '#2d6a4f', borderRadius: 10, padding: 13, alignItems: 'center', marginTop: 4 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f0f2f5' },
  rowLabel: { fontSize: 13, color: '#6b7280' },
  rowVal: { fontSize: 13, color: '#1a1f36', fontWeight: '600' },
  logoutBtn: { margin: 16, backgroundColor: '#fee2e2', borderRadius: 12, padding: 14, alignItems: 'center', marginBottom: 40 },
  logoutText: { color: '#dc2626', fontWeight: '700', fontSize: 15 },
});
