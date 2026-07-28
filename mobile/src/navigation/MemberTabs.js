import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Text } from 'react-native';
import HomeScreen from '../screens/public/HomeScreen';
import EventsScreen from '../screens/public/EventsScreen';
import NewsScreen from '../screens/public/NewsScreen';
import GalleryScreen from '../screens/public/GalleryScreen';
import MemberDashboardScreen from '../screens/member/MemberDashboardScreen';

const Tab = createBottomTabNavigator();

const icon = (name) => ({ focused }) => (
  <Text style={{ fontSize: 20 }}>{name}</Text>
);

export default function MemberTabs() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#052e16' },
          headerTintColor: '#fff',
          tabBarStyle: { backgroundColor: '#052e16', borderTopColor: '#15803d' },
          tabBarActiveTintColor: '#4ade80',
          tabBarInactiveTintColor: '#6b7280',
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: icon('🏠') }} />
        <Tab.Screen name="Events" component={EventsScreen} options={{ tabBarIcon: icon('📅') }} />
        <Tab.Screen name="News" component={NewsScreen} options={{ tabBarIcon: icon('📰') }} />
        <Tab.Screen name="Gallery" component={GalleryScreen} options={{ tabBarIcon: icon('🖼️') }} />
        <Tab.Screen name="Dashboard" component={MemberDashboardScreen} options={{ tabBarIcon: icon('👤') }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
