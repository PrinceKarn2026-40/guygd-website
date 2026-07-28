import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function MemberDashboardScreen() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/members/${user.id}`),
      api.get('/scholarships').catch(() => ({ data: [] }))
    ]).then(([p, s]) => {
      setProfile(p.data);
      setScholarships(s.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <View style={s.center}><ActivityIndicator color="#15803d" size="large" /></View>;

  const initials = (user.full_name || 'M').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

  return (
    <ScrollView style={s.container}>
      {/* Profile Card */}
      <View style={s.profileCard}>
        <View style={s.avatar}><Text style={s.avatarText}>{initials}</Text></View>
        <Text style={s.name}>{user.full_name}</Text>
        <Text style={s.memberId}>{profile?.member_id || `GUYGD-${String(user.id).padStart(4,'0')}`}</Text>
        <View style={s.statusBadge}>
          <Text style={s.statusText}>{profile?.status || 'active'}</Text>
        </View>
      </View>

      {/* Info Grid */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>👤 My Information</Text>
        {[
          ['Email', profile?.email],
          ['Phone', profile?.phone],
          ['Gender', profile?.gender],
          ['County', profile?.county],
          ['Membership', profile?.membership_type],
          ['Joined', profile?.joined_at ? new Date(profile.joined_at).toLocaleDateString() : '-'],
        ].map(([label, val]) => val ? (
          <View key={label} style={s.row}>
            <Text style={s.rowLabel}>{label}</Text>
            <Text style={s.rowVal}>{val}</Text>
          </View>
        ) : null)}
      </View>

      {/* Scholarships */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>🎓 My Scholarship Applications</Text>
        {scholarships.length ? scholarships.map(sc => (
          <View key={sc.id} style={s.card}>
            <Text style={s.cardTitle}>{sc.school || 'N/A'}</Text>
            <Text style={s.cardSub}>{sc.level} · <Text style={{ color: sc.status === 'approved' ? '#15803d' : sc.status === 'rejected' ? '#dc2626' : '#856404' }}>{sc.status}</Text></Text>
          </View>
        )) : <Text style={s.empty}>No scholarship applications yet.</Text>}
      </View>

      <TouchableOpacity style={s.logoutBtn} onPress={() => Alert.alert('Logout', 'Are you sure?', [{ text: 'Cancel' }, { text: 'Logout', style: 'destructive', onPress: logout }])}>
        <Text style={s.logoutText}>🚪 Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  profileCard: { backgroundColor: '#052e16', padding: 32, alignItems: 'center' },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#15803d', justifyContent: 'center', alignItems: 'center', marginBottom: 12, borderWidth: 3, borderColor: '#4ade80' },
  avatarText: { color: '#fff', fontSize: 24, fontWeight: '900' },
  name: { color: '#fff', fontSize: 20, fontWeight: '800' },
  memberId: { color: '#4ade80', fontSize: 13, fontFamily: 'monospace', marginTop: 4 },
  statusBadge: { backgroundColor: '#16a34a', paddingHorizontal: 14, paddingVertical: 4, borderRadius: 20, marginTop: 8 },
  statusText: { color: '#fff', fontSize: 12, fontWeight: '700', textTransform: 'capitalize' },
  section: { backgroundColor: '#fff', margin: 16, borderRadius: 12, padding: 16, elevation: 2 },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: '#1a1f36', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f0f2f5' },
  rowLabel: { fontSize: 13, color: '#6b7280', fontWeight: '600' },
  rowVal: { fontSize: 13, color: '#1a1f36', fontWeight: '500', maxWidth: '60%', textAlign: 'right' },
  card: { backgroundColor: '#f9fafb', borderRadius: 8, padding: 12, marginBottom: 8 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#1a1f36' },
  cardSub: { fontSize: 12, color: '#6b7280', marginTop: 3 },
  empty: { color: '#9ca3af', fontSize: 13, textAlign: 'center', padding: 12 },
  logoutBtn: { margin: 16, backgroundColor: '#fee2e2', borderRadius: 12, padding: 14, alignItems: 'center' },
  logoutText: { color: '#dc2626', fontWeight: '700', fontSize: 15 },
});
