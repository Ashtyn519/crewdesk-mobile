import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { C } from '@/constants/Colors';
const DATA = [
  { name:'Brand Campaign', amount:'£4,200', status:'paid', date:'12 Mar' },
  { name:'App Redesign', amount:'£8,500', status:'pending', date:'19 Mar' },
  { name:'Motion Work', amount:'£1,800', status:'draft', date:'—' },
];
const S: any = { paid:[C.success,C.successBg], pending:[C.warning,C.warningBg], draft:[C.textMuted,'rgba(255,255,255,0.06)'] };
export default function InvoicesScreen() {
  return (
    <ScrollView style={st.screen} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View style={st.hdr}>
        <View><Text style={st.title}>Invoices</Text><Text style={st.sub}>Track payments and billing.</Text></View>
        <TouchableOpacity style={st.btn}><Text style={st.btnTxt}>+ New</Text></TouchableOpacity>
      </View>
      <View style={st.stats}>
        {[['INVOICED','£14.5k',false],['OUTSTANDING','£8.5k',true],['PAID MTD','£4.2k',false]].map(([l,v,a]:any) => (
          <View key={l} style={[st.stat,a&&{borderColor:C.accentBorder}]}>
            <Text style={st.statLbl}>{l}</Text><Text style={[st.statVal,a&&{color:C.warning}]}>{v}</Text>
          </View>
        ))}
      </View>
      {DATA.map(inv => { const [tc,bg]=S[inv.status]; return (
        <TouchableOpacity key={inv.name} style={st.card} activeOpacity={0.7}>
          <View style={st.row}>
            <View><Text style={st.name}>{inv.name}</Text><Text style={st.meta}>{inv.date}</Text></View>
            <View style={{alignItems:'flex-end',gap:6}}>
              <Text style={st.amount}>{inv.amount}</Text>
              <View style={[st.badge,{backgroundColor:bg}]}><Text style={[st.badgeTxt,{color:tc}]}>{inv.status}</Text></View>
            </View>
          </View>
        </TouchableOpacity>
      );})}
    </ScrollView>
  );
}
const st = StyleSheet.create({
  screen:{flex:1,backgroundColor:C.bg},hdr:{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start',padding:20,paddingTop:16},
  title:{fontSize:22,fontWeight:'700',color:C.textPrimary,letterSpacing:-0.5},sub:{fontSize:13,color:C.textMuted,marginTop:2},
  btn:{backgroundColor:C.accent,paddingHorizontal:14,paddingVertical:8,borderRadius:7},btnTxt:{fontSize:13,fontWeight:'700',color:'#fff'},
  stats:{flexDirection:'row',paddingHorizontal:20,gap:8,marginBottom:24},
  stat:{flex:1,backgroundColor:C.surface,borderRadius:10,borderWidth:1,borderColor:C.border,padding:14},
  statLbl:{fontSize:9,fontWeight:'700',letterSpacing:0.8,color:C.textMuted,marginBottom:5},
  statVal:{fontSize:17,fontWeight:'700',color:C.textPrimary,letterSpacing:-0.4},
  card:{backgroundColor:C.surface,borderRadius:10,borderWidth:1,borderColor:C.border,padding:16,marginHorizontal:20,marginBottom:8},
  row:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  name:{fontSize:14,fontWeight:'600',color:C.textPrimary,letterSpacing:-0.2,marginBottom:3},meta:{fontSize:12,color:C.textMuted},
  amount:{fontSize:16,fontWeight:'700',color:C.textPrimary,letterSpacing:-0.3},
  badge:{paddingHorizontal:8,paddingVertical:3,borderRadius:5},badgeTxt:{fontSize:10,fontWeight:'700',letterSpacing:0.3},
});