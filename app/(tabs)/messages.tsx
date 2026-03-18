import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { C } from '@/constants/Colors';
const DATA = [
  { name:'Jordan Lee', msg:'Final selects attached. Ready for review', time:'2m', unread:2 },
  { name:'Sam Torres', msg:'Can we push the deadline by two days?', time:'1h', unread:0 },
  { name:'Nike SS25', msg:'Brief updated — check new deliverables', time:'3h', unread:1 },
];
export default function MessagesScreen() {
  return (
    <ScrollView style={st.screen} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View style={st.hdr}><Text style={st.title}>Messages</Text><TouchableOpacity style={st.btn}><Text style={st.btnTxt}>+ New</Text></TouchableOpacity></View>
      <View style={st.search}><Text style={st.searchTxt}>Search conversations...</Text></View>
      {DATA.map(t => (
        <TouchableOpacity key={t.name} style={st.card} activeOpacity={0.7}>
          <View style={st.row}>
            <View style={st.av}><Text style={st.avTxt}>{t.name[0]}</Text></View>
            <View style={{flex:1,marginLeft:12}}>
              <View style={st.meta}><Text style={st.name}>{t.name}</Text><Text style={st.time}>{t.time}</Text></View>
              <Text style={st.msg} numberOfLines={1}>{t.msg}</Text>
            </View>
            {t.unread>0&&<View style={st.badge}><Text style={st.badgeTxt}>{t.unread}</Text></View>}
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
const st = StyleSheet.create({
  screen:{flex:1,backgroundColor:C.bg},hdr:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding:20,paddingTop:16},
  title:{fontSize:22,fontWeight:'700',color:C.textPrimary,letterSpacing:-0.5},
  btn:{backgroundColor:C.accent,paddingHorizontal:14,paddingVertical:8,borderRadius:7},btnTxt:{fontSize:13,fontWeight:'700',color:'#fff'},
  search:{marginHorizontal:20,marginBottom:14,padding:13,backgroundColor:C.surface,borderRadius:8,borderWidth:1,borderColor:C.border},
  searchTxt:{fontSize:13,color:C.textMuted},
  card:{backgroundColor:C.surface,borderRadius:10,borderWidth:1,borderColor:C.border,padding:16,marginHorizontal:20,marginBottom:8},
  row:{flexDirection:'row',alignItems:'center'},
  av:{width:40,height:40,borderRadius:20,backgroundColor:C.accentBg,borderWidth:1,borderColor:C.accentBorder,alignItems:'center',justifyContent:'center'},
  avTxt:{fontSize:15,fontWeight:'700',color:C.accentLight},
  meta:{flexDirection:'row',justifyContent:'space-between',marginBottom:3},
  name:{fontSize:14,fontWeight:'600',color:C.textPrimary,letterSpacing:-0.2},time:{fontSize:11,color:C.textMuted},
  msg:{fontSize:12,color:C.textMuted},
  badge:{width:20,height:20,borderRadius:10,backgroundColor:C.accent,alignItems:'center',justifyContent:'center',marginLeft:8},
  badgeTxt:{fontSize:10,fontWeight:'700',color:'#fff'},
});