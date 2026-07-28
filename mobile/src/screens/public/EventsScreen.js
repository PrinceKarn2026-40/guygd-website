import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import api from '../../services/api';

export default function EventsScreen() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/events').then(r => setEvents(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <View style={s.center}><ActivityIndicator color="#15803d" size="large" /></View>;

  return (
    <FlatList
      style={s.container}
      data={events}
      keyExtractor={i => String(i.id)}
      ListEmptyComponent={<Text style={s.empty}>No events yet.</Text>}
      renderItem={({ item }) => (
        <View style={s.card}>
          <View style={s.badge}><Text style={s.badgeText}>{item.category || 'General'}</Text></View>
          <Text style={s.title}>{item.title}</Text>
          <Text style={s.meta}>📍 {item.location || 'TBD'}</Text>
          <Text style={s.meta}>🗓 {new Date(item.event_date).toLocaleString()}</Text>
          {item.description ? <Text style={s.desc} numberOfLines={3}>{item.description}</Text> : null}
        </View>
      )}
      contentContainerStyle={{ padding: 16 }}
    />
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2 },
  badge: { backgroundColor: '#d4edda', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, marginBottom: 8 },
  badgeText: { fontSize: 11, color: '#155724', fontWeight: '700' },
  title: { fontSize: 15, fontWeight: '800', color: '#1a1f36', marginBottom: 6 },
  meta: { fontSize: 12, color: '#6b7280', marginBottom: 3 },
  desc: { fontSize: 13, color: '#374151', marginTop: 6, lineHeight: 18 },
  empty: { textAlign: 'center', color: '#9ca3af', padding: 32 },
});
