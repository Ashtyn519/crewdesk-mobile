import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, TextInput, Alert, Dimensions } from 'react-native'
import { useState } from 'react'
import Colors from '../../constants/Colors'
const C = Colors
const W = Dimensions.get('window').width

interface Project { id: number; name: string; client: string; status: string; budget: number; spent: number; deadline: string; crew: number; progress: number; priority: string }

const PROJECTS: Project[] = [
  { id: 1, name: 'Neon Nights MV', client: 'Pulse Records', status: 'Active', budget: 28000, spent: 18400, deadline: '2026-03-21', crew: 8, progress: 66, priority: 'high' },
  { id: 2, name: 'City Lights Doc', client: 'Channel 4', status: 'Active', budget: 65000, spent: 31200, deadline: '2026-03-22', crew: 14, progress: 48, priority: 'high' },
  { id: 3, name: 'Apex Energy TVC', client: 'Apex Corp', status: 'Active', budget: 42000, spent: 12600, deadline: '2026-04-10', crew: 6, progress: 30, priority: 'medium' },
  { id: 4, name: 'Midnight Run', client: 'Indie Films', status: 'Planning', budget: 180000, spent: 8000, deadline: '2026-06-30', crew: 22, progress: 4, priority: 'low' },
  { id: 5, name: 'Summer Vibes', client: 'ASOS', status: 'Completed', budget: 18000, spent: 17200, deadline: '2026-02-28', crew: 5, progress: 100, priority: 'low' },
]

const STATUS_COLORS: Record<string, string> = { Active: '#10B981', Planning: '#6366F1', Completed: '#9CA3AF', 'On Hold': '#F59E0B' }
const PRIORITY_COLORS: Record<string, string> = { high: '#EF4444', medium: '#F59E0B', low: '#10B981' }

