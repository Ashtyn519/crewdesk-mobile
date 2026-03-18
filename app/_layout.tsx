import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { C } from '@/constants/Colors';
export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor={C.bg} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: C.bg }, animation: 'fade' }}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}