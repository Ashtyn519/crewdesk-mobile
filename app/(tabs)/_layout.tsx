import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { C } from '@/constants/Colors';
const ICONS: Record<string,string> = { index:'⌂', projects:'◫', invoices:'◎', messages:'◉', crew:'⊙' };
const LABELS: Record<string,string> = { index:'Overview', projects:'Projects', invoices:'Invoices', messages:'Messages', crew:'Crew' };
function Icon({ name, focused }: { name: string; focused: boolean }) {
  return (
    <View style={st.tab}>
      {focused && <View style={st.bar} />}
      <Text style={[st.icon, focused && st.iconOn]}>{ICONS[name]}</Text>
      <Text style={[st.lbl, focused && st.lblOn]}>{LABELS[name]}</Text>
    </View>
  );
}
export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarStyle: st.tabBar, tabBarShowLabel: false }}>
      {Object.keys(ICONS).map(name => (
        <Tabs.Screen key={name} name={name} options={{ tabBarIcon: ({ focused }) => <Icon name={name} focused={focused} /> }} />
      ))}
    </Tabs>
  );
}
const st = StyleSheet.create({
  tabBar:{backgroundColor:C.surface,borderTopColor:C.border,borderTopWidth:1,height:70,paddingBottom:6},
  tab:{alignItems:'center',width:60,paddingTop:10,position:'relative'},
  bar:{position:'absolute',top:0,left:10,right:10,height:2,backgroundColor:C.accent,borderRadius:1},
  icon:{fontSize:18,color:C.textMuted,marginBottom:4},
  iconOn:{color:C.accent},
  lbl:{fontSize:10,color:C.textMuted,fontWeight:'500'},
  lblOn:{color:C.accent,fontWeight:'700'},
});