export default function ProjectsScreen() {
  const [projects, setProjects] = useState<Project[]>(PROJECTS)
  const [filter, setFilter] = useState('All')
  const [modal, setModal] = useState(false)
  const [detail, setDetail] = useState<Project | null>(null)
  const [form, setForm] = useState({ name: '', client: '', status: 'Planning', budget: '', deadline: '' })

  const tabs = ['All', 'Active', 'Planning', 'Completed']
  const filtered = projects.filter(p => filter === 'All' || p.status === filter)

  const createProject = () => {
    if (!form.name || !form.client) { Alert.alert('Required', 'Name and client are required'); return }
    const p: Project = { id: Date.now(), name: form.name, client: form.client, status: form.status, budget: Number(form.budget) || 0, spent: 0, deadline: form.deadline, crew: 0, progress: 0, priority: 'medium' }
    setProjects(prev => [p, ...prev])
    setModal(false)
    setForm({ name: '', client: '', status: 'Planning', budget: '', deadline: '' })
  }

  const deleteProject = (id: number) => {
    Alert.alert('Delete Project', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => { setProjects(prev => prev.filter(p => p.id !== id)); setDetail(null) } }
    ])
  }

  const daysLeft = (d: string) => Math.ceil((new Date(d).getTime() - Date.now()) / 86400000)

  return (
    <View style={s.screen}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.title}>Projects</Text>
        <TouchableOpacity activeOpacity={0.7} onPress={() => setModal(true)} style={s.addBtn}>
          <Text style={s.addBtnText}>+ New</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={s.statsRow}>
        {[
          { label: 'Total', value: projects.length },
          { label: 'Active', value: projects.filter(p => p.status === 'Active').length, color: '#10B981' },
          { label: 'Planning', value: projects.filter(p => p.status === 'Planning').length, color: '#6366F1' },
          { label: 'Done', value: projects.filter(p => p.status === 'Completed').length, color: '#9CA3AF' },
        ].map((stat, i) => (
          <View key={i} style={s.stat}>
            <Text style={[s.statValue, stat.color ? { color: stat.color } : {}]}>{stat.value}</Text>
            <Text style={s.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Filter tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.tabsScroll} contentContainerStyle={s.tabsContent}>
        {tabs.map(t => (
          <TouchableOpacity key={t} activeOpacity={0.7} onPress={() => setFilter(t)} style={[s.tab, filter === t && s.tabActive]}>
            <Text style={[s.tabText, filter === t && s.tabTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Project list */}
      <ScrollView style={s.list} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingTop: 8 }}>
        {filtered.map((p, i) => {
          const days = daysLeft(p.deadline)
          const budgetPct = Math.round(p.spent / p.budget * 100)
          return (
            <TouchableOpacity key={p.id} activeOpacity={0.7} onPress={() => setDetail(p)} style={s.card}>
              <View style={s.cardHeader}>
                <View style={s.cardLeft}>
                  <View style={[s.priorityDot, { backgroundColor: PRIORITY_COLORS[p.priority] }]} />
                  <View>
                    <Text style={s.projectName}>{p.name}</Text>
                    <Text style={s.clientName}>{p.client}</Text>
                  </View>
                </View>
                <View style={[s.statusBadge, { backgroundColor: STATUS_COLORS[p.status] + '20' }]}>
                  <Text style={[s.statusText, { color: STATUS_COLORS[p.status] }]}>{p.status}</Text>
                </View>
              </View>

              {/* Progress */}
              <View style={s.progressSection}>
                <View style={s.progressRow}>
                  <Text style={s.progressLabel}>Progress</Text>
                  <Text style={s.progressValue}>{p.progress}%</Text>
                </View>
                <View style={s.progressBg}>
                  <View style={[s.progressBar, { width: `${p.progress}%` as any, backgroundColor: '#F59E0B' }]} />
                </View>
              </View>

              {/* Budget */}
              <View style={s.progressSection}>
                <View style={s.progressRow}>
                  <Text style={s.progressLabel}>Budget</Text>
                  <Text style={[s.progressValue, budgetPct > 85 && { color: '#EF4444' }]}>£{(p.spent/1000).toFixed(1)}k / £{(p.budget/1000).toFixed(0)}k</Text>
                </View>
                <View style={s.progressBg}>
                  <View style={[s.progressBar, { width: `${Math.min(budgetPct, 100)}%` as any, backgroundColor: budgetPct > 85 ? '#EF4444' : '#10B981' }]} />
                </View>
              </View>

              <View style={s.cardFooter}>
                <Text style={s.footerText}>👥 {p.crew} crew</Text>
                <Text style={[s.footerText, days < 7 && days >= 0 ? { color: '#F59E0B' } : days < 0 ? { color: '#EF4444' } : {}]}>
                  📅 {days < 0 ? `${Math.abs(days)}d overdue` : `${days}d left`}
                </Text>
              </View>
            </TouchableOpacity>
          )
        })}
        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Detail Modal */}
      <Modal visible={!!detail} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setDetail(null)}>
        {detail && (
          <View style={s.modalScreen}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>{detail.name}</Text>
              <TouchableOpacity onPress={() => setDetail(null)} style={s.closeBtn}><Text style={s.closeBtnText}>✕</Text></TouchableOpacity>
            </View>
            <ScrollView style={s.modalBody}>
              <View style={s.detailRow}><Text style={s.detailLabel}>Client</Text><Text style={s.detailValue}>{detail.client}</Text></View>
              <View style={s.detailRow}><Text style={s.detailLabel}>Status</Text>
                <View style={[s.statusBadge, { backgroundColor: STATUS_COLORS[detail.status] + '20' }]}>
                  <Text style={[s.statusText, { color: STATUS_COLORS[detail.status] }]}>{detail.status}</Text>
                </View>
              </View>
              <View style={s.detailRow}><Text style={s.detailLabel}>Budget</Text><Text style={s.detailValue}>£{detail.budget.toLocaleString()}</Text></View>
              <View style={s.detailRow}><Text style={s.detailLabel}>Spent</Text><Text style={s.detailValue}>£{detail.spent.toLocaleString()}</Text></View>
              <View style={s.detailRow}><Text style={s.detailLabel}>Crew Size</Text><Text style={s.detailValue}>{detail.crew}</Text></View>
              <View style={s.detailRow}><Text style={s.detailLabel}>Deadline</Text><Text style={s.detailValue}>{detail.deadline}</Text></View>
              <View style={s.detailRow}><Text style={s.detailLabel}>Progress</Text><Text style={s.detailValue}>{detail.progress}%</Text></View>

              <TouchableOpacity onPress={() => deleteProject(detail.id)} style={s.deleteBtn}>
                <Text style={s.deleteBtnText}>🗑️  Delete Project</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}
      </Modal>

      {/* Create Modal */}
      <Modal visible={modal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setModal(false)}>
        <View style={s.modalScreen}>
          <View style={s.modalHeader}>
            <Text style={s.modalTitle}>New Project</Text>
            <TouchableOpacity onPress={() => setModal(false)} style={s.closeBtn}><Text style={s.closeBtnText}>✕</Text></TouchableOpacity>
          </View>
          <ScrollView style={s.modalBody} keyboardShouldPersistTaps="handled">
            {[['Project Name', 'name', 'e.g. Neon Nights MV'], ['Client', 'client', 'Client name'], ['Budget (£)', 'budget', '0'], ['Deadline', 'deadline', 'YYYY-MM-DD']].map(([label, key, ph]) => (
              <View key={key} style={s.inputGroup}>
                <Text style={s.inputLabel}>{label}</Text>
                <TextInput style={s.input} placeholderTextColor="#4B5563" placeholder={ph} value={(form as any)[key]} onChangeText={v => setForm({...form, [key]: v})} keyboardType={key === 'budget' ? 'numeric' : 'default'} />
              </View>
            ))}
            <TouchableOpacity onPress={createProject} style={s.createBtn}>
              <Text style={s.createBtnText}>Create Project</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  )
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingTop: 8 },
  title: { fontSize: 22, fontWeight: '800', color: C.text },
  addBtn: { backgroundColor: C.primary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  addBtnText: { color: '#000', fontWeight: '700', fontSize: 13 },
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 12 },
  stat: { flex: 1, backgroundColor: C.surface, borderRadius: 10, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  statValue: { fontSize: 18, fontWeight: '800', color: C.text },
  statLabel: { fontSize: 10, color: C.textMuted, marginTop: 2 },
  tabsScroll: { maxHeight: 44 },
  tabsContent: { paddingHorizontal: 16, gap: 6, alignItems: 'center' },
  tab: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8, backgroundColor: C.surface, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  tabActive: { backgroundColor: C.primary, borderColor: C.primary },
  tabText: { fontSize: 12, color: C.textMuted, fontWeight: '500' },
  tabTextActive: { color: '#000' },
  list: { flex: 1 },
  card: { backgroundColor: C.surface, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  priorityDot: { width: 8, height: 8, borderRadius: 4, marginTop: 2 },
  projectName: { fontSize: 14, fontWeight: '600', color: C.text },
  clientName: { fontSize: 12, color: C.textMuted, marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusText: { fontSize: 11, fontWeight: '600' },
  progressSection: { marginBottom: 8 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  progressLabel: { fontSize: 11, color: C.textMuted },
  progressValue: { fontSize: 11, color: C.text, fontWeight: '500' },
  progressBg: { height: 4, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' },
  progressBar: { height: 4, borderRadius: 2 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.04)' },
  footerText: { fontSize: 11, color: C.textMuted },
  modalScreen: { flex: 1, backgroundColor: C.bg },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  modalTitle: { fontSize: 18, fontWeight: '700', color: C.text },
  closeBtn: { width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.06)', justifyContent: 'center', alignItems: 'center' },
  closeBtnText: { color: C.textMuted, fontSize: 14 },
  modalBody: { flex: 1, padding: 16 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)' },
  detailLabel: { fontSize: 13, color: C.textMuted },
  detailValue: { fontSize: 13, color: C.text, fontWeight: '500' },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 12, color: C.textMuted, marginBottom: 6 },
  input: { backgroundColor: C.surface, borderRadius: 10, padding: 12, color: C.text, fontSize: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  createBtn: { backgroundColor: C.primary, borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 8 },
  createBtnText: { color: '#000', fontWeight: '700', fontSize: 15 },
  deleteBtn: { marginTop: 24, borderRadius: 12, padding: 14, alignItems: 'center', backgroundColor: 'rgba(239,68,68,0.1)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.3)' },
  deleteBtnText: { color: '#EF4444', fontWeight: '600', fontSize: 14 },
})
