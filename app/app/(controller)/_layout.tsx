import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme';

export default function ControllerTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bgElevated,
          borderTopColor: colors.borderSubtle,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tabs.Screen
        name="room"
        options={{
          title: 'Bảng điều khiển',
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name="grid-outline"
              size={size}
              color={focused ? colors.primary : colors.textMuted}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Thư viện',
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name="albums-outline"
              size={size}
              color={focused ? colors.primary : colors.textMuted}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Cài đặt',
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name="settings-outline"
              size={size}
              color={focused ? colors.primary : colors.textMuted}
            />
          ),
        }}
      />
    </Tabs>
  );
}
