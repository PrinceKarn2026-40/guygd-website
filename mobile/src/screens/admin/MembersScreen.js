import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, TextInput } from 'react-native';
import api from '../../services/api';

export default function MembersScreen() {
  const [members, setMembers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = () => {
    setLoading(true);
    api.get('/members').then(r => { setMembers(r.data); setFiltered(r.data); }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(members.filter(m => m.full_name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)));
  }, [search, members]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/members/${id}`, { status });
      load();
    } catch { Alert.alert('Error', 'Failed to update status.'); }
  };

  if (loading) return <View style={s.center}><ActivityIndicator color="#2d6a4f" size="large" /></View>;

  return (
    <View style={s.container}>
      <TextInput style={s.search} placeholder="Search name or email..." value={search} onChangeText={setSearch} placeholderTextColor="#9ca3af" />
      <FlatList
        data={filtered}
        keyExtractor={i => String(i.id)}
        ListEmptyComponent={<Text style={s.empty}>No members found.</Text>}
        renderItem={({ item: m }) => (
          <View style={s.card}>
            <View style={s.row}>
              <View style={s.avatar}><Text style={s.avatarText}>{(m.full_name||'?')[0].toUpperCase()}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={s.name}>{m.full_name}</Text>
                <Text style={s.sub}>{m.email}</Text>
                <Text style={s.sub}>{m.member_id || '-'} · {m.county || '-'}</Text>
              </View>
              <View style={[s.badge, { backgroundColor: m.status === 'active' ? '#d4edda' : '#fee2e2' }]}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: m.status === 'active' ? '#155724' : '#dc2626' }}>{m.status}</Text>
              </View>
            </View>
            <View style={s.actions}>
              <TouchableOpacity style={s.btnGreen} onPress={() => updateStatus(m.id, 'active')}>
                <Text style={s.btnText}>✓ Activate</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.btnRed} onPress={() => updateStatus(m.id, 'suspended')}>
                <Text style={s.btnText}>✕ Suspend</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  search: { margin: 16, marginBottom: 0, backgroundColor: '#fff', borderRadius: 10, padding: 12, fontSize: 14, color: '#1a1f36', elevation: 1 },
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
