import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, TextInput, Alert } from 'react-native'
import { useState } from 'react'
import Colors from '../../constants/Colors'
const C = Colors

interface Crew { id: number; name: string; role: string; email: string; rate: number; status: string; rating: number; projects: number; initials: string; color: string }

const CREW: Crew[] = [
  { id: 1, name: 'Ashtyn Cole', role: 'Director', email: 'ashtyn@crewdesk.io', rate: 850, status: 'On Project', rating: 5, projects: 12, initials: 'AC', color: '#F59E0B' },
  { id: 2, name: 'Marcus Webb', role: 'DOP', email: 'marcus@gmail.com', rate: 650, status: 'On Project', rating: 5, projects: 8, initials: 'MW', color: '#6366F1' },
  { id: 3, name: 'Priya Sharma', role: 'Editor', email: 'priya@studio.co', rate: 450, status: 'Available', rating: 4, projects: 15, initials: 'PS', color: '#EC4899' },
  { id: 4, name: 'Jake Torres', role: 'Sound', email: 'jake@audio.com', rate: 380, status: 'Available', rating: 4, projects: 6, initials: 'JT', color: '#10B981' },
  { id: 5, name: 'Sophie Lane', role: 'Prod Designer', email: 'sophie@design.io', rate: 500, status: 'On Project', rating: 5, projects: 9, initials: 'SL', color: '#EF4444' },
  { id: 6, name: 'Kai Nakamura', role: 'VFX Artist', email: 'kai@vfx.studio', rate: 600, status: 'Unavailable', rating: 4, projects: 4, initials: 'KN', color: '#06B6D4' },
]

const STATUS_COLORS: Record<string, string> = { Available: '#10B981', 'On Project': '#F59E0B', Unavailable: '#9CA3AF' }

