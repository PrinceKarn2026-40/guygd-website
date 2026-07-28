import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import api from '../../services/api';

export default function ApplicationsScreen() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get('/applications').then(r => setApps(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const approve = async (id, name) => {
    Alert.alert('Approve', `Approve application from ${name}?`, [
      { text: 'Cancel' },
      { text: 'Approve', onPress: async () => {
        try {
          const r = await api.post(`/applications/${id}/approve`);
          Alert.alert('✅ Approved', `Member ID: ${r.data.member_code}\nTemp Password: ${r.data.temp_password}`);
          load();
        } catch (e) { Alert.alert('Error', e.response?.data?.message || 'Failed'); }
      }}
    ]);
  };

  const reject = async (id) => {
    Alert.alert('Reject', 'Reject this application?', [
      { text: 'Cancel' },
      { text: 'Reject', style: 'destructive', onPress: async () => {
        try { await api.post(`/applications/${id}/reject`, { reason: null }); load(); }
        catch (e) { Alert.alert('Error', 'Failed to reject.'); }
      }}
    ]);
  };

  if (loading) return <View style={s.center}><ActivityIndicator color="#2d6a4f" size="large" /></View>;

  return (
    <FlatList
      style={s.container}
      data={apps}
      keyExtractor={i => String(i.id)}
      ListEmptyComponent={<Text style={s.empty}>No applications.</Text>}
      renderItem={({ item: a }) => (
        <View style={s.card}>
          <View style={s.row}>
            <View style={s.avatar}><Text style={s.avatarText}>{(a.full_name||'?')[0].toUpperCase()}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={s.name}>{a.full_name}</Text>
              <Text style={s.sub}>{a.email}</Text>
              <Text style={s.sub}>{a.membership_type} · {new Date(a.submitted_at).toLocaleDateString()}</Text>
            </View>
            <View style={[s.badge, { backgroundColor: a.status === 'pending' ? '#fff3cd' : a.status === 'approved' ? '#d4edda' : '#fee2e2' }]}>
              <Text style={{ fontSize: 10, fontWeight: '700', color: a.status === 'pending' ? '#856404' : a.status === 'approved' ? '#155724' : '#dc2626' }}>{a.status}</Text>
            </View>
          </View>
          {a.status === 'pending' && (
            <View style={s.actions}>
              <TouchableOpacity style={s.btnGreen} onPress={() => approve(a.id, a.full_name)}>
                <Text style={s.btnText}>✓ Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.btnRed} onPress={() => reject(a.id)}>
                <Text style={s.btnText}>✕ Reject</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
      contentContainerStyle={{ padding: 16 }}
    />
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10, elevation: 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#2d6a4f', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  name: { fontSize: 14, fontWeight: '700', color: '#1a1f36' },
  sub: { fontSize: 12, color: '#6b7280', marginTop: 1 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 10 },
  btnGreen: { flex: 1, backgroundColor: '#d4edda', borderRadius: 8, padding: 8, alignItems: 'center' },
  btnRed: { flex: 1, backgroundColor: '#fee2e2', borderRadius: 8, padding: 8, alignItems: 'center' },
  btnText: { fontSize: 12, fontWeight: '700', color: '#1a1f36' },
  empty: { textAlign: 'center', color: '#9ca3af', padding: 32 },
});
