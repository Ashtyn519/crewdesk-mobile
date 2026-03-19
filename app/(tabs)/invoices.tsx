import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Animated,
  TouchableOpacity, RefreshControl, StatusBar, Alert,
} from 'react-native';
import { C } from '../../constants/Colors';

const INVOICES = [
  { id: 'INV-041', client: 'Axiom Studio', amount: 4250, status: 'paid', date: '2026-03-10', due: '2026-03-24', items: 3 },
  { id: 'INV-040', client: 'StartupX', amount: 1800, status: 'pending', date: '2026-03-05', due: '2026-03-19', items: 2 },
  { id: 'INV-039', client: 'Retail Co.', amount: 7600, status: 'pending', date: '2026-02-28', due: '2026-03-14', items: 5 },
  { id: 'INV-038', client: 'GlobalBrand', amount: 3200, status: 'paid', date: '2026-02-20', due: '2026-03-06', items: 4 },
  { id: 'INV-037', client: 'TechFlow', amount: 5100, status: 'overdue', date: '2026-02-01', due: '2026-02-15', items: 3 },
  { id: 'INV-036', client: 'MediaHouse', amount: 2750, status: 'paid', date: '2026-01-28', due: '2026-02-11', items: 2 },
];

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  paid: { color: C.success, bg: C.successBg, label: 'Paid' },
  pending: { color: C.warning, bg: C.warningBg, label: 'Pending' },
  overdue: { color: C.error, bg: C.errorBg, label: 'Overdue' },
  draft: { color: C.textMuted, bg: C.surface, label: 'Draft' },
};

function InvoiceCard({ invoice, index }: { invoice: typeof INVOICES[0]; index: number }) {
  const translateY = useRef(new Animated.Value(20)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const sc = STATUS_CONFIG[invoice.status] || STATUS_CONFIG.draft;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, { toValue: 0, delay: index * 60, useNativeDriver: true, tension: 90, friction: 10 }),
      Animated.timing(opacity, { toValue: 1, delay: index * 60, duration: 280, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.card, { transform: [{ translateY }], opacity }]}>
      <View style={styles.cardTop}>
        <View>
          <Text style={styles.invoiceId}>{invoice.id}</Text>
          <Text style={styles.client}>{invoice.client}</Text>
        </View>
        <View style={styles.right}>
          <Text style={styles.amount}>£{invoice.amount.toLocaleString()}</Text>
          <View style={[styles.statusBadge, { backgroundColor: sc.bg, borderColor: sc.color + '30' }]}>
            <Text style={[styles.statusTxt, { color: sc.color }]}>{sc.label}</Text>
          </View>
        </View>
      </View>
      <View style={styles.cardBottom}>
        <Text style={styles.meta}>Issued: {invoice.date}</Text>
        <Text style={[styles.meta, invoice.status === 'overdue' && { color: C.error }]}>Due: {invoice.due}</Text>
        <Text style={styles.meta}>{invoice.items} items</Text>
      </View>
      {invoice.status === 'pending' && (
        <TouchableOpacity style={styles.markPaidBtn} onPress={() => Alert.alert('Marked Paid', `${invoice.id} marked as paid!`)}>
          <Text style={styles.markPaidTxt}>Mark as Paid</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

export default function Invoices() {
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');

  const totalPaid = INVOICES.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
  const totalPending = INVOICES.filter(i => i.status === 'pending').reduce((s, i) => s + i.amount, 0);

  const filtered = filter === 'all' ? INVOICES : INVOICES.filter(i => i.status === filter);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Invoices</Text>
          <Text style={styles.headerSub}>{INVOICES.length} total</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => Alert.alert('New Invoice', 'Create invoice flow coming soon!')}>
          <Text style={styles.addBtnTxt}>+ Create</Text>
        </TouchableOpacity>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { borderColor: C.success + '40' }]}>
          <Text style={[styles.summaryAmount, { color: C.success }]}>£{totalPaid.toLocaleString()}</Text>
          <Text style={styles.summaryLabel}>Paid</Text>
        </View>
        <View style={[styles.summaryCard, { borderColor: C.warning + '40' }]}>
          <Text style={[styles.summaryAmount, { color: C.warning }]}>£{totalPending.toLocaleString()}</Text>
          <Text style={styles.summaryLabel}>Pending</Text>
        </View>
        <View style={[styles.summaryCard, { borderColor: C.error + '40' }]}>
          <Text style={[styles.summaryAmount, { color: C.error }]}>
            £{INVOICES.filter(i => i.status === 'overdue').reduce((s, i) => s + i.amount, 0).toLocaleString()}
          </Text>
          <Text style={styles.summaryLabel}>Overdue</Text>
        </View>
      </View>

      {/* Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
        {['all', 'pending', 'paid', 'overdue'].map(f => (
          <TouchableOpacity key={f} style={[styles.filterBtn, filter === f && styles.filterActive]} onPress={() => setFilter(f)}>
            <Text style={[styles.filterTxt, filter === f && styles.filterActiveTxt]}>{f.charAt(0).toUpperCase() + f.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.accent} />}
      >
        <View style={styles.list}>
          {filtered.map((inv, i) => <InvoiceCard key={inv.id} invoice={inv} index={i} />)}
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
  addBtn: { backgroundColor: C.accent, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 8 },
  addBtnTxt: { fontSize: 14, fontWeight: '700', color: '#000' },
  summaryRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginBottom: 14 },
  summaryCard: {
    flex: 1, backgroundColor: C.surface, borderRadius: 14, padding: 12,
    borderWidth: 1, alignItems: 'center',
  },
  summaryAmount: { fontSize: 16, fontWeight: '800', marginBottom: 3 },
  summaryLabel: { fontSize: 11, color: C.textMuted },
  filterScroll: { maxHeight: 44 },
  filterContent: { paddingHorizontal: 20, gap: 8, paddingBottom: 10 },
  filterBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 8, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border },
  filterActive: { backgroundColor: C.accentBg, borderColor: C.accentBorder },
  filterTxt: { fontSize: 13, color: C.textSecondary, fontWeight: '500' },
  filterActiveTxt: { color: C.accent, fontWeight: '600' },
  scroll: { flex: 1 },
  list: { paddingHorizontal: 20, paddingTop: 8 },
  card: {
    backgroundColor: C.surface, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: C.border, marginBottom: 10,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  invoiceId: { fontSize: 16, fontWeight: '800', color: C.text, marginBottom: 2 },
  client: { fontSize: 13, color: C.textSecondary },
  right: { alignItems: 'flex-end', gap: 6 },
  amount: { fontSize: 18, fontWeight: '800', color: C.text },
  statusBadge: { borderRadius: 7, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1 },
  statusTxt: { fontSize: 11, fontWeight: '700' },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between' },
  meta: { fontSize: 11, color: C.textMuted },
  markPaidBtn: {
    marginTop: 12, backgroundColor: C.successBg, borderRadius: 10,
    padding: 10, alignItems: 'center', borderWidth: 1, borderColor: C.success + '40',
  },
  markPaidTxt: { color: C.success, fontWeight: '700', fontSize: 13 },
});