export default function CrewScreen() {
  const [crew, setCrew] = useState<Crew[]>(CREW)
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState<Crew | null>(null)
  const [invite, setInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('')
  const [inviteSent, setInviteSent] = useState(false)

  const filtered = crew.filter(m => filter === 'All' || m.status === filter)
  const available = crew.filter(m => m.status === 'Available').length
  const onProject = crew.filter(m => m.status === 'On Project').length

  return (
    <View style={s.screen}>
      <View style={s.header}>
        <Text style={s.title}>Crew</Text>
        <TouchableOpacity activeOpacity={0.7} onPress={() => { setInvite(true); setInviteSent(false) }} style={s.addBtn}>
          <Text style={s.addBtnText}>+ Invite</Text>
        </TouchableOpacity>
      </View>

      <View style={s.statsRow}>
        {[
          { label: 'Total', value: crew.length },
          { label: 'Available', value: available, color: '#10B981' },
          { label: 'On Project', value: onProject, color: '#F59E0B' },
          { label: 'Avg Rate', value: `£${Math.round(crew.reduce((s,m)=>s+m.rate,0)/crew.length)}`, color: '#6366F1' },
        ].map((st, i) => (
          <View key={i} style={s.stat}>
            <Text style={[s.statValue, st.color ? { color: st.color } : {}]}>{st.value}</Text>
            <Text style={s.statLabel}>{st.label}</Text>
          </View>
        ))}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.tabsScroll} contentContainerStyle={s.tabsContent}>
        {['All', 'Available', 'On Project', 'Unavailable'].map(t => (
          <TouchableOpacity key={t} activeOpacity={0.7} onPress={() => setFilter(t)} style={[s.tab, filter === t && s.tabActive]}>
            <Text style={[s.tabText, filter === t && s.tabTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={s.list} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingTop: 8 }}>
        {filtered.map(m => (
          <TouchableOpacity key={m.id} activeOpacity={0.7} onPress={() => setSelected(m)} style={s.card}>
            <View style={s.cardRow}>
              <View style={[s.avatar, { backgroundColor: m.color + '30', borderColor: m.color + '60', borderWidth: 1 }]}>
                <Text style={[s.avatarText, { color: m.color }]}>{m.initials}</Text>
              </View>
              <View style={s.cardInfo}>
                <Text style={s.name}>{m.name}</Text>
                <Text style={s.role}>{m.role} · £{m.rate}/day</Text>
                <View style={s.stars}>
                  {[1,2,3,4,5].map(n => <Text key={n} style={[s.star, { color: n <= m.rating ? '#F59E0B' : '#374151' }]}>★</Text>)}
                  <Text style={s.projectCount}> ({m.projects} projects)</Text>
                </View>
              </View>
              <View style={[s.badge, { backgroundColor: STATUS_COLORS[m.status] + '20' }]}>
                <Text style={[s.badgeText, { color: STATUS_COLORS[m.status] }]}>{m.status === 'On Project' ? 'Active' : m.status}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Detail Modal */}
      <Modal visible={!!selected} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setSelected(null)}>
        {selected && (
          <View style={s.modal}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>{selected.name}</Text>
              <TouchableOpacity onPress={() => setSelected(null)} style={s.closeBtn}><Text style={s.closeBtnText}>✕</Text></TouchableOpacity>
            </View>
            <ScrollView style={{ flex: 1, padding: 16 }}>
              <View style={[s.avatar, { backgroundColor: selected.color + '30', width: 64, height: 64, borderRadius: 20, marginBottom: 16, alignSelf: 'center', borderColor: selected.color + '60', borderWidth: 1 }]}>
                <Text style={[s.avatarText, { color: selected.color, fontSize: 24 }]}>{selected.initials}</Text>
              </View>
              {[['Role', selected.role], ['Email', selected.email], ['Day Rate', `£${selected.rate}`], ['Status', selected.status], ['Projects Done', String(selected.projects)]].map(([k, v]) => (
                <View key={k} style={s.detailRow}>
                  <Text style={s.detailKey}>{k}</Text>
                  <Text style={s.detailVal}>{v}</Text>
                </View>
              ))}
              <View style={s.detailRow}>
                <Text style={s.detailKey}>Rating</Text>
                <View style={s.stars}>{[1,2,3,4,5].map(n => <Text key={n} style={[s.star, { color: n <= selected.rating ? '#F59E0B' : '#374151' }]}>★</Text>)}</View>
              </View>
            </ScrollView>
          </View>
        )}
      </Modal>

      {/* Invite Modal */}
      <Modal visible={invite} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setInvite(false)}>
        <View style={s.modal}>
          <View style={s.modalHeader}>
            <Text style={s.modalTitle}>Invite Crew</Text>
            <TouchableOpacity onPress={() => setInvite(false)} style={s.closeBtn}><Text style={s.closeBtnText}>✕</Text></TouchableOpacity>
          </View>
          <View style={{ flex: 1, padding: 16 }}>
            {inviteSent ? (
              <View style={s.sentView}>
                <Text style={s.sentIcon}>✉️</Text>
                <Text style={s.sentTitle}>Invite Sent!</Text>
                <Text style={s.sentSub}>Invitation sent to {inviteEmail}</Text>
                <TouchableOpacity onPress={() => setInvite(false)} style={s.createBtn}>
                  <Text style={s.createBtnText}>Done</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <View style={s.inputGroup}><Text style={s.inputLabel}>Email</Text><TextInput style={s.input} placeholderTextColor="#4B5563" placeholder="crew@example.com" value={inviteEmail} onChangeText={setInviteEmail} keyboardType="email-address" /></View>
                <View style={s.inputGroup}><Text style={s.inputLabel}>Role</Text><TextInput style={s.input} placeholderTextColor="#4B5563" placeholder="e.g. Camera Operator" value={inviteRole} onChangeText={setInviteRole} /></View>
                <TouchableOpacity onPress={() => { if (!inviteEmail) return; setInviteSent(true) }} style={s.createBtn}>
                  <Text style={s.createBtnText}>Send Invite</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
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
  statValue: { fontSize: 16, fontWeight: '800', color: C.text },
  statLabel: { fontSize: 10, color: C.textMuted, marginTop: 2 },
  tabsScroll: { maxHeight: 44 },
  tabsContent: { paddingHorizontal: 16, gap: 6, alignItems: 'center' },
  tab: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8, backgroundColor: C.surface, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  tabActive: { backgroundColor: C.primary, borderColor: C.primary },
  tabText: { fontSize: 12, color: C.textMuted, fontWeight: '500' },
  tabTextActive: { color: '#000' },
  list: { flex: 1 },
  card: { backgroundColor: C.surface, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontWeight: '800', fontSize: 16 },
  cardInfo: { flex: 1 },
  name: { fontSize: 14, fontWeight: '700', color: C.text },
  role: { fontSize: 12, color: C.textMuted, marginTop: 2 },
  stars: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  star: { fontSize: 12 },
  projectCount: { fontSize: 10, color: C.textMuted },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 10, fontWeight: '600' },
  modal: { flex: 1, backgroundColor: C.bg },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  modalTitle: { fontSize: 18, fontWeight: '700', color: C.text },
  closeBtn: { width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.06)', justifyContent: 'center', alignItems: 'center' },
  closeBtnText: { color: C.textMuted, fontSize: 14 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)' },
  detailKey: { fontSize: 13, color: C.textMuted },
  detailVal: { fontSize: 13, color: C.text, fontWeight: '500' },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 12, color: C.textMuted, marginBottom: 6 },
  input: { backgroundColor: C.surface, borderRadius: 10, padding: 12, color: C.text, fontSize: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  createBtn: { backgroundColor: C.primary, borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 8 },
  createBtnText: { color: '#000', fontWeight: '700', fontSize: 15 },
  sentView: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  sentIcon: { fontSize: 56, marginBottom: 16 },
  sentTitle: { fontSize: 22, fontWeight: '800', color: C.text, marginBottom: 8 },
  sentSub: { fontSize: 14, color: C.textMuted, marginBottom: 32, textAlign: 'center' },
})
