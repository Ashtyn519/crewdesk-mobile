import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, FlatList, KeyboardAvoidingView, Platform } from 'react-native'
import { useState, useRef } from 'react'
import Colors from '../../constants/Colors'
const C = Colors

interface Msg { id: number; text: string; me: boolean; time: string }
interface Thread { id: number; name: string; role: string; initials: string; color: string; last: string; time: string; unread: number; msgs: Msg[] }

const THREADS: Thread[] = [
  { id: 1, name: 'Marcus Webb', role: 'DOP', initials: 'MW', color: '#6366F1', last: "I'll bring the ARRI kit", time: '2:14pm', unread: 2,
    msgs: [
      { id: 1, text: 'Hey Marcus, free for City Lights on March 22nd?', me: true, time: '10:00am' },
      { id: 2, text: "Yes! What's the call time?", me: false, time: '10:15am' },
      { id: 3, text: '6am at Canary Wharf. Need the full ARRI kit.', me: true, time: '10:20am' },
      { id: 4, text: "I'll bring the ARRI kit", me: false, time: '2:14pm' },
    ]
  },
  { id: 2, name: 'Priya Sharma', role: 'Editor', initials: 'PS', color: '#EC4899', last: "First cut ready Friday", time: '11:30am', unread: 1,
    msgs: [
      { id: 1, text: "Priya, how's the Neon Nights edit?", me: true, time: '9:00am' },
      { id: 2, text: 'Going well! Rough assembly done.', me: false, time: '9:45am' },
      { id: 3, text: 'First cut ready Friday', me: false, time: '11:30am' },
    ]
  },
  { id: 3, name: 'Pulse Records', role: 'Client', initials: 'PR', color: '#F59E0B', last: 'Love it! One more revision?', time: 'Yesterday', unread: 0,
    msgs: [
      { id: 1, text: "We've reviewed the Neon Nights cut. Love it!", me: false, time: 'Yesterday' },
      { id: 2, text: 'Can we add one more revision?', me: false, time: 'Yesterday' },
    ]
  },
  { id: 4, name: 'Jake Torres', role: 'Sound', initials: 'JT', color: '#10B981', last: "All sorted, kit booked", time: 'Monday', unread: 0,
    msgs: [
      { id: 1, text: "Jake — City Lights, focus pulling for Marcus.", me: true, time: 'Monday' },
      { id: 2, text: 'All sorted, kit booked', me: false, time: 'Monday' },
    ]
  },
]

