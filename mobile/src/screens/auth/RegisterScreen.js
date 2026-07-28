import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import api from '../../services/api';

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', password: '', gender: 'Male', county: '', membership_type: 'Regular Member' });
  const [loading, setLoading] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleRegister = async () => {
    if (!form.first_name || !form.last_name || !form.email || !form.phone) {
      return Alert.alert('Error', 'Please fill in all required fields.');
    }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries({ ...form, full_name: `${form.first_name} ${form.last_name}` }).forEach(([k, v]) => fd.append(k, v));
      await api.post('/applications', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      Alert.alert('✅ Application Submitted', 'An admin will review your application and notify you by email.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message || 'Submission failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: 24 }}>
      <Text style={s.logo}>🌿 GUYGD</Text>
      <Text style={s.title}>Apply for Membership</Text>

      {[['First Name *', 'first_name'], ['Last Name *', 'last_name'], ['Email *', 'email'], ['Phone *', 'phone'], ['County', 'county']].map(([label, key]) => (
        <View key={key}>
          <Text style={s.label}>{label}</Text>
          <TextInput style={s.input} value={form[key]} onChangeText={v => set(key, v)}
            keyboardType={key === 'email' ? 'email-address' : 'default'} autoCapitalize={key === 'email' ? 'none' : 'words'} />
        </View>
      ))}

      <Text style={s.label}>Membership Type</Text>
      <View style={s.row}>
        {['Regular Member', 'Associate Member', 'Veteran Member'].map(t => (
          <TouchableOpacity key={t} style={[s.chip, form.membership_type === t && s.chipActive]} onPress={() => set('membership_type', t)}>
            <Text style={[s.chipText, form.membership_type === t && s.chipTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={s.btn} onPress={handleRegister} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>🚀 Submit Application</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={s.link}>Already a member? <Text style={s.linkBold}>Sign in</Text></Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#052e16' },
  logo: { fontSize: 26, fontWeight: '900', color: '#4ade80', textAlign: 'center', marginBottom: 4, marginTop: 40 },
  title: { fontSize: 20, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 24 },
  label: { fontSize: 12, fontWeight: '700', color: '#d1fae5', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { borderWidth: 1.5, borderColor: '#166534', borderRadius: 10, padding: 12, fontSize: 15, marginBottom: 14, color: '#fff', backgroundColor: 'rgba(255,255,255,0.08)' },
  btn: { backgroundColor: '#16a34a', borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 8, marginBottom: 16 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  link: { textAlign: 'center', color: '#9ca3af', fontSize: 13 },
  linkBold: { color: '#4ade80', fontWeight: '700' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#166534' },
  chipActive: { backgroundColor: '#16a34a', borderColor: '#16a34a' },
  chipText: { color: '#9ca3af', fontSize: 12 },
  chipTextActive: { color: '#fff', fontWeight: '700' },
});
