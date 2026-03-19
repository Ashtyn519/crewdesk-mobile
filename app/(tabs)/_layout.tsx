import { Tabs } from 'expo-router'
import { View, Text, StyleSheet } from 'react-native'
import C from '../../constants/Colors'

function TabIcon({ emoji, label, focused }: { emoji: string; label: string; focused: boolean }) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.iconLabel, focused && styles.iconLabelActive]}>{label}</Text>
    </View>
  )
}

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: styles.tabBar,
      tabBarShowLabel: false,
    }}>
      <Tabs.Screen name="index" options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="📊" label="Dashboard" focused={focused} /> }} />
      <Tabs.Screen name="projects" options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="📁" label="Projects" focused={focused} /> }} />
      <Tabs.Screen name="crew" options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="👥" label="Crew" focused={focused} /> }} />
      <Tabs.Screen name="invoices" options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="💷" label="Invoices" focused={focused} /> }} />
      <Tabs.Screen name="messages" options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="💬" label="Messages" focused={focused} /> }} />
      <Tabs.Screen name="settings" options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="⚙️" label="Settings" focused={focused} /> }} />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#060C18',
    borderTopColor: 'rgba(255,255,255,0.05)',
    borderTopWidth: 1,
    paddingTop: 6,
    paddingBottom: 20,
    height: 76,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 50,
    gap: 2,
  },
  iconWrapActive: {
    backgroundColor: 'rgba(245,158,11,0.12)',
  },
  emoji: { fontSize: 20 },
  iconLabel: { fontSize: 9, color: '#64748b', fontWeight: '500' },
  iconLabelActive: { color: '#f59e0b' },
})
