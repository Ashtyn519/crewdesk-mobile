import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Animated,
  TouchableOpacity, RefreshControl, StatusBar, Modal,
  TextInput, Alert, Dimensions,
} from 'react-native';
import { C } from '../../constants/Colors';

const { width } = Dimensions.get('window');

const MOCK_PROJECTS = [
  { id: '1', name: 'Brand Identity Refresh', client: 'Axiom Studio', budget: 8500, spent: 6120, status: 'active', crew: 4, deadline: '2026-04-15' },
  { id: '2', name: 'E-Commerce Platform', client: 'Retail Co.', budget: 24000, spent: 9800, status: 'active', crew: 7, deadline: '2026-06-01' },
  { id: '3', name: 'Mobile App Prototype', client: 'StartupX', budget: 12000, spent: 5400, status: 'active', crew: 3, deadline: '2026-05-20' },
  { id: '4', name: 'Marketing Campaign', client: 'GlobalBrand', budget: 6000, spent: 6000, status: 'completed', crew: 5, deadline: '2026-02-28' },
  { id: '5', name: 'SaaS Dashboard', client: 'TechFlow', budget: 18000, spent: 2100, status: 'active', crew: 6, deadline: '2026-07-10' },
];

const STATUS_COLOR: Record<string, string> = {
  active: C.success, completed: C.info, paused: C.warning,
};

function ProjectCard({ project, index }: { project: typeof MOCK_PROJECTS[0]; index: number }) {
  const translateX = useRef(new Animated.Value(-40)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const progress = project.budget > 0 ? (project.spent / project.budget) * 100 : 0;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateX, { toValue: 0, delay: index * 80, useNativeDriver: true, tension: 80, friction: 10 }),
      Animated.timing(opacity, { toValue: 1, delay: index * 80, duration: 300, useNativeDriver: true }),
      Animated.spring(progressAnim, { toValue: progress, delay: index * 80 + 200, useNativeDriver: false, tension: 60, friction: 12 }),
    ]).start();
  }, []);

  const daysLeft = Math.ceil((new Date(project.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const isUrgent = daysLeft < 14;

  return (
    <Animated.View style={[styles.card, { transform: [{ translateX }], opacity }]}>
      <View style={styles.cardTop}>
        <View style={styles.cardLeft}>
          <Text style={styles.cardName}>{project.name}</Text>
          <Text style={styles.cardClient}>{project.client}</Text>
        </View>
        <View style={[styles.statusPill, { backgroundColor: STATUS_COLOR[project.status] + '20', borderColor: STATUS_COLOR[project.status] + '40' }]}>
          <View style={[styles.statusDot, { backgroundColor: STATUS_COLOR[project.status] }]} />
          <Text style={[styles.statusTxt, { color: STATUS_COLOR[project.status] }]}>{project.status}</Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Budget</Text>
          <Text style={styles.metaValue}>£{project.budget.toLocaleString()}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Crew</Text>
          <Text style={styles.metaValue}>{project.crew} members</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Deadline</Text>
          <Text style={[styles.metaValue, isUrgent && { color: C.error }]}>
            {isUrgent && daysLeft > 0 ? `${daysLeft}d left` : project.deadline.slice(0, 10)}
          </Text>
        </View>
      </View>

      <View style={styles.budgetRow}>
        <Text style={styles.budgetLabel}>Spent: £{project.spent.toLocaleString()}</Text>
        <Text style={[styles.budgetPct, { color: progress > 80 ? C.warning : C.accent }]}>{Math.round(progress)}%</Text>
      </View>
      <View style={styles.progressBg}>
        <Animated.View style={[styles.progressFill, {
          width: progressAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
          backgroundColor: progress > 90 ? C.error : progress > 70 ? C.warning : C.accent,
        }]} />
      </View>
    </Animated.View>
  );
}

export default function Projects() {
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newClient, setNewClient] = useState('');

  const filtered = filter === 'all' ? MOCK_PROJECTS : MOCK_PROJECTS.filter(p => p.status === filter);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Projects</Text>
          <Text style={styles.headerSub}>{MOCK_PROJECTS.length} total</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowModal(true)}>
          <Text style={styles.addBtnTxt}>+ New</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {['all', 'active', 'completed'].map(f => (
          <TouchableOpacity key={f} style={[styles.filterBtn, filter === f && styles.filterActive]} onPress={() => setFilter(f)}>
            <Text style={[styles.filterTxt, filter === f && styles.filterActiveTxt]}>{f.charAt(0).toUpperCase() + f.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.accent} />}
      >
        <View style={styles.list}>
          {filtered.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Add Modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>New Project</Text>
            <TextInput
              style={styles.input} placeholder="Project name" placeholderTextColor={C.textMuted}
              value={newName} onChangeText={setNewName} />
            <TextInput
              style={styles.input} placeholder="Client name" placeholderTextColor={C.textMuted}
              value={newClient} onChangeText={setNewClient} />
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setShowModal(false)}>
                <Text style={styles.modalCancelTxt}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalCreate} onPress={() => {
                Alert.alert('Project Created', `"${newName}" created!`);
                setShowModal(false); setNewName(''); setNewClient('');
              }}>
                <Text style={styles.modalCreateTxt}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  addBtn: { backgroundColor: C.accent, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 8 },
  addBtnTxt: { fontSize: 14, fontWeight: '700', color: '#000' },
  filterRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginBottom: 12 },
  filterBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 8, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border },
  filterActive: { backgroundColor: C.accentBg, borderColor: C.accentBorder },
  filterTxt: { fontSize: 13, color: C.textSecondary, fontWeight: '500' },
  filterActiveTxt: { color: C.accent, fontWeight: '600' },
  scroll: { flex: 1 },
  list: { paddingHorizontal: 20, paddingTop: 4 },
  card: {
    backgroundColor: C.surface, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: C.border, marginBottom: 12,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  cardLeft: { flex: 1, marginRight: 12 },
  cardName: { fontSize: 16, fontWeight: '700', color: C.text, marginBottom: 3 },
  cardClient: { fontSize: 13, color: C.textSecondary },
  statusPill: { flexDirection: 'row', alignItems: 'center', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, gap: 5 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusTxt: { fontSize: 11, fontWeight: '600', textTransform: 'capitalize' },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  metaItem: {},
  metaLabel: { fontSize: 11, color: C.textMuted, marginBottom: 3 },
  metaValue: { fontSize: 13, fontWeight: '600', color: C.text },
  budgetRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  budgetLabel: { fontSize: 12, color: C.textSecondary },
  budgetPct: { fontSize: 12, fontWeight: '700' },
  progressBg: { height: 6, backgroundColor: C.border, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modal: {
    backgroundColor: C.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 40, borderTopWidth: 1, borderTopColor: C.border,
  },
  modalTitle: { fontSize: 20, fontWeight: '800', color: C.text, marginBottom: 20 },
  input: {
    backgroundColor: C.bg, borderRadius: 12, padding: 14,
    color: C.text, fontSize: 15, borderWidth: 1, borderColor: C.border, marginBottom: 12,
  },
  modalBtns: { flexDirection: 'row', gap: 12, marginTop: 8 },
  modalCancel: { flex: 1, padding: 14, borderRadius: 12, backgroundColor: C.bg, borderWidth: 1, borderColor: C.border, alignItems: 'center' },
  modalCancelTxt: { color: C.textSecondary, fontWeight: '600', fontSize: 15 },
  modalCreate: { flex: 1, padding: 14, borderRadius: 12, backgroundColor: C.accent, alignItems: 'center' },
  modalCreateTxt: { color: '#000', fontWeight: '700', fontSize: 15 },
});
