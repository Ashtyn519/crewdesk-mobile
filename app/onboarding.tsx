import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Animated, TouchableOpacity,
  StatusBar, Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { C } from '../constants/Colors';

const { width, height } = Dimensions.get('window');

const STEPS = [
  {
    title: 'Your Operating System',
    subtitle: 'for Freelance Workforce',
    description: 'Manage your entire freelance operation from one powerful platform. Projects, crew, invoices, and contracts — all in sync.',
    icon: '◆',
    color: C.accent,
  },
  {
    title: 'Build Your Dream Team',
    subtitle: 'Crew Management Made Simple',
    description: 'Invite freelancers, track their rates, manage contracts, and rate performance. Your crew — always organised.',
    icon: '◉',
    color: C.info,
  },
  {
    title: 'Get Paid Faster',
    subtitle: 'Invoicing on Autopilot',
    description: 'Create professional invoices in seconds, track payments, and get insights on your revenue. Focus on the work that matters.',
    icon: '◎',
    color: C.success,
  },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const goNext = () => {
    if (step < STEPS.length - 1) {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
          Animated.timing(scaleAnim, { toValue: 0.92, duration: 150, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
          Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 100, friction: 8 }),
        ]),
      ]).start();
      setStep(s => s + 1);
    } else {
      router.replace('/(tabs)');
    }
  };

  const s = STEPS[step];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {/* Skip */}
      <TouchableOpacity style={styles.skipBtn} onPress={() => router.replace('/(tabs)')}>
        <Text style={styles.skipTxt}>Skip</Text>
      </TouchableOpacity>

      {/* Main content */}
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        {/* Icon */}
        <View style={[styles.iconRing, { borderColor: s.color + '30' }]}>
          <View style={[styles.iconInner, { backgroundColor: s.color + '15', borderColor: s.color + '25' }]}>
            <Text style={[styles.icon, { color: s.color }]}>{s.icon}</Text>
          </View>
        </View>

        {/* Text */}
        <View style={styles.textBlock}>
          <Text style={[styles.title, { color: s.color }]}>{s.title}</Text>
          <Text style={styles.subtitle}>{s.subtitle}</Text>
          <Text style={styles.description}>{s.description}</Text>
        </View>
      </Animated.View>

      {/* Bottom */}
      <View style={styles.bottom}>
        {/* Dots */}
        <View style={styles.dots}>
          {STEPS.map((_, i) => (
            <View key={i} style={[
              styles.dot,
              i === step ? [styles.dotActive, { backgroundColor: s.color }] : styles.dotInactive
            ]} />
          ))}
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={[styles.cta, { backgroundColor: s.color }]}
          onPress={goNext}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaTxt}>
            {step < STEPS.length - 1 ? 'Continue' : 'Get Started'}
          </Text>
          <Text style={styles.ctaArrow}>→</Text>
        </TouchableOpacity>

        <Text style={styles.stepCount}>{step + 1} of {STEPS.length}</Text>
      </View>

      {/* Background orbs */}
      <View style={[styles.orb, styles.orb1, { backgroundColor: s.color }]} />
      <View style={[styles.orb, styles.orb2, { backgroundColor: s.color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  skipBtn: { position: 'absolute', top: 56, right: 24, zIndex: 10, padding: 8 },
  skipTxt: { fontSize: 14, color: C.textSecondary, fontWeight: '500' },
  content: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconRing: {
    width: 140, height: 140, borderRadius: 70,
    borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 40,
  },
  iconInner: {
    width: 100, height: 100, borderRadius: 50,
    borderWidth: 1, alignItems: 'center', justifyContent: 'center',
  },
  icon: { fontSize: 44 },
  textBlock: { alignItems: 'center' },
  title: { fontSize: 30, fontWeight: '800', textAlign: 'center', marginBottom: 6, letterSpacing: -0.5 },
  subtitle: { fontSize: 18, fontWeight: '600', color: C.text, textAlign: 'center', marginBottom: 16 },
  description: { fontSize: 15, color: C.textSecondary, textAlign: 'center', lineHeight: 22, maxWidth: 280 },
  bottom: { paddingHorizontal: 32, paddingBottom: 52, alignItems: 'center' },
  dots: { flexDirection: 'row', gap: 8, marginBottom: 28 },
  dot: { height: 6, borderRadius: 3 },
  dotActive: { width: 24 },
  dotInactive: { width: 6, backgroundColor: C.border },
  cta: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    width: width - 64, paddingVertical: 16, borderRadius: 16,
    marginBottom: 16, gap: 8,
  },
  ctaTxt: { fontSize: 17, fontWeight: '800', color: '#000' },
  ctaArrow: { fontSize: 18, color: '#000', fontWeight: '700' },
  stepCount: { fontSize: 13, color: C.textMuted },
  orb: { position: 'absolute', borderRadius: 999, opacity: 0.06 },
  orb1: { width: 300, height: 300, top: -80, right: -100 },
  orb2: { width: 200, height: 200, bottom: 60, left: -80 },
});
