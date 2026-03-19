import React, { useState, useRef } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, TextInput, Animated, Alert, Image } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import C from '../../constants/Colors'

const settingsTabs = ['Profile', 'Workspace', 'Billing', 'Security']

type RowProps = { label: string; sub?: string; right?: React.ReactNode }
function Row({ label, sub, right }: RowProps) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        {sub ? <Text style={styles.rowSub}>{sub}</Text> : null}
      </View>
      {right}
    </View>
  )
}

type CardProps = { title: string; children: React.ReactNode }
function Card({ title, children }: CardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  )
}

export default function SettingsScreen() {
  const [activeTab, setActiveTab] = useState(0)
  const [name, setName] = useState('Ashtyn519')
  const [email, setEmail] = useState('ashtyn@crewdesk.app')
  const [role, setRole] = useState('Production Manager')
  const [notifMessages, setNotifMessages] = useState(true)
  const [notifInvoice, setNotifInvoice] = useState(true)
  const [notifContract, setNotifContract] = useState(true)
  const [savedAnim] = useState(new Animated.Value(0))

  const showSaved = () => {
    Animated.sequence([
      Animated.timing(savedAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(1500),
      Animated.timing(savedAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start()
  }

  const initials = name.charAt(0).toUpperCase()

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSub}>Account & workspace</Text>
      </View>

      {/* Tab Strip */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabStrip} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
        {settingsTabs.map((t, i) => (
          <TouchableOpacity key={t} onPress={() => setActiveTab(i)}
            style={[styles.tabBtn, activeTab === i && styles.tabBtnActive]}>
            <Text style={[styles.tabBtnText, activeTab === i && styles.tabBtnTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Profile Tab */}
        {activeTab === 0 && (
          <Animated.View>
            {/* Avatar */}
            <View style={styles.avatarSection}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
              <View>
                <Text style={styles.avatarName}>{name}</Text>
                <Text style={styles.avatarRole}>{role}</Text>
                <TouchableOpacity><Text style={styles.changePhoto}>Change photo</Text></TouchableOpacity>
              </View>
            </View>

            <Card title="Personal Information">
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput value={name} onChangeText={setName} style={styles.input} placeholderTextColor="#4a5568" />
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput value={email} onChangeText={setEmail} style={styles.input} placeholderTextColor="#4a5568" keyboardType="email-address" autoCapitalize="none" />
              <Text style={styles.inputLabel}>Role / Title</Text>
              <TextInput value={role} onChangeText={setRole} style={styles.input} placeholderTextColor="#4a5568" />
            </Card>

            <Card title="Notifications">
              <Row label="New Messages" sub="When crew sends you a message"
                right={<Switch value={notifMessages} onValueChange={setNotifMessages} trackColor={{ false: '#1a2035', true: '#f59e0b' }} thumbColor="#fff" />} />
              <Row label="Invoice Paid" sub="When an invoice is marked paid"
                right={<Switch value={notifInvoice} onValueChange={setNotifInvoice} trackColor={{ false: '#1a2035', true: '#f59e0b' }} thumbColor="#fff" />} />
              <Row label="Contract Signed" sub="When a contract is signed"
                right={<Switch value={notifContract} onValueChange={setNotifContract} trackColor={{ false: '#1a2035', true: '#f59e0b' }} thumbColor="#fff" />} />
            </Card>
          </Animated.View>
        )}

        {/* Workspace Tab */}
        {activeTab === 1 && (
          <View>
            <Card title="Workspace">
              <Row label="Workspace Name" sub="My Workspace" />
              <Row label="Currency" sub="GBP — British Pound" right={<Text style={styles.chevron}>›</Text>} />
              <Row label="Timezone" sub="Europe/London" right={<Text style={styles.chevron}>›</Text>} />
              <Row label="Date Format" sub="DD/MM/YYYY" right={<Text style={styles.chevron}>›</Text>} />
            </Card>
            <Card title="Plan">
              <View style={styles.planBadge}>
                <View>
                  <Text style={styles.planName}>Free Plan</Text>
                  <Text style={styles.planSub}>2 seats · 5 active projects</Text>
                </View>
                <View style={styles.currentBadge}><Text style={styles.currentBadgeText}>Current</Text></View>
              </View>
              <TouchableOpacity style={styles.upgradePlanBtn}>
                <Text style={styles.upgradePlanText}>Upgrade to Pro — £29/mo</Text>
              </TouchableOpacity>
            </Card>
            <Card title="Danger Zone">
              <TouchableOpacity onPress={() => Alert.alert('Delete Workspace', 'Are you sure? This cannot be undone.', [{ text: 'Cancel' }, { text: 'Delete', style: 'destructive' }])}
                style={styles.dangerBtn}>
                <Text style={styles.dangerBtnText}>Delete Workspace</Text>
              </TouchableOpacity>
            </Card>
          </View>
        )}

        {/* Billing Tab */}
        {activeTab === 2 && (
          <View>
            <Card title="Current Plan">
              <View style={styles.planBadge}>
                <View>
                  <Text style={styles.planName}>Free Plan</Text>
                  <Text style={styles.planSub}>2 seats · 5 active projects</Text>
                </View>
                <View style={styles.currentBadge}><Text style={styles.currentBadgeText}>Current</Text></View>
              </View>
            </Card>
            <View style={styles.plansGrid}>
              <View style={styles.proPlan}>
                <View style={styles.proHeader}>
                  <Text style={styles.proName}>Pro</Text>
                  <View style={styles.popularBadge}><Text style={styles.popularText}>Popular</Text></View>
                </View>
                <Text style={styles.proPrice}>£29<Text style={styles.proPer}>/mo</Text></Text>
                <Text style={styles.proDesc}>Unlimited seats, projects, storage</Text>
                <TouchableOpacity style={styles.proBtn}>
                  <Text style={styles.proBtnText}>Upgrade to Pro</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.entPlan}>
                <Text style={styles.proName}>Enterprise</Text>
                <Text style={styles.proPrice}>Custom</Text>
                <Text style={styles.proDesc}>White-label · SSO · dedicated support</Text>
                <TouchableOpacity style={styles.entBtn}>
                  <Text style={styles.entBtnText}>Contact Sales</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Security Tab */}
        {activeTab === 3 && (
          <View>
            <Card title="Password">
              <Text style={styles.inputLabel}>Current Password</Text>
              <TextInput secureTextEntry placeholder="••••••••" style={styles.input} placeholderTextColor="#4a5568" />
              <Text style={styles.inputLabel}>New Password</Text>
              <TextInput secureTextEntry placeholder="••••••••" style={styles.input} placeholderTextColor="#4a5568" />
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <TextInput secureTextEntry placeholder="••••••••" style={styles.input} placeholderTextColor="#4a5568" />
              <TouchableOpacity style={styles.savePasswordBtn}>
                <Text style={styles.savePasswordText}>Update Password</Text>
              </TouchableOpacity>
            </Card>
            <Card title="Sessions">
              {[
                { device: 'Chrome on macOS', location: 'London, UK', current: true },
                { device: 'Safari on iPhone', location: 'London, UK', current: false },
              ].map((s, i) => (
                <Row key={i} label={s.device} sub={s.location}
                  right={s.current ?
                    <View style={styles.currentBadge}><Text style={styles.currentBadgeText}>Current</Text></View> :
                    <TouchableOpacity><Text style={styles.revokeText}>Revoke</Text></TouchableOpacity>
                  } />
              ))}
            </Card>
          </View>
        )}

        {/* Save */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 40, marginTop: 8 }}>
          <TouchableOpacity style={styles.saveBtn} onPress={showSaved}>
            <Text style={styles.saveBtnText}>Save Changes</Text>
          </TouchableOpacity>
          <Animated.View style={{ opacity: savedAnim, alignItems: 'center', marginTop: 8 }}>
            <Text style={{ color: '#10b981', fontSize: 14 }}>✓ Changes saved</Text>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16 },
  headerTitle: { fontSize: 26, fontWeight: '700', color: C.text },
  headerSub: { fontSize: 13, color: C.textMuted, marginTop: 2 },
  tabStrip: { flexGrow: 0, marginBottom: 8 },
  tabBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: C.surface, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  tabBtnActive: { backgroundColor: 'rgba(245,158,11,0.15)', borderColor: 'rgba(245,158,11,0.3)' },
  tabBtnText: { fontSize: 13, fontWeight: '500', color: C.textMuted },
  tabBtnTextActive: { color: C.primary },
  scroll: { flex: 1, paddingHorizontal: 16 },
  avatarSection: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 16, paddingHorizontal: 4 },
  avatar: { width: 64, height: 64, borderRadius: 16, backgroundColor: C.primary, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 26, fontWeight: '700', color: '#000' },
  avatarName: { fontSize: 16, fontWeight: '700', color: C.text },
  avatarRole: { fontSize: 13, color: C.textMuted, marginTop: 2 },
  changePhoto: { fontSize: 13, color: C.primary, marginTop: 4 },
  card: { backgroundColor: C.surface, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  cardTitle: { fontSize: 13, fontWeight: '600', color: C.text, marginBottom: 14 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  rowLabel: { fontSize: 14, fontWeight: '500', color: C.text },
  rowSub: { fontSize: 12, color: C.textMuted, marginTop: 2 },
  chevron: { fontSize: 20, color: C.textMuted },
  inputLabel: { fontSize: 12, color: C.textMuted, marginBottom: 4, marginTop: 10 },
  input: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 14, paddingVertical: 10, color: C.text, fontSize: 14 },
  planBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, marginBottom: 12 },
  planName: { fontSize: 14, fontWeight: '700', color: C.text },
  planSub: { fontSize: 12, color: C.textMuted, marginTop: 2 },
  currentBadge: { backgroundColor: 'rgba(100,116,139,0.2)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  currentBadgeText: { fontSize: 11, color: '#94a3b8', fontWeight: '600' },
  upgradePlanBtn: { backgroundColor: C.primary, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  upgradePlanText: { fontSize: 14, fontWeight: '700', color: '#000' },
  dangerBtn: { backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: 12, paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)' },
  dangerBtnText: { fontSize: 14, fontWeight: '600', color: '#f87171' },
  plansGrid: { gap: 12, marginBottom: 12 },
  proPlan: { backgroundColor: 'rgba(245,158,11,0.05)', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: 'rgba(245,158,11,0.25)' },
  entPlan: { backgroundColor: C.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  proHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  proName: { fontSize: 15, fontWeight: '700', color: C.text },
  popularBadge: { backgroundColor: 'rgba(245,158,11,0.15)', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  popularText: { fontSize: 11, color: C.primary, fontWeight: '600' },
  proPrice: { fontSize: 24, fontWeight: '700', color: C.primary, marginBottom: 4 },
  proPer: { fontSize: 13, color: C.textMuted, fontWeight: '400' },
  proDesc: { fontSize: 12, color: C.textMuted, marginBottom: 12 },
  proBtn: { backgroundColor: C.primary, borderRadius: 12, paddingVertical: 10, alignItems: 'center' },
  proBtnText: { fontSize: 13, fontWeight: '700', color: '#000' },
  entBtn: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12, paddingVertical: 10, alignItems: 'center', marginTop: 12 },
  entBtnText: { fontSize: 13, fontWeight: '600', color: C.text },
  savePasswordBtn: { backgroundColor: C.primary, borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginTop: 12 },
  savePasswordText: { fontSize: 14, fontWeight: '700', color: '#000' },
  revokeText: { fontSize: 13, color: '#f87171', fontWeight: '600' },
  saveBtn: { backgroundColor: C.primary, borderRadius: 16, paddingVertical: 14, alignItems: 'center' },
  saveBtnText: { fontSize: 15, fontWeight: '700', color: '#000' },
})
