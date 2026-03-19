import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import C from '../../constants/Colors'

type Contract = {
  id: string
  title: string
  client: string
  value: string
  date: string
  status: 'draft' | 'sent' | 'signed' | 'expired'
  type: string
}

const INIT: Contract[] = [
  { id: 'c1', title: 'Neon Nights — Production Agreement', client: 'Neon Films Ltd', value: '£14,500', date: 'Mar 20', status: 'signed', type: 'Production' },
  { id: 'c2', title: 'City Lights — Director Contract', client: 'BFI Productions', value: '£8,200', date: 'Mar 22', status: 'sent', type: 'Director' },
  { id: 'c3', title: 'Apex Documentary — Crew Agreement', client: 'Channel 4', value: '£22,000', date: 'Mar 15', status: 'draft', type: 'Crew' },
  { id: 'c4', title: 'Midnight Run — NDA', client: 'Sky Studios', value: '—', date: 'Feb 28', status: 'expired', type: 'NDA' },
  { id: 'c5', title: 'Sundown Series — Service Agreement', client: 'ITV', value: '£31,500', date: 'Apr 1', status: 'sent', type: 'Service' },
]

const STATUS_STYLE: Record<Contract['status'], { bg: string; text: string; label: string }> = {
  draft: { bg: 'rgba(100,116,139,0.15)', text: '#94a3b8', label: 'Draft' },
  sent: { bg: 'rgba(59,130,246,0.15)', text: '#60a5fa', label: 'Sent' },
  signed: { bg: 'rgba(16,185,129,0.15)', text: '#34d399', label: 'Signed' },
  expired: { bg: 'rgba(239,68,68,0.15)', text: '#f87171', label: 'Expired' },
}

const FILTERS = ['All', 'Draft', 'Sent', 'Signed', 'Expired']

