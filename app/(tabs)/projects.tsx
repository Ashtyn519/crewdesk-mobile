import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { C } from '@/constants/Colors';
const DATA = [
  { name:'Nike SS25 Campaign', client:'Nike', status:'active', pct:72, due:'24 Mar' },
  { name:'Brand Identity Refresh', client:'Acme Co', status:'active', pct:45, due:'31 Mar' },
  { name:'Documentary Edit', client:'Channel 4', status:'draft', pct:10, due:'TBC' },
];
const B: any = { active:[C.accentLight,C.accentBg], draft:[C.textMuted,'rgba(255,255,255,0.06)'] };
export default function ProjectsScreen() {
  return (
    <ScrollView style={st.screen} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View style={st.hdr}>
        <View><Text style={st.title}>Projects</Text><Text style={st.sub}>Manage productions and campaigns.</Text></View>
        <TouchableOpacity style={st.btn}><Text style={st.btnTxt}>+ New</Text></TouchableOpacity>
      </View>
      {DATA.map(p => { const [tc,bg]=B[p.status]||B.draft; return (
        <TouchableOpacity key={p.name} style={st.card} activeOpacity={0.7}>
          <View style={st.top}>
            <View style={{flex:1}}><Text style={st.name}>{p.name}</Text><Text style={st.meta}>{p.client} · Due {p.due}</Text></View>
            <View style={[st.badge,{backgroundColor:bg}]}><Text style={[st.badgeTxt,{color:tc}]}>{p.status}</Text></View>
          </View>
          <View style={st.pbg}><View style={[st.pfill,{width:p.pct+'%',backgroundColor:p.pct>60?C.success:C.accent}]}/></View>
          <Text style={st.pct}>{p.pct}% complete</Text>
        </TouchableOpacity>
      );})}
    </ScrollView>
  );
}
const st = StyleSheet.create({
  screen:{flex:1,backgroundColor:C.bg},hdr:{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start',padding:20,paddingTop:16},
  title:{fontSize:22,fontWeight:'700',color:C.textPrimary,letterSpacing:-0.5},sub:{fontSize:13,color:C.textMuted,marginTop:2},
  btn:{backgroundColor:C.accent,paddingHorizontal:14,paddingVertical:8,borderRadius:7},btnTxt:{fontSize:13,fontWeight:'700',color:'#fff'},
  card:{backgroundColor:C.surface,borderRadius:10,borderWidth:1,borderColor:C.border,padding:16,marginHorizontal:20,marginBottom:8},
  top:{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between',marginBottom:12},
  name:{fontSize:14,fontWeight:'600',color:C.textPrimary,letterSpacing:-0.2,marginBottom:3},meta:{fontSize:12,color:C.textMuted},
  badge:{paddingHorizontal:8,paddingVertical:3,borderRadius:5},badgeTxt:{fontSize:10,fontWeight:'700',letterSpacing:0.3},
  pbg:{height:3,backgroundColor:'rgba(255,255,255,0.07)',borderRadius:2},pfill:{height:3,borderRadius:2},pct:{fontSize:11,color:C.textMuted,marginTop:5},
});