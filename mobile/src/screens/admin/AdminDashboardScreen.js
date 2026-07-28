import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import api from '../../services/api';

export default function AdminDashboardScreen() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/members'),
      api.get('/events'),
      api.get('/donations'),
      api.get('/news/all').catch(() => ({ data: [] })),
      api.get('/applications'),
    ]).then(([m, e, d, n, a]) => {
      setStats({
        members: m.data.length,
        events: e.data.length,
        donations: d.data.length,
        news: n.data.length,
        pending: a.data.filter(x => x.status === 'pending').length,
      });
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <View style={s.center}><ActivityIndicator color="#4ade80" size="large" /></View>;

  const cards = [
    { icon: '👥', label: 'Members', value: stats.members, color: '#d4edda', text: '#155724' },
    { icon: '📅', label: 'Events', value: stats.events, color: '#fff3cd', text: '#856404' },
    { icon: '💰', label: 'Donations', value: stats.donations, color: '#e8d5f5', text: '#6f42c1' },
    { icon: '📰', label: 'News', value: stats.news, color: '#d1ecf1', text: '#0c5460' },
    { icon: '⏳', label: 'Pending', value: stats.pending, color: '#fee2e2', text: '#dc2626' },
  ];

  return (
    <ScrollView style={s.container}>
      <View style={s.header}>
        <Text style={s.headerTitle}>📊 Admin Dashboard</Text>
        <Text style={s.headerSub}>GUYGD Overview</Text>
      </View>
      <View style={s.grid}>
        {cards.map(c => (
          <View key={c.label} style={[s.card, { backgroundColor: c.color }]}>
            <Text style={s.cardIcon}>{c.icon}</Text>
            <Text style={[s.cardValue, { color: c.text }]}>{c.value}</Text>
            <Text style={[s.cardLabel, { color: c.text }]}>{c.label}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1f36' },
  header: { backgroundColor: '#1a1f36', padding: 24 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '800' },
  headerSub: { color: '#8b9bb4', fontSize: 13, marginTop: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: 12, gap: 12 },
  card: { width: '46%', borderRadius: 14, padding: 18, alignItems: 'center', elevation: 2 },
  cardIcon: { fontSize: 28, marginBottom: 8 },
  cardValue: { fontSize: 28, fontWeight: '900' },
  cardLabel: { fontSize: 12, fontWeight: '700', marginTop: 2, textTransform: 'uppercase' },
});