export default function MessagesScreen() {
  const [threads, setThreads] = useState<Thread[]>(THREADS)
  const [active, setActive] = useState<Thread | null>(null)
  const [input, setInput] = useState('')
  const flatRef = useRef<FlatList>(null)

  const send = () => {
    if (!input.trim() || !active) return
    const msg: Msg = { id: Date.now(), text: input.trim(), me: true, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    const updated = threads.map(t => t.id === active.id ? { ...t, msgs: [...t.msgs, msg], last: input.trim(), time: 'now', unread: 0 } : t)
    setThreads(updated)
    const updatedActive = { ...active, msgs: [...active.msgs, msg] }
    setActive(updatedActive)
    setInput('')
    setTimeout(() => {
      const replies = ['Got it!', 'Perfect, will do.', 'Sounds great!', "On it 👍", 'Roger that.']
      const reply: Msg = { id: Date.now() + 1, text: replies[Math.floor(Math.random() * replies.length)], me: false, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      setThreads(prev => prev.map(t => t.id === active.id ? { ...t, msgs: [...t.msgs, msg, reply], last: reply.text, time: 'now' } : t))
      setActive(prev => prev ? { ...prev, msgs: [...prev.msgs, reply] } : prev)
    }, 1500)
    setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100)
  }

  if (active) return (
    <KeyboardAvoidingView style={s.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
      <View style={s.threadHeader}>
        <TouchableOpacity onPress={() => setActive(null)} style={s.back}><Text style={s.backText}>← Back</Text></TouchableOpacity>
        <View style={s.threadInfo}>
          <View style={[s.avatar, { backgroundColor: active.color + '30' }]}><Text style={[s.avatarText, { color: active.color }]}>{active.initials}</Text></View>
          <View><Text style={s.threadName}>{active.name}</Text><Text style={s.threadRole}>{active.role}</Text></View>
        </View>
      </View>
      <FlatList ref={flatRef} data={active.msgs} keyExtractor={i => String(i.id)} style={s.msgList} contentContainerStyle={{ padding: 16 }}
        onContentSizeChange={() => flatRef.current?.scrollToEnd({ animated: false })}
        renderItem={({ item }) => (
          <View style={[s.msgRow, item.me && s.msgRowMe]}>
            {!item.me && <View style={[s.avatar, { backgroundColor: active.color + '30', width: 28, height: 28, borderRadius: 8 }]}><Text style={[s.avatarText, { color: active.color, fontSize: 11 }]}>{active.initials[0]}</Text></View>}
            <View style={[s.bubble, item.me ? s.bubbleMe : s.bubbleThem]}>
              <Text style={[s.bubbleText, item.me && s.bubbleTextMe]}>{item.text}</Text>
              <Text style={[s.msgTime, item.me && s.msgTimeMe]}>{item.time}</Text>
            </View>
          </View>
        )}
      />
      <View style={s.inputRow}>
        <TextInput style={s.msgInput} placeholderTextColor="#4B5563" placeholder={`Message ${active.name}...`} value={input} onChangeText={setInput} multiline returnKeyType="send" onSubmitEditing={send} />
        <TouchableOpacity onPress={send} style={[s.sendBtn, !input.trim() && { opacity: 0.4 }]} disabled={!input.trim()}>
          <Text style={s.sendBtnText}>↑</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )

  const totalUnread = threads.reduce((s, t) => s + t.unread, 0)
  return (
    <View style={s.screen}>
      <View style={s.header}>
        <Text style={s.title}>Messages</Text>
        {totalUnread > 0 && <View style={s.unreadBadge}><Text style={s.unreadBadgeText}>{totalUnread}</Text></View>}
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {threads.map(t => (
          <TouchableOpacity key={t.id} activeOpacity={0.7} onPress={() => setActive({ ...t, unread: 0 })} style={s.threadCard}>
            <View style={[s.avatar, { backgroundColor: t.color + '30' }]}>
              <Text style={[s.avatarText, { color: t.color }]}>{t.initials}</Text>
              {t.unread > 0 && <View style={s.unreadDot}><Text style={s.unreadDotText}>{t.unread}</Text></View>}
            </View>
            <View style={s.threadBody}>
              <View style={s.threadRow}>
                <Text style={[s.threadCardName, t.unread > 0 && { color: '#fff' }]}>{t.name}</Text>
                <Text style={s.threadTime}>{t.time}</Text>
              </View>
              <Text style={s.threadLast} numberOfLines={1}>{t.last}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingTop: 8 },
  title: { fontSize: 22, fontWeight: '800', color: C.text },
  unreadBadge: { backgroundColor: C.primary, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  unreadBadgeText: { color: '#000', fontWeight: '700', fontSize: 12 },
  threadCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.surface, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  avatar: { width: 44, height: 44, borderRadius: 13, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  avatarText: { fontWeight: '800', fontSize: 15 },
  unreadDot: { position: 'absolute', top: -4, right: -4, backgroundColor: C.primary, borderRadius: 8, width: 16, height: 16, justifyContent: 'center', alignItems: 'center' },
  unreadDotText: { fontSize: 9, fontWeight: '800', color: '#000' },
  threadBody: { flex: 1 },
  threadRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  threadCardName: { fontSize: 14, fontWeight: '600', color: '#D1D5DB' },
  threadTime: { fontSize: 11, color: C.textMuted },
  threadLast: { fontSize: 12, color: C.textMuted, marginTop: 3 },
  threadHeader: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)', gap: 12 },
  back: { marginRight: 4 },
  backText: { color: C.primary, fontSize: 14, fontWeight: '600' },
  threadInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  threadName: { fontSize: 15, fontWeight: '700', color: C.text },
  threadRole: { fontSize: 12, color: C.textMuted },
  msgList: { flex: 1 },
  msgRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 12, gap: 8 },
  msgRowMe: { justifyContent: 'flex-end' },
  bubble: { maxWidth: '70%', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10 },
  bubbleMe: { backgroundColor: C.primary, borderBottomRightRadius: 4 },
  bubbleThem: { backgroundColor: C.surface, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  bubbleText: { fontSize: 14, color: C.text },
  bubbleTextMe: { color: '#000' },
  msgTime: { fontSize: 10, color: C.textMuted, marginTop: 4 },
  msgTimeMe: { color: 'rgba(0,0,0,0.4)', textAlign: 'right' },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', padding: 12, gap: 8, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' },
  msgInput: { flex: 1, backgroundColor: C.surface, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10, color: C.text, fontSize: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', maxHeight: 100 },
  sendBtn: { width: 40, height: 40, backgroundColor: C.primary, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  sendBtnText: { color: '#000', fontWeight: '800', fontSize: 18 },
})
