import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import { useState, useEffect } from 'react'
import Colors from '../../constants/Colors'
const C = Colors

const W = Dimensions.get('window').width
const HOUR = new Date().getHours()
const GREETING = HOUR < 12 ? 'Good morning' : HOUR < 17 ? 'Good afternoon' : 'Good evening'

const KPI = [
  { label: 'Revenue', value: '£48.2k', change: '+12%', up: true, color: '#F59E0B' },
  { label: 'Projects', value: '12', change: '+2', up: true, color: '#10B981' },
  { label: 'Crew', value: '28', change: '3 free', up: true, color: '#6366F1' },
  { label: 'Invoices', value: '£7.8k', change: 'pending', up: false, color: '#EF4444' },
]

const QUICK = [
  { label: 'New Project', icon: '📁', color: '#F59E0B' },
  { label: 'Invoice', icon: '🧾', color: '#10B981' },
  { label: 'Add Crew', icon: '👥', color: '#6366F1' },
  { label: 'Contract', icon: '📄', color: '#EC4899' },
]

const DEADLINES = [
  { name: 'Neon Nights MV', client: 'Pulse Records', days: 2, urgent: true },
  { name: 'City Lights Doc', client: 'Channel 4', days: 3, urgent: true },
  { name: 'Apex Energy TVC', days: 22, client: 'Apex Corp', urgent: false },
  { name: 'Midnight Run', client: 'Indie Films', days: 103, urgent: false },
]

const ACTIVITY = [
  { icon: '💰', text: 'INV-2024 marked paid', sub: 'Pulse Records · £12,400', time: '2m ago' },
  { icon: '📝', text: 'Contract sent', sub: 'City Lights Doc · Channel 4', time: '1h ago' },
  { icon: '👤', text: 'Kai Nakamura added', sub: 'VFX Artist · £600/day', time: '3h ago' },
  { icon: '🎬', text: 'Project created', sub: 'Apex Energy TVC', time: 'Yesterday' },
  { icon: '✅', text: 'Invoice paid', sub: 'Urban Pulse EP · £6,800', time: 'Yesterday' },
]

export default function HomeScreen() {
  const [now, setNow] = useState(new Date())
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(t) }, [])

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.greeting}>{GREETING}, Ashtyn 👋</Text>
          <Text style={s.subGreeting}>Here&apos;s your production overview</Text>
        </View>
        <View style={s.avatar}>
          <Text style={s.avatarText}>A</Text>
        </View>
      </View>

      {/* KPI row */}
      <View style={s.kpiRow}>
        {KPI.map((k, i) => (
          <View key={i} style={[s.kpi, { borderLeftColor: k.color, borderLeftWidth: 2 }]}>
            <Text style={s.kpiLabel}>{k.label}</Text>
            <Text style={s.kpiValue}>{k.value}</Text>
            <Text style={[s.kpiChange, { color: k.up ? '#10B981' : '#EF4444' }]}>{k.up ? '↑' : '↓'} {k.change}</Text>
          </View>
        ))}
      </View>

      {/* Quick Actions */}
      <Text style={s.sectionTitle}>Quick Actions</Text>
      <View style={s.quickRow}>
        {QUICK.map((q, i) => (
          <TouchableOpacity key={i} activeOpacity={0.7} style={s.quickBtn}>
            <View style={[s.quickIcon, { backgroundColor: q.color + '20' }]}>
              <Text style={s.quickEmoji}>{q.icon}</Text>
            </View>
            <Text style={s.quickLabel}>{q.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Upcoming Deadlines */}
      <Text style={s.sectionTitle}>Upcoming Deadlines</Text>
      <View style={s.card}>
        {DEADLINES.map((d, i) => (
          <View key={i} style={[s.deadlineRow, i < DEADLINES.length - 1 && s.deadlineBorder]}>
            <View style={s.deadlineLeft}>
              <View style={[s.deadlineDot, { backgroundColor: d.urgent ? '#EF4444' : '#10B981' }]} />
              <View>
                <Text style={s.deadlineName}>{d.name}</Text>
                <Text style={s.deadlineClient}>{d.client}</Text>
              </View>
            </View>
            <View style={[s.deadlineBadge, { backgroundColor: d.urgent ? '#EF444420' : '#0A102030' }]}>
              <Text style={[s.deadlineDays, { color: d.urgent ? '#EF4444' : '#9CA3AF' }]}>
                {d.days <= 1 ? 'Tomorrow' : `${d.days}d`}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Activity Feed */}
      <Text style={s.sectionTitle}>Recent Activity</Text>
      <View style={s.card}>
        {ACTIVITY.map((a, i) => (
          <View key={i} style={[s.activityRow, i < ACTIVITY.length - 1 && s.activityBorder]}>
            <View style={s.activityIcon}>
              <Text style={{ fontSize: 16 }}>{a.icon}</Text>
            </View>
            <View style={s.activityText}>
              <Text style={s.activityMain}>{a.text}</Text>
              <Text style={s.activitySub}>{a.sub}</Text>
            </View>
            <Text style={s.activityTime}>{a.time}</Text>
          </View>
        ))}
      </View>

      {/* Status */}
      <View style={s.statusBar}>
        <View style={s.statusDot} />
        <Text style={s.statusText}>All systems live</Text>
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  )
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  content: { padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, paddingTop: 8 },
  greeting: { fontSize: 20, fontWeight: '700', color: C.text },
  subGreeting: { fontSize: 13, color: C.textMuted, marginTop: 2 },
  avatar: { width: 40, height: 40, borderRadius: 12, backgroundColor: C.primary, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#000', fontWeight: '800', fontSize: 16 },
  kpiRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  kpi: { width: (W - 44) / 2, backgroundColor: C.surface, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  kpiLabel: { fontSize: 11, color: C.textMuted, marginBottom: 4 },
  kpiValue: { fontSize: 22, fontWeight: '800', color: C.text },
  kpiChange: { fontSize: 11, marginTop: 3 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: C.text, marginBottom: 10 },
  quickRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  quickBtn: { flex: 1, alignItems: 'center', backgroundColor: C.surface, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  quickIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  quickEmoji: { fontSize: 18 },
  quickLabel: { fontSize: 10, color: C.textMuted, textAlign: 'center' },
  card: { backgroundColor: C.surface, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: 20, overflow: 'hidden' },
  deadlineRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12 },
  deadlineBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)' },
  deadlineLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  deadlineDot: { width: 8, height: 8, borderRadius: 4 },
  deadlineName: { fontSize: 13, fontWeight: '600', color: C.text },
  deadlineClient: { fontSize: 11, color: C.textMuted, marginTop: 1 },
  deadlineBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  deadlineDays: { fontSize: 11, fontWeight: '600' },
  activityRow: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 10 },
  activityBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)' },
  activityIcon: { width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  activityText: { flex: 1 },
  activityMain: { fontSize: 13, fontWeight: '500', color: C.text },
  activitySub: { fontSize: 11, color: C.textMuted, marginTop: 1 },
  activityTime: { fontSize: 10, color: C.textMuted },
  statusBar: { flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center', paddingVertical: 8 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981' },
  statusText: { fontSize: 11, color: '#10B981' },
})
