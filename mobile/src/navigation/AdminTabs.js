import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Text } from 'react-native';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import MembersScreen from '../screens/admin/MembersScreen';
import ApplicationsScreen from '../screens/admin/ApplicationsScreen';
import DonationsScreen from '../screens/admin/DonationsScreen';
import AdminSettingsScreen from '../screens/admin/AdminSettingsScreen';

const Tab = createBottomTabNavigator();

const icon = (name) => () => <Text style={{ fontSize: 20 }}>{name}</Text>;

export default function AdminTabs() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#1a1f36' },
          headerTintColor: '#fff',
          tabBarStyle: { backgroundColor: '#1a1f36', borderTopColor: '#2d6a4f' },
          tabBarActiveTintColor: '#4ade80',
          tabBarInactiveTintColor: '#6b7280',
        }}
      >
        <Tab.Screen name="Dashboard" component={AdminDashboardScreen} options={{ tabBarIcon: icon('📊') }} />
        <Tab.Screen name="Members" component={MembersScreen} options={{ tabBarIcon: icon('👥') }} />
        <Tab.Screen name="Applications" component={ApplicationsScreen} options={{ tabBarIcon: icon('🎓') }} />
        <Tab.Screen name="Donations" component={DonationsScreen} options={{ tabBarIcon: icon('💰') }} />
        <Tab.Screen name="Settings" component={AdminSettingsScreen} options={{ tabBarIcon: icon('⚙️') }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
