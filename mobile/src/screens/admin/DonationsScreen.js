import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function DonationsScreen() {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get('/donations').then(r => setDonations(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const deleteDonation = (id, name) => {
    if (user.role === 'executive') {
      setDonations(prev => prev.filter(d => d.id !== id));
      return;
    }
    Alert.alert('Delete', `Remove donation from "${name}"?`, [
      { text: 'Cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try { await api.delete(`/donations/${id}`); load(); }
        catch { Alert.alert('Error', 'Failed to delete.'); }
      }}
    ]);
  };

  const total = donations.reduce((s, d) => s + parseFloat(d.amount || 0), 0);

  if (loading) return <View style={s.center}><ActivityIndicator color="#2d6a4f" size="large" /></View>;

  return (
    <View style={s.container}>
      <View style={s.totalCard}>
        <Text style={s.totalLabel}>Total Donations</Text>
        <Text style={s.totalValue}>${total.toFixed(2)}</Text>
        <Text style={s.totalCount}>{donations.length} records</Text>
      </View>
      <FlatList
        data={donations}
        keyExtractor={i => String(i.id)}
        ListEmptyComponent={<Text style={s.empty}>No donations yet.</Text>}
        renderItem={({ item: d }) => (
          <View style={s.card}>
            <View style={s.row}>
              <View style={{ flex: 1 }}>
                <Text style={s.name}>{d.donor_name || 'Anonymous'}</Text>
                <Text style={s.sub}>{d.email || '-'}</Text>
                <Text style={s.sub}>{d.purpose || '-'} · {new Date(d.donated_at).toLocaleDateString()}</Text>
              </View>
              <Text style={s.amount}>${parseFloat(d.amount || 0).toFixed(2)}</Text>
            </View>
            <TouchableOpacity style={s.delBtn} onPress={() => deleteDonation(d.id, d.donor_name)}>
              <Text style={s.delText}>🗑️ {user.role === 'executive' ? 'Hide' : 'Delete'}</Text>
            </TouchableOpacity>
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
  totalCard: { backgroundColor: '#1a1f36', padding: 24, alignItems: 'center' },
  totalLabel: { color: '#8b9bb4', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },
  totalValue: { color: '#4ade80', fontSize: 36, fontWeight: '900', marginTop: 4 },
  totalCount: { color: '#6b7280', fontSize: 12, marginTop: 2 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10, elevation: 2 },
  row: { flexDirection: 'row', alignItems: 'center' },
  name: { fontSize: 14, fontWeight: '700', color: '#1a1f36' },
  sub: { fontSize: 12, color: '#6b7280', marginTop: 1 },
  amount: { fontSize: 18, fontWeight: '900', color: '#2d6a4f' },
  delBtn: { marginTop: 10, backgroundColor: '#fee2e2', borderRadius: 8, padding: 8, alignItems: 'center' },
  delText: { fontSize: 12, fontWeight: '700', color: '#dc2626' },
  empty: { textAlign: 'center', color: '#9ca3af', padding: 32 },
});
