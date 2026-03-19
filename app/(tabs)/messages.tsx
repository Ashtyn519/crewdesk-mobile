import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Animated,
  TouchableOpacity, StatusBar, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { C } from '../../constants/Colors';

const THREADS = [
  {
    id: '1', name: 'Alex Morgan', initials: 'AM', color: C.accent, online: true,
    lastMsg: 'The designs look great, lets move forward!', time: '2m', unread: 2,
    messages: [
      { id: 'm1', text: 'Hey, got a moment to review the latest mockups?', from: 'them', time: '10:22' },
      { id: 'm2', text: 'Sure! Sending them over now', from: 'me', time: '10:23' },
      { id: 'm3', text: 'The designs look great, lets move forward!', from: 'them', time: '10:41' },
    ],
  },
  {
    id: '2', name: 'Jamie Turner', initials: 'JT', color: C.info, online: true,
    lastMsg: 'Will have the assets ready by EOD', time: '1h', unread: 0,
    messages: [
      { id: 'm1', text: 'Jamie, any update on the icon set?', from: 'me', time: '09:15' },
      { id: 'm2', text: 'Will have the assets ready by EOD', from: 'them', time: '09:45' },
    ],
  },
  {
    id: '3', name: 'Sarah Kim', initials: 'SK', color: C.success, online: false,
    lastMsg: 'Client approved the proposal!', time: '3h', unread: 1,
    messages: [
      { id: 'm1', text: 'Client approved the proposal!', from: 'them', time: 'Yesterday' },
    ],
  },
  {
    id: '4', name: 'Ravi Patel', initials: 'RP', color: C.purple, online: true,
    lastMsg: 'API integration is done, testing now', time: '5h', unread: 0,
    messages: [
      { id: 'm1', text: 'API integration is done, testing now', from: 'them', time: 'Yesterday' },
    ],
  },
  {
    id: '5', name: 'Emma Clarke', initials: 'EC', color: C.warning, online: false,
    lastMsg: 'Brand guidelines updated in the shared folder', time: '1d', unread: 0,
    messages: [
      { id: 'm1', text: 'Brand guidelines updated in the shared folder', from: 'them', time: '2d ago' },
    ],
  },
];

type Msg = { id: string; text: string; from: string; time: string };
type Thread = typeof THREADS[0];

function ThreadItem({ thread, onPress, index }: { thread: Thread; onPress: () => void; index: number }) {
  const translateX = useRef(new Animated.Value(-30)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateX, { toValue: 0, delay: index * 60, useNativeDriver: true, tension: 80, friction: 10 }),
      Animated.timing(opacity, { toValue: 1, delay: index * 60, duration: 280, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ translateX }], opacity }}>
      <TouchableOpacity style={styles.threadRow} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.avatarWrap}>
          <View style={[styles.avatar, { backgroundColor: thread.color + '20', borderColor: thread.color + '50' }]}>
            <Text style={[styles.avatarTxt, { color: thread.color }]}>{thread.initials}</Text>
          </View>
          {thread.online && <View style={styles.onlineDot} />}
        </View>
        <View style={styles.threadInfo}>
          <View style={styles.threadTop}>
            <Text style={styles.threadName}>{thread.name}</Text>
            <Text style={styles.threadTime}>{thread.time}</Text>
          </View>
          <Text style={styles.threadMsg} numberOfLines={1}>{thread.lastMsg}</Text>
        </View>
        {thread.unread > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadTxt}>{thread.unread}</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

function ChatView({ thread, onBack, messages, onSend }: {
  thread: Thread; onBack: () => void;
  messages: Msg[]; onSend: (txt: string) => void;
}) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <KeyboardAvoidingView style={styles.chatContainer} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.chatHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backTxt}>‹</Text>
        </TouchableOpacity>
        <View style={[styles.chatAvatar, { backgroundColor: thread.color + '20' }]}>
          <Text style={[styles.chatAvatarTxt, { color: thread.color }]}>{thread.initials}</Text>
        </View>
        <View>
          <Text style={styles.chatName}>{thread.name}</Text>
          <Text style={[styles.chatStatus, { color: thread.online ? C.success : C.textMuted }]}>
            {thread.online ? 'Online' : 'Offline'}
          </Text>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.messages}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
      >
        {messages.map(msg => (
          <View key={msg.id} style={[styles.bubble, msg.from === 'me' ? styles.bubbleMe : styles.bubbleThem]}>
            <Text style={[styles.bubbleTxt, msg.from === 'me' ? styles.bubbleTxtMe : styles.bubbleTxtThem]}>
              {msg.text}
            </Text>
            <Text style={[styles.bubbleTime, msg.from === 'me' && { color: 'rgba(0,0,0,0.5)' }]}>{msg.time}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.chatInput}
          value={input}
          onChangeText={setInput}
          placeholder="Message..."
          placeholderTextColor={C.textMuted}
          onSubmitEditing={handleSend}
          returnKeyType="send"
          multiline
        />
        <TouchableOpacity style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]} onPress={handleSend}>
          <Text style={styles.sendTxt}>↑</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

