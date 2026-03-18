import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { C } from '@/constants/Colors';
const W = Dimensions.get('window').width;
function Stat({ label, value, sub, warn }: any) {
  return (
    <View style={[st.stat, warn && { borderColor: C.accentBorder }]}>
      <Text style={st.statLbl}>{label}</Text>
      <Text style={[st.statVal, warn && { color: C.warning }]}>{value}</Text>
      {sub && <Text style={st.statSub}>{sub}</Text>}
    </View>
  );
}
export default function OverviewScreen() {
  return (
    <ScrollView style={st.screen} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View style={st.header}>
        <View style={{ flex: 1 }}>
          <Text style={st.greeting}>Good evening, Ashtyn.</Text>
          <Text style={st.date}>Tuesday, 17 March 2026</Text>
        </View>
        <View style={st.av}><Text style={st.avTxt}>A</Text></View>
      </View>
      <View style={st.grid}>
        <Stat label="PROJECTS" value="0" sub="Start one" />
        <Stat label="FREELANCERS" value="0" sub="Invite crew" />
        <Stat label="REVENUE" value="£0" sub="This month" />
        <Stat label="PENDING" value="£0" sub="Awaiting" warn />
      </View>
      <View style={st.row}><Text style={st.sec}>Recent activity</Text></View>
      <View style={st.empty}>
        <View style={st.emptyIcon}><Text style={{ fontSize: 20, color: C.accentLight }}>⚡</Text></View>
        <Text style={st.emptyH}>No activity yet</Text>
        <Text style={st.emptySub}>Create your first project to get started.</Text>
        <TouchableOpacity style={st.emptyBtn}><Text style={st.emptyBtnTxt}>New project</Text></TouchableOpacity>
      </View>
      <View style={st.row}><Text style={st.sec}>Quick actions</Text></View>
      {['New project','Invite freelancer','Create contract','Send invoice'].map(a => (
        <TouchableOpacity key={a} style={st.qa} activeOpacity={0.7}>
          <Text style={st.qaTxt}>{a}</Text>
          <Text style={{ fontSize: 20, color: C.textMuted }}>›</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
const st = StyleSheet.create({
  screen:{flex:1,backgroundColor:C.bg},
  header:{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start',padding:20,paddingTop:16},
  greeting:{fontSize:22,fontWeight:'700',color:C.textPrimary,letterSpacing:-0.5},
  date:{fontSize:13,color:C.textMuted,marginTop:2},
  av:{width:34,height:34,borderRadius:17,backgroundColor:C.accentBg,borderWidth:1,borderColor:C.accentBorder,alignItems:'center',justifyContent:'center'},
  avTxt:{fontSize:13,fontWeight:'700',color:C.accentLight},
  grid:{flexDirection:'row',flexWrap:'wrap',paddingHorizontal:20,gap:8,marginBottom:24},
  stat:{flex:1,minWidth:(W-56)/2,backgroundColor:C.surface,borderRadius:10,borderWidth:1,borderColor:C.border,padding:16},
  statLbl:{fontSize:10,fontWeight:'700',letterSpacing:0.8,color:C.textMuted,marginBottom:6},
  statVal:{fontSize:24,fontWeight:'700',color:C.textPrimary,letterSpacing:-0.5},
  statSub:{fontSize:11,color:C.textMuted,marginTop:2},
  row:{paddingHorizontal:20,marginBottom:10},
  sec:{fontSize:13,fontWeight:'600',color:C.textSecondary},
  empty:{alignItems:'center',padding:40,marginHorizontal:20,backgroundColor:C.surface,borderRadius:10,borderWidth:1,borderColor:C.border,marginBottom:24},
  emptyIcon:{width:48,height:48,borderRadius:10,backgroundColor:C.accentBg,borderWidth:1,borderColor:C.accentBorder,alignItems:'center',justifyContent:'center',marginBottom:14},
  emptyH:{fontSize:14,fontWeight:'600',color:C.textSecondary,marginBottom:6},
  emptySub:{fontSize:13,color:C.textMuted,textAlign:'center',lineHeight:20,marginBottom:16},
  emptyBtn:{backgroundColor:C.accentBg,borderRadius:7,paddingHorizontal:20,paddingVertical:10,borderWidth:1,borderColor:C.accentBorder},
  emptyBtnTxt:{fontSize:13,fontWeight:'700',color:C.accentLight},
  qa:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginHorizontal:20,marginBottom:8,padding:14,backgroundColor:C.surface,borderRadius:8,borderWidth:1,borderColor:C.border},
  qaTxt:{fontSize:13,color:C.textSecondary},
});