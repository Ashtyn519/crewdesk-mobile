import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { C } from '@/constants/Colors';
const STEPS = [
  { step:'01', title:'The operating system
for your freelance
workforce.', sub:'One workspace for contracts, projects, invoices, and crew. Built for teams that move fast.' },
  { step:'02', title:'Sign contracts
in seconds.', sub:'Send, sign, and archive professional agreements. Legal coverage without the complexity.' },
  { step:'03', title:'Get paid.
Track everything.', sub:'Create invoices, receive payments, and monitor your revenue in real time.' },
  { step:'04', title:'Your crew,
always ready.', sub:'Build your trusted roster. Rate, rehire, and manage your best freelancers instantly.' },
];
export default function Onboarding() {
  const [step, setStep] = useState(0);
  const fade = useRef(new Animated.Value(1)).current;
  const s = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const next = () => {
    if (isLast) { router.replace('/(tabs)'); return; }
    Animated.sequence([
      Animated.timing(fade, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(fade, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
    setStep(step + 1);
  };
  return (
    <SafeAreaView style={st.root}>
      <View style={st.progress}>
        {STEPS.map((_, i) => <View key={i} style={[st.seg, { flex: i <= step ? 2 : 1, backgroundColor: i <= step ? C.accent : 'rgba(255,255,255,0.1)' }]} />)}
      </View>
      <Animated.View style={[st.content, { opacity: fade }]}>
        <Text style={st.stepNum}>{s.step} / 04</Text>
        <View style={st.logo}><Text style={st.arrow}>→</Text></View>
        <Text style={st.title}>{s.title}</Text>
        <Text style={st.sub}>{s.sub}</Text>
      </Animated.View>
      <View style={st.footer}>
        <TouchableOpacity style={st.btn} onPress={next} activeOpacity={0.85}>
          <Text style={st.btnTxt}>{isLast ? 'Get started' : 'Continue'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={st.skip} onPress={() => router.replace('/(tabs)')} activeOpacity={0.7}>
          <Text style={st.skipTxt}>{isLast ? 'I already have an account' : 'Skip'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const st = StyleSheet.create({
  root:{flex:1,backgroundColor:C.bg,paddingHorizontal:28},
  progress:{flexDirection:'row',gap:4,paddingTop:16,marginBottom:24},
  seg:{height:2,borderRadius:1},
  content:{flex:1,paddingTop:16},
  stepNum:{fontSize:11,fontWeight:'700',letterSpacing:2.5,color:C.textMuted,marginBottom:44},
  logo:{width:56,height:56,borderRadius:14,backgroundColor:C.accent,alignItems:'center',justifyContent:'center',marginBottom:36},
  arrow:{fontSize:26,color:'#fff',fontWeight:'700'},
  title:{fontSize:36,fontWeight:'700',color:C.textPrimary,lineHeight:44,letterSpacing:-1,marginBottom:20},
  sub:{fontSize:16,color:C.textSecondary,lineHeight:26,letterSpacing:-0.2},
  footer:{paddingBottom:12,gap:8},
  btn:{backgroundColor:C.accent,borderRadius:12,paddingVertical:17,alignItems:'center'},
  btnTxt:{fontSize:16,fontWeight:'700',color:'#fff',letterSpacing:-0.3},
  skip:{alignItems:'center',paddingVertical:12},
  skipTxt:{fontSize:13,color:C.textMuted},
});