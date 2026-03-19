import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Animated,
  TouchableOpacity, RefreshControl, StatusBar, TextInput,
} from 'react-native';
import { C } from '../../constants/Colors';

const CREW = [
  { id: '1', name: 'Alex Morgan', role: 'Senior Developer', rate: 85, rating: 5, projects: 8, status: 'available', initials: 'AM', color: C.accent },
  { id: '2', name: 'Jamie Turner', role: 'UX Designer', rate: 70, rating: 5, projects: 6, status: 'busy', initials: 'JT', color: C.info },
  { id: '3', name: 'Sarah Kim', role: 'Project Manager', rate: 90, rating: 4, projects: 12, status: 'available', initials: 'SK', color: C.success },
  { id: '4', name: 'Ravi Patel', role: 'Full Stack Dev', rate: 80, rating: 5, projects: 5, status: 'available', initials: 'RP', color: C.purple },
  { id: '5', name: 'Emma Clarke', role: 'Brand Designer', rate: 75, rating: 4, projects: 9, status: 'busy', initials: 'EC', color: C.warning },
  { id: '6', name: 'Tom Walsh', role: 'Motion Designer', rate: 65, rating: 4, projects: 4, status: 'available', initials: 'TW', color: '#EC4899' },
];

const STATUS_COLOR: Record<string, string> = { available: C.success, busy: C.warning, away: C.textMuted };

function StarRow({ rating }: { rating: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <Text key={i} style={{ fontSize: 11, color: i <= rating ? C.accent : C.border }}>★</Text>
      ))}
    </View>
  );
}

function CrewCard({ member, index }: { member: typeof CREW[0]; index: number }) {
  const scale = useRef(new Animated.Value(0.92)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, delay: index * 70, useNativeDriver: true, tension: 100, friction: 8 }),
      Animated.timing(opacity, { toValue: 1, delay: index * 70, duration: 280, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.card, { transform: [{ scale }], opacity }]}>
      <View style={styles.cardInner}>
        <View style={[styles.avatar, { backgroundColor: member.color + '25', borderColor: member.color + '50' }]}>
          <Text style={[styles.avatarTxt, { color: member.color }]}>{member.initials}</Text>
        </View>
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{member.name}</Text>
            <View style={[styles.statusDot, { backgroundColor: STATUS_COLOR[member.status] }]} />
          </View>
          <Text style={styles.role}>{member.role}</Text>
          <StarRow rating={member.rating} />
        </View>
        <View style={styles.rateBox}>
          <Text style={[styles.rate, { color: member.color }]}>£{member.rate}</Text>
          <Text style={styles.rateLabel}>/hr</Text>
        </View>
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.footerTxt}>{member.projects} projects completed</Text>
        <View style={[styles.statusPill, { backgroundColor: STATUS_COLOR[member.status] + '15' }]}>
          <Text style={[styles.statusTxt, { color: STATUS_COLOR[member.status] }]}>
            {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

export default function Crew() {
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const filtered = CREW.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.role.toLowerCase().includes(search.toLowerCase())
  );

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Crew</Text>
          <Text style={styles.headerSub}>{CREW.filter(m => m.status === 'available').length} available</Text>
        </View>
        <TouchableOpacity style={styles.inviteBtn}>
          <Text style={styles.inviteTxt}>+ Invite</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search crew..."
          placeholderTextColor={C.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Summary Row */}
      <View style={styles.summaryRow}>
        {[
          { label: 'Total', value: CREW.length, color: C.text },
          { label: 'Available', value: CREW.filter(c => c.status === 'available').length, color: C.success },
          { label: 'Busy', value: CREW.filter(c => c.status === 'busy').length, color: C.warning },
        ].map(s => (
          <View key={s.label} style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.summaryLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.accent} />}
      >
        <View style={styles.list}>
          {filtered.map((m, i) => <CrewCard key={m.id} member={m} index={i} />)}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16,
  },
  headerTitle: { fontSize: 24, fontWeight: '800', color: C.text },
  headerSub: { fontSize: 13, color: C.textMuted, marginTop: 2 },
  inviteBtn: { backgroundColor: C.accentBg, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderColor: C.accentBorder },
  inviteTxt: { fontSize: 14, fontWeight: '700', color: C.accent },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginBottom: 14,
    backgroundColor: C.surface, borderRadius: 12, paddingHorizontal: 14,
    borderWidth: 1, borderColor: C.border,
  },
  searchIcon: { fontSize: 20, color: C.textMuted, marginRight: 8 },
  searchInput: { flex: 1, color: C.text, fontSize: 15, paddingVertical: 12 },
  summaryRow: {
    flexDirection: 'row', paddingHorizontal: 20, marginBottom: 12, gap: 8,
  },
  summaryItem: {
    flex: 1, backgroundColor: C.surface, borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: C.border, alignItems: 'center',
  },
  summaryValue: { fontSize: 20, fontWeight: '800', marginBottom: 2 },
  summaryLabel: { fontSize: 11, color: C.textMuted },
  scroll: { flex: 1 },
  list: { paddingHorizontal: 20 },
  card: {
    backgroundColor: C.surface, borderRadius: 16, marginBottom: 10,
    borderWidth: 1, borderColor: C.border, overflow: 'hidden',
  },
  cardInner: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  avatar: {
    width: 48, height: 48, borderRadius: 14, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  avatarTxt: { fontSize: 15, fontWeight: '800' },
  info: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  name: { fontSize: 15, fontWeight: '700', color: C.text },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  role: { fontSize: 12, color: C.textSecondary, marginBottom: 5 },
  rateBox: { alignItems: 'flex-end' },
  rate: { fontSize: 18, fontWeight: '800' },
  rateLabel: { fontSize: 11, color: C.textMuted },
  cardFooter: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 10,
    borderTopWidth: 1, borderTopColor: C.border,
    backgroundColor: C.bg + '80',
  },
  footerTxt: { fontSize: 12, color: C.textMuted },
  statusPill: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  statusTxt: { fontSize: 11, fontWeight: '600' },
});
