import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { C } from '@/constants/Colors';
const DATA = [
  { name:'Jordan Lee', role:'Video Editor', rate:'£450/day', rating:'4.9', available:true },
  { name:'Sam Torres', role:'Motion Designer', rate:'£380/day', rating:'4.8', available:true },
  { name:'Maya Chen', role:'Photographer', rate:'£320/day', rating:'5.0', available:false },
];
export default function CrewScreen() {
  return (
    <ScrollView style={st.screen} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View style={st.hdr}>
        <View><Text style={st.title}>Crew</Text><Text style={st.sub}>Your trusted roster.</Text></View>
        <TouchableOpacity style={st.btn}><Text style={st.btnTxt}>+ Invite</Text></TouchableOpacity>
      </View>
      {DATA.map(m => (
        <TouchableOpacity key={m.name} style={st.card} activeOpacity={0.7}>
          <View style={st.row}>
            <View style={st.av}><Text style={st.avTxt}>{m.name[0]}</Text></View>
            <View style={{flex:1,marginLeft:12}}>
              <View style={st.meta}>
                <Text style={st.name}>{m.name}</Text>
                <View style={[st.badge,{backgroundColor:m.available?C.successBg:C.warningBg}]}>
                  <Text style={[st.badgeTxt,{color:m.available?C.success:C.warning}]}>{m.available?'available':'busy'}</Text>
                </View>
              </View>
              <Text style={st.role}>{m.role} · {m.rate}</Text>
              <Text style={st.rating}>★ {m.rating}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
const st = StyleSheet.create({
  screen:{flex:1,backgroundColor:C.bg},hdr:{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start',padding:20,paddingTop:16},
  title:{fontSize:22,fontWeight:'700',color:C.textPrimary,letterSpacing:-0.5},sub:{fontSize:13,color:C.textMuted,marginTop:2},
  btn:{backgroundColor:C.accent,paddingHorizontal:14,paddingVertical:8,borderRadius:7},btnTxt:{fontSize:13,fontWeight:'700',color:'#fff'},
  card:{backgroundColor:C.surface,borderRadius:10,borderWidth:1,borderColor:C.border,padding:16,marginHorizontal:20,marginBottom:8},
  row:{flexDirection:'row',alignItems:'flex-start'},
  av:{width:42,height:42,borderRadius:21,backgroundColor:C.accentBg,borderWidth:1,borderColor:C.accentBorder,alignItems:'center',justifyContent:'center'},
  avTxt:{fontSize:16,fontWeight:'700',color:C.accentLight},
  meta:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:3},
  name:{fontSize:14,fontWeight:'600',color:C.textPrimary,letterSpacing:-0.2},
  badge:{paddingHorizontal:8,paddingVertical:3,borderRadius:5},badgeTxt:{fontSize:10,fontWeight:'700',letterSpacing:0.3},
  role:{fontSize:12,color:C.textMuted,marginBottom:3},rating:{fontSize:12,color:C.warning},
});