import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Animated,
  TouchableOpacity, RefreshControl, StatusBar, Dimensions,
} from 'react-native';
import { C } from '../../constants/Colors';

const { width } = Dimensions.get('window');

const STATS = [
  { label: 'Active Projects', value: 12, icon: '◆', color: C.accent, bg: C.accentBg },
  { label: 'Crew Members', value: 28, icon: '◉', color: C.info, bg: C.infoBg },
  { label: 'Pending Invoices', value: 5, icon: '◈', color: C.warning, bg: C.warningBg },
  { label: 'Total Earned', value: '£48k', icon: '◎', color: C.success, bg: C.successBg },
];

const ACTIVITY = [
  { id: 1, type: 'invoice', text: 'Invoice #INV-041 marked paid', time: '2m ago', dot: C.success },
  { id: 2, type: 'crew', text: 'Alex M. joined "Brand Refresh"', time: '1h ago', dot: C.info },
  { id: 3, type: 'project', text: 'Project "Website Redesign" updated', time: '3h ago', dot: C.accent },
  { id: 4, type: 'contract', text: 'Contract signed by Sarah K.', time: '5h ago', dot: C.purple },
  { id: 5, type: 'message', text: 'New message from Jamie T.', time: '1d ago', dot: C.textSecondary },
];

const PROJECTS = [
  { id: 1, name: 'Brand Refresh', crew: 4, progress: 72, status: 'On Track' },
  { id: 2, name: 'App Prototype', crew: 2, progress: 45, status: 'In Progress' },
  { id: 3, name: 'Marketing Push', crew: 6, progress: 88, status: 'Near Done' },
];

function StatCard({ stat, index }: { stat: typeof STATS[0]; index: number }) {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1, delay: index * 100, useNativeDriver: true,
        tension: 100, friction: 8,
      }),
      Animated.timing(opacity, {
        toValue: 1, delay: index * 100, duration: 300, useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.statCard, { transform: [{ scale }], opacity }]}>
      <View style={[styles.statIcon, { backgroundColor: stat.bg }]}>
        <Text style={[styles.statIconTxt, { color: stat.color }]}>{stat.icon}</Text>
      </View>
      <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
      <Text style={styles.statLabel}>{stat.label}</Text>
    </Animated.View>
  );
}

function ProgressBar({ progress, color }: { progress: number; color: string }) {
  const width_anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(width_anim, { toValue: progress, useNativeDriver: false, tension: 60, friction: 10 }).start();
  }, []);
  return (
    <View style={styles.progressBg}>
      <Animated.View style={[styles.progressFill, {
        width: width_anim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
        backgroundColor: color,
      }]} />
    </View>
  );
}

export default function Dashboard() {
  const [refreshing, setRefreshing] = useState(false);
  const headerY = useRef(new Animated.Value(-30)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(headerY, { toValue: 0, useNativeDriver: true, tension: 80, friction: 10 }),
      Animated.timing(headerOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.accent} />}
      >
        {/* Header */}
        <Animated.View style={[styles.header, { transform: [{ translateY: headerY }], opacity: headerOpacity }]}>
          <View>
            <Text style={styles.greeting}>Good morning 👋</Text>
            <Text style={styles.name}>Welcome back</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarTxt}>CD</Text>
          </View>
        </Animated.View>

        {/* Headline */}
        <View style={styles.headlineBox}>
          <Text style={styles.headlinePre}>Operating system for your</Text>
          <Text style={styles.headline}>Freelance Workforce</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {STATS.map((s, i) => <StatCard key={s.label} stat={s} index={i} />)}
        </View>

        {/* Active Projects */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Projects</Text>
          {PROJECTS.map((p) => (
            <View key={p.id} style={styles.projectCard}>
              <View style={styles.projectRow}>
                <Text style={styles.projectName}>{p.name}</Text>
                <View style={[styles.badge, { backgroundColor: C.accentBg, borderColor: C.accentBorder }]}>
                  <Text style={[styles.badgeTxt, { color: C.accent }]}>{p.status}</Text>
                </View>
              </View>
              <View style={styles.projectMeta}>
                <Text style={styles.metaTxt}>{p.crew} crew members</Text>
                <Text style={[styles.metaTxt, { color: C.accent }]}>{p.progress}%</Text>
              </View>
              <ProgressBar progress={p.progress} color={C.accent} />
            </View>
          ))}
        </View>

        {/* Activity Feed */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            {ACTIVITY.map((a, i) => (
              <View key={a.id} style={[styles.activityRow, i < ACTIVITY.length - 1 && styles.activityBorder]}>
                <View style={[styles.dot, { backgroundColor: a.dot }]} />
                <View style={styles.activityContent}>
                  <Text style={styles.activityTxt}>{a.text}</Text>
                  <Text style={styles.activityTime}>{a.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 60, paddingBottom: 8,
  },
  greeting: { fontSize: 13, color: C.textMuted, marginBottom: 2 },
  name: { fontSize: 20, fontWeight: '700', color: C.text },
  avatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center',
  },
  avatarTxt: { fontSize: 13, fontWeight: '700', color: '#000' },
  headlineBox: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 },
  headlinePre: { fontSize: 13, color: C.textMuted, marginBottom: 2 },
  headline: { fontSize: 26, fontWeight: '800', color: C.text, letterSpacing: -0.5 },
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12,
    paddingTop: 12, gap: 8,
  },
  statCard: {
    width: (width - 40) / 2, backgroundColor: C.surface,
    borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.border,
  },
  statIcon: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  statIconTxt: { fontSize: 18 },
  statValue: { fontSize: 24, fontWeight: '800', marginBottom: 4 },
  statLabel: { fontSize: 12, color: C.textMuted, lineHeight: 16 },
  section: { paddingHorizontal: 20, paddingTop: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: C.text, marginBottom: 12 },
  projectCard: {
    backgroundColor: C.surface, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: C.border, marginBottom: 10,
  },
  projectRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  projectName: { fontSize: 15, fontWeight: '600', color: C.text, flex: 1 },
  badge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1 },
  badgeTxt: { fontSize: 11, fontWeight: '600' },
  projectMeta: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  metaTxt: { fontSize: 12, color: C.textSecondary },
  progressBg: { height: 6, backgroundColor: C.border, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  activityCard: {
    backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border,
  },
  activityRow: { flexDirection: 'row', alignItems: 'center', padding: 14, paddingHorizontal: 16 },
  activityBorder: { borderBottomWidth: 1, borderBottomColor: C.border },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 12 },
  activityContent: { flex: 1 },
  activityTxt: { fontSize: 13, color: C.text, marginBottom: 2 },
  activityTime: { fontSize: 11, color: C.textMuted },
});
