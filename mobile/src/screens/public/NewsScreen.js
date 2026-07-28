import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import api from '../../services/api';

export default function NewsScreen() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/news').then(r => setNews(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <View style={s.center}><ActivityIndicator color="#15803d" size="large" /></View>;

  return (
    <FlatList
      style={s.container}
      data={news}
      keyExtractor={i => String(i.id)}
      ListEmptyComponent={<Text style={s.empty}>No articles yet.</Text>}
      renderItem={({ item }) => (
        <View style={s.card}>
          <Text style={s.category}>{item.category || 'General'}</Text>
          <Text style={s.title}>{item.title}</Text>
          {item.summary ? <Text style={s.summary} numberOfLines={2}>{item.summary}</Text> : null}
          <Text style={s.date}>{new Date(item.created_at).toLocaleDateString()}</Text>
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
  category: { fontSize: 11, fontWeight: '700', color: '#15803d', textTransform: 'uppercase', marginBottom: 4 },
  title: { fontSize: 15, fontWeight: '800', color: '#1a1f36', marginBottom: 6 },
  summary: { fontSize: 13, color: '#374151', lineHeight: 18, marginBottom: 6 },
  date: { fontSize: 11, color: '#9ca3af' },
  empty: { textAlign: 'center', color: '#9ca3af', padding: 32 },
});
