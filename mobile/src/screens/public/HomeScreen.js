import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import api from '../../services/api';

export default function HomeScreen({ navigation }) {
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/news'), api.get('/events')])
      .then(([n, e]) => { setNews(n.data.slice(0, 3)); setEvents(e.data.slice(0, 3)); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <View style={s.center}><ActivityIndicator color="#15803d" size="large" /></View>;

  return (
    <ScrollView style={s.container}>
      <View style={s.hero}>
        <Text style={s.heroTitle}>🌿 GUYGD</Text>
        <Text style={s.heroSub}>Gbeh-lay United Youths for{'\n'}Growth and Development</Text>
        <Text style={s.motto}>✦ Voice of the Voiceless ✦</Text>
      </View>

      <View style={s.section}>
        <Text style={s.sectionTitle}>📰 Latest News</Text>
        {news.length ? news.map(n => (
          <View key={n.id} style={s.card}>
            <Text style={s.cardTitle}>{n.title}</Text>
            <Text style={s.cardSub}>{n.category || 'General'} · {new Date(n.created_at).toLocaleDateString()}</Text>
            {n.summary ? <Text style={s.cardBody} numberOfLines={2}>{n.summary}</Text> : null}
          </View>
        )) : <Text style={s.empty}>No news yet.</Text>}
      </View>

      <View style={s.section}>
        <Text style={s.sectionTitle}>📅 Upcoming Events</Text>
        {events.length ? events.map(e => (
          <View key={e.id} style={s.card}>
            <Text style={s.cardTitle}>{e.title}</Text>
            <Text style={s.cardSub}>{e.location || 'TBD'} · {new Date(e.event_date).toLocaleDateString()}</Text>
          </View>
        )) : <Text style={s.empty}>No upcoming events.</Text>}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  hero: { backgroundColor: '#052e16', padding: 32, alignItems: 'center' },
  heroTitle: { fontSize: 32, fontWeight: '900', color: '#4ade80' },
  heroSub: { fontSize: 14, color: 'rgba(255,255,255,0.75)', textAlign: 'center', marginTop: 6 },
  motto: { fontSize: 12, color: '#f59e0b', marginTop: 8, fontStyle: 'italic' },
  section: { padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1a1f36', marginBottom: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#1a1f36', marginBottom: 4 },
  cardSub: { fontSize: 12, color: '#6b7280', marginBottom: 4 },
  cardBody: { fontSize: 13, color: '#374151', lineHeight: 18 },
  empty: { color: '#9ca3af', fontSize: 13, textAlign: 'center', padding: 16 },
});
