import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { C } from '@/constants/Colors';

const { width } = Dimensions.get('window');

function StatCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <View style={[st.statCard, accent && { borderColor: C.accentBorder }]}>
      <Text style={st.statLabel}>{label}</Text>
      <Text style={[st.statValue, accent && { color: C.warning }]}>{value}</Text>
      {sub && <Text style={st.statSub}>{sub}</Text>}
    </View>
  );
}

export default function OverviewScreen() {
  return (
    <ScrollView style={st.screen} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
      {/* Header */}
      <View style={st.header}>
        <View style={{ flex: 1 }}>
          <Text style={st.greeting}>Good evening, Ashtyn.</Text>
          <Text style={st.date}>Tuesday, 17 March 2026</Text>
        </View>
        <View style={st.avatar}><Text style={st.avatarTxt}>A</Text></View>
      </View>

      {/* Stats */}
      <View style={st.statsGrid}>
        <StatCard label="PROJECTS" value="0" sub="Start one" />
        <StatCard label="FREELANCERS" value="0" sub="Invite crew" />
        <StatCard label="REVENUE" value="£0" sub="This month" />
        <StatCard label="PENDING" value="£0" sub="Awaiting" accent />
      </View>

      {/* Recent activity */}
      <View style={st.sectionRow}>
        <Text style={st.sectionTitle}>Recent activity</Text>
      </View>
      <View style={st.emptyCard}>
        <View style={st.emptyIcon}><Text style={{ fontSize: 20, color: C.accentLight }}>⚡</Text></View>
        <Text style={st.emptyTitle}>No activity yet</Text>
        <Text style={st.emptySub}>Create your first project to get started.</Text>
        <TouchableOpacity style={st.emptyBtn} activeOpacity={0.8}>
          <Text style={st.emptyBtnTxt}>New project</Text>
        </TouchableOpacity>
      </View>

      {/* Quick actions */}
      <View style={st.sectionRow}>
        <Text style={st.sectionTitle}>Quick actions</Text>
      </View>
      {['New project', 'Invite freelancer', 'Create contract', 'Send invoice'].map(a => (
        <TouchableOpacity key={a} style={st.quickAction} activeOpacity={0.7}>
          <Text style={st.quickTxt}>{a}</Text>
          <Text style={{ fontSize: 20, color: C.textMuted }}>›</Text>
        </TouchableOpacity>
      ))}

      {/* Setup guide */}
      <View style={[st.card, { marginTop: 16 }]}>
        <Text style={[st.sectionTitle, { color: C.accentLight, marginBottom: 6 }]}>Setup guide</Text>
        <Text style={st.emptySub}>Complete your workspace setup to get the most out of CrewDesk.</Text>
        <View style={st.progressBg}><View style={[st.progressFill, { width: '15%' }]} /></View>
        <Text style={[st.emptySub, { marginTop: 6 }]}>1 of 7 steps complete</Text>
      </View>
    </ScrollView>
  );
}

const st = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 20, paddingTop: 16 },
  greeting: { fontSize: 22, fontWeight: '700', color: C.textPrimary, letterSpacing: -0.5 },
  date: { fontSize: 13, color: C.textMuted, marginTop: 2 },
  avatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: C.accentBg, borderWidth: 1, borderColor: C.accentBorder, alignItems: 'center', justifyContent: 'center' },
  avatarTxt: { fontSize: 13, fontWeight: '700', color: C.accentLight },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, gap: 8, marginBottom: 24 },
  statCard: { flex: 1, minWidth: (width - 56) / 2, backgroundColor: C.surface, borderRadius: 10, borderWidth: 1, borderColor: C.border, padding: 16 },
  statLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.8, color: C.textMuted, marginBottom: 6 },
  statValue: { fontSize: 24, fontWeight: '700', color: C.textPrimary, letterSpacing: -0.5 },
  statSub: { fontSize: 11, color: C.textMuted, marginTop: 2 },
  sectionRow: { paddingHorizontal: 20, marginBottom: 10 },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: C.textSecondary },
  emptyCard: { alignItems: 'center', padding: 40, marginHorizontal: 20, backgroundColor: C.surface, borderRadius: 10, borderWidth: 1, borderColor: C.border, marginBottom: 24 },
  emptyIcon: { width: 48, height: 48, borderRadius: 10, backgroundColor: C.accentBg, borderWidth: 1, borderColor: C.accentBorder, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  emptyTitle: { fontSize: 14, fontWeight: '600', color: C.textSecondary, marginBottom: 6 },
  emptySub: { fontSize: 13, color: C.textMuted, textAlign: 'center', lineHeight: 20, marginBottom: 16 },
  emptyBtn: { backgroundColor: C.accentBg, borderRadius: 7, paddingHorizontal: 20, paddingVertical: 10, borderWidth: 1, borderColor: C.accentBorder },
  emptyBtnTxt: { fontSize: 13, fontWeight: '700', color: C.accentLight },
  quickAction: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20, marginBottom: 8, padding: 14, backgroundColor: C.surface, borderRadius: 8, borderWidth: 1, borderColor: C.border },
  quickTxt: { fontSize: 13, color: C.textSecondary },
  card: { backgroundColor: C.surface, borderRadius: 10, borderWidth: 1, borderColor: C.border, padding: 16, marginHorizontal: 20 },
  progressBg: { height: 3, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 2, marginTop: 10 },
  progressFill: { height: 3, backgroundColor: C.accent, borderRadius: 2 },
});