export default function ContractsScreen() {
  const [contracts, setContracts] = useState<Contract[]>(INIT)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Contract | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ title: '', client: '', value: '', type: 'Production' })

  const filtered = contracts.filter(c => {
    const matchFilter = filter === 'All' || c.status === filter.toLowerCase()
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.client.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const advanceStatus = (id: string) => {
    const order: Contract['status'][] = ['draft', 'sent', 'signed', 'expired']
    setContracts(prev => prev.map(c => {
      if (c.id !== id) return c
      const idx = order.indexOf(c.status)
      if (idx >= order.length - 1) return c
      return { ...c, status: order[idx + 1] }
    }))
  }

  const deleteContract = (id: string) => {
    Alert.alert('Delete Contract', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => {
        setContracts(prev => prev.filter(c => c.id !== id))
        setSelected(null)
      }}
    ])
  }

  const createContract = () => {
    if (!form.title || !form.client) return
    const newC: Contract = {
      id: `c${Date.now()}`,
      title: form.title,
      client: form.client,
      value: form.value || '—',
      date: 'Today',
      status: 'draft',
      type: form.type,
    }
    setContracts(prev => [newC, ...prev])
    setForm({ title: '', client: '', value: '', type: 'Production' })
    setShowCreate(false)
  }

  const stats = {
    total: contracts.length,
    signed: contracts.filter(c => c.status === 'signed').length,
    pending: contracts.filter(c => c.status === 'sent').length,
    draft: contracts.filter(c => c.status === 'draft').length,
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Contracts</Text>
          <Text style={styles.headerSub}>Production agreements</Text>
        </View>
        <TouchableOpacity onPress={() => setShowCreate(true)} style={styles.addBtn}>
          <Text style={styles.addBtnText}>+ New</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        {[
          { label: 'Total', value: stats.total, color: '#f1f5f9' },
          { label: 'Signed', value: stats.signed, color: '#34d399' },
          { label: 'Awaiting', value: stats.pending, color: '#60a5fa' },
          { label: 'Draft', value: stats.draft, color: '#94a3b8' },
        ].map(s => (
          <View key={s.label} style={styles.statCard}>
            <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search contracts..."
          placeholderTextColor="#475569"
          style={styles.searchInput}
        />
      </View>

      {/* Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterStrip} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
        {FILTERS.map(f => (
          <TouchableOpacity key={f} onPress={() => setFilter(f)}
            style={[styles.filterTab, filter === f && styles.filterTabActive]}>
            <Text style={[styles.filterTabText, filter === f && styles.filterTabTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Contract List */}
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {filtered.map(c => {
          const st = STATUS_STYLE[c.status]
          return (
            <TouchableOpacity key={c.id} onPress={() => setSelected(c)} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.cardMain}>
                  <Text style={styles.cardTitle} numberOfLines={2}>{c.title}</Text>
                  <Text style={styles.cardClient}>{c.client}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: st.bg }]}>
                  <Text style={[styles.statusText, { color: st.text }]}>{st.label}</Text>
                </View>
              </View>
              <View style={styles.cardBottom}>
                <Text style={styles.cardType}>{c.type}</Text>
                <Text style={styles.cardValue}>{c.value}</Text>
                <Text style={styles.cardDate}>{c.date}</Text>
              </View>
            </TouchableOpacity>
          )
        })}
        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📄</Text>
            <Text style={styles.emptyText}>No contracts found</Text>
          </View>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Detail Modal */}
      <Modal visible={selected !== null} transparent animationType="slide" onRequestClose={() => setSelected(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            {selected && (() => {
              const st = STATUS_STYLE[selected.status]
              return (
                <>
                  <View style={styles.modalHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.modalType}>{selected.type}</Text>
                      <Text style={styles.modalTitle}>{selected.title}</Text>
                      <Text style={styles.modalClient}>{selected.client}</Text>
                    </View>
                    <TouchableOpacity onPress={() => setSelected(null)} style={styles.closeBtn}>
                      <Text style={styles.closeBtnText}>×</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.modalStats}>
                    <View style={styles.modalStat}>
                      <Text style={styles.modalStatLabel}>Value</Text>
                      <Text style={styles.modalStatValue}>{selected.value}</Text>
                    </View>
                    <View style={styles.modalStat}>
                      <Text style={styles.modalStatLabel}>Date</Text>
                      <Text style={styles.modalStatValue}>{selected.date}</Text>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: st.bg, alignSelf: 'flex-start', marginBottom: 16 }]}>
                    <Text style={[styles.statusText, { color: st.text }]}>{st.label}</Text>
                  </View>
                  <View style={styles.modalActions}>
                    {selected.status !== 'signed' && selected.status !== 'expired' && (
                      <TouchableOpacity onPress={() => { advanceStatus(selected.id); setSelected(null) }} style={styles.advanceBtn}>
                        <Text style={styles.advanceBtnText}>Advance Status →</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={() => deleteContract(selected.id)} style={styles.deleteBtn}>
                      <Text style={styles.deleteBtnText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )
            })()}
          </View>
        </View>
      </Modal>

      {/* Create Modal */}
      <Modal visible={showCreate} transparent animationType="slide" onRequestClose={() => setShowCreate(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Contract</Text>
              <TouchableOpacity onPress={() => setShowCreate(false)} style={styles.closeBtn}>
                <Text style={styles.closeBtnText}>×</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.inputLabel}>Contract Title *</Text>
            <TextInput value={form.title} onChangeText={t => setForm(p => ({ ...p, title: t }))}
              placeholder="e.g. Project — Agreement Type" placeholderTextColor="#475569" style={styles.input} />
            <Text style={styles.inputLabel}>Client *</Text>
            <TextInput value={form.client} onChangeText={t => setForm(p => ({ ...p, client: t }))}
              placeholder="e.g. Neon Films Ltd" placeholderTextColor="#475569" style={styles.input} />
            <Text style={styles.inputLabel}>Contract Value</Text>
            <TextInput value={form.value} onChangeText={t => setForm(p => ({ ...p, value: t }))}
              placeholder="£0.00" placeholderTextColor="#475569" style={styles.input} />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setShowCreate(false)} style={styles.cancelBtn}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={createContract} style={styles.advanceBtn}>
                <Text style={styles.advanceBtnText}>Create Draft</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 12, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  headerTitle: { fontSize: 26, fontWeight: '700', color: C.text },
  headerSub: { fontSize: 13, color: C.textMuted, marginTop: 2 },
  addBtn: { backgroundColor: C.primary, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8 },
  addBtnText: { fontSize: 13, fontWeight: '700', color: '#000' },
  statsRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginBottom: 12 },
  statCard: { flex: 1, backgroundColor: C.surface, borderRadius: 12, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  statValue: { fontSize: 20, fontWeight: '700' },
  statLabel: { fontSize: 10, color: C.textMuted, marginTop: 2 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 8, backgroundColor: C.surface, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 12, paddingVertical: 10 },
  searchIcon: { fontSize: 14, marginRight: 8 },
  searchInput: { flex: 1, color: C.text, fontSize: 14 },
  filterStrip: { flexGrow: 0, marginBottom: 8 },
  filterTab: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: C.surface, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  filterTabActive: { backgroundColor: C.primary, borderColor: C.primary },
  filterTabText: { fontSize: 13, fontWeight: '500', color: C.textMuted },
  filterTabTextActive: { color: '#000', fontWeight: '700' },
  list: { flex: 1, paddingHorizontal: 16 },
  card: { backgroundColor: C.surface, borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  cardMain: { flex: 1, marginRight: 8 },
  cardTitle: { fontSize: 13, fontWeight: '700', color: C.text, lineHeight: 18 },
  cardClient: { fontSize: 12, color: C.textMuted, marginTop: 3 },
  statusBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: 11, fontWeight: '600' },
  cardBottom: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardType: { fontSize: 11, color: C.textMuted, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  cardValue: { fontSize: 13, fontWeight: '700', color: C.primary, flex: 1 },
  cardDate: { fontSize: 11, color: C.textMuted },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { fontSize: 14, color: C.textMuted },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#0D1528', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 },
  modalType: { fontSize: 11, color: C.textMuted, marginBottom: 4 },
  modalTitle: { fontSize: 17, fontWeight: '700', color: C.text },
  modalClient: { fontSize: 13, color: C.textMuted, marginTop: 4 },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  closeBtnText: { fontSize: 18, color: C.textMuted, lineHeight: 20 },
  modalStats: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  modalStat: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 12 },
  modalStatLabel: { fontSize: 11, color: C.textMuted, marginBottom: 4 },
  modalStatValue: { fontSize: 16, fontWeight: '700', color: C.text },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 4 },
  advanceBtn: { flex: 1, backgroundColor: C.primary, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  advanceBtnText: { fontSize: 14, fontWeight: '700', color: '#000' },
  deleteBtn: { flex: 1, backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: 12, paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)' },
  deleteBtnText: { fontSize: 14, fontWeight: '600', color: '#f87171' },
  inputLabel: { fontSize: 12, color: C.textMuted, marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 14, paddingVertical: 10, color: C.text, fontSize: 14 },
  cancelBtn: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  cancelBtnText: { fontSize: 14, fontWeight: '600', color: C.textMuted },
})
