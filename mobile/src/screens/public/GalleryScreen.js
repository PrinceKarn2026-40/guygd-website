import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import api from '../../services/api';

const SIZE = (Dimensions.get('window').width - 48) / 2;

export default function GalleryScreen() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/gallery').then(r => setImages(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <View style={s.center}><ActivityIndicator color="#15803d" size="large" /></View>;

  return (
    <FlatList
      style={s.container}
      data={images}
      keyExtractor={i => String(i.id)}
      numColumns={2}
      ListEmptyComponent={<Text style={s.empty}>No images yet.</Text>}
      renderItem={({ item }) => (
        <View style={s.item}>
          <Image source={{ uri: item.image_url }} style={s.img} resizeMode="cover" />
          {item.title ? <Text style={s.caption} numberOfLines={1}>{item.title}</Text> : null}
        </View>
      )}
      contentContainerStyle={{ padding: 16 }}
    />
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  item: { width: SIZE, margin: 4, borderRadius: 10, overflow: 'hidden', backgroundColor: '#fff', elevation: 2 },
  img: { width: SIZE, height: SIZE },
  caption: { fontSize: 11, color: '#374151', padding: 6 },
  empty: { textAlign: 'center', color: '#9ca3af', padding: 32 },
});
