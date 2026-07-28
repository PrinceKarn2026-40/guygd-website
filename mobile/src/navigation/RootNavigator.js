import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import MemberTabs from './MemberTabs';
import AdminTabs from './AdminTabs';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#052e16' }}>
        <ActivityIndicator size="large" color="#4ade80" />
      </View>
    );
  }

  if (!user) return <AuthNavigator />;
  if (['admin', 'executive', 'super_admin'].includes(user.role)) return <AdminTabs />;
  return <MemberTabs />;
}