export default function Messages() {
  const [activeThread, setActiveThread] = useState<Thread | null>(null);
  const [messageMap, setMessageMap] = useState<Record<string, Msg[]>>(
    Object.fromEntries(THREADS.map(t => [t.id, t.messages]))
  );

  const handleSend = (text: string) => {
    if (!activeThread) return;
    const newMsg: Msg = { id: Date.now().toString(), text, from: 'me', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessageMap(prev => ({ ...prev, [activeThread.id]: [...(prev[activeThread.id] || []), newMsg] }));
  };

  if (activeThread) {
    return (
      <ChatView
        thread={activeThread}
        messages={messageMap[activeThread.id] || []}
        onBack={() => setActiveThread(null)}
        onSend={handleSend}
      />
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <View style={styles.onlineCount}>
          <View style={styles.onlineDotSmall} />
          <Text style={styles.onlineTxt}>{THREADS.filter(t => t.online).length} online</Text>
        </View>
      </View>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.threads}>
          {THREADS.map((t, i) => (
            <ThreadItem key={t.id} thread={t} index={i} onPress={() => setActiveThread(t)} />
          ))}
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
  onlineCount: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  onlineDotSmall: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.success },
  onlineTxt: { fontSize: 13, color: C.success, fontWeight: '600' },
  scroll: { flex: 1 },
  threads: { paddingHorizontal: 20 },
  threadRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border },
  avatarWrap: { position: 'relative', marginRight: 12 },
  avatar: { width: 46, height: 46, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  avatarTxt: { fontSize: 14, fontWeight: '800' },
  onlineDot: {
    position: 'absolute', bottom: 0, right: 0,
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: C.success, borderWidth: 2, borderColor: C.bg,
  },
  threadInfo: { flex: 1 },
  threadTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  threadName: { fontSize: 15, fontWeight: '700', color: C.text },
  threadTime: { fontSize: 11, color: C.textMuted },
  threadMsg: { fontSize: 13, color: C.textSecondary },
  unreadBadge: {
    backgroundColor: C.accent, borderRadius: 10,
    minWidth: 20, height: 20, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5,
  },
  unreadTxt: { fontSize: 11, fontWeight: '800', color: '#000' },
  chatContainer: { flex: 1, backgroundColor: C.bg },
  chatHeader: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16,
    paddingTop: 60, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: C.border,
    gap: 12,
  },
  backBtn: { padding: 4 },
  backTxt: { fontSize: 28, color: C.accent, fontWeight: '300', lineHeight: 32 },
  chatAvatar: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  chatAvatarTxt: { fontSize: 13, fontWeight: '800' },
  chatName: { fontSize: 16, fontWeight: '700', color: C.text },
  chatStatus: { fontSize: 12, fontWeight: '500' },
  messages: { flex: 1 },
  messagesContent: { padding: 16, gap: 8 },
  bubble: { maxWidth: '78%', borderRadius: 18, padding: 12, paddingHorizontal: 14 },
  bubbleMe: { alignSelf: 'flex-end', backgroundColor: C.accent, borderBottomRightRadius: 4 },
  bubbleThem: { alignSelf: 'flex-start', backgroundColor: C.surface, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: C.border },
  bubbleTxt: { fontSize: 14, lineHeight: 20, marginBottom: 4 },
  bubbleTxtMe: { color: '#000' },
  bubbleTxtThem: { color: C.text },
  bubbleTime: { fontSize: 10, color: C.textMuted, alignSelf: 'flex-end' },
  inputRow: {
    flexDirection: 'row', alignItems: 'flex-end', padding: 12,
    borderTopWidth: 1, borderTopColor: C.border, gap: 10, paddingBottom: 30,
  },
  chatInput: {
    flex: 1, backgroundColor: C.surface, borderRadius: 16, paddingHorizontal: 14,
    paddingVertical: 10, color: C.text, fontSize: 15, borderWidth: 1, borderColor: C.border,
    maxHeight: 100,
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: 13, backgroundColor: C.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: C.border },
  sendTxt: { fontSize: 18, color: '#000', fontWeight: '700' },
});
