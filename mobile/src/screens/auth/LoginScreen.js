import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Error', 'Please fill in all fields.');
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (e) {
      Alert.alert('Login Failed', e.response?.data?.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={s.card}>
        <Text style={s.logo}>🌿 GUYGD</Text>
        <Text style={s.title}>Welcome Back</Text>
        <Text style={s.sub}>Sign in to your account</Text>

        <TextInput style={s.input} placeholder="Email" placeholderTextColor="#9ca3af"
          value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={s.input} placeholder="Password" placeholderTextColor="#9ca3af"
          value={password} onChangeText={setPassword} secureTextEntry />

        <TouchableOpacity style={s.btn} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Sign In</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={s.link}>Don't have an account? <Text style={s.linkBold}>Apply for membership</Text></Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#052e16', justifyContent: 'center', padding: 24 },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 28 },
  logo: { fontSize: 28, fontWeight: '900', color: '#15803d', textAlign: 'center', marginBottom: 8 },
  title: { fontSize: 22, fontWeight: '800', color: '#052e16', textAlign: 'center' },
  sub: { fontSize: 13, color: '#6b7280', textAlign: 'center', marginBottom: 24 },
  input: { borderWidth: 1.5, borderColor: '#d1fae5', borderRadius: 10, padding: 12, fontSize: 15, marginBottom: 14, color: '#1a1f36' },
  btn: { backgroundColor: '#15803d', borderRadius: 12, padding: 14, alignItems: 'center', marginBottom: 16 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  link: { textAlign: 'center', color: '#6b7280', fontSize: 13 },
  linkBold: { color: '#15803d', fontWeight: '700' },
});
