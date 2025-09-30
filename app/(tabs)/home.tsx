import React from 'react';
import { StyleSheet, Image, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/icon.png')} style={styles.icon} />
      <Text style={styles.title}>Hey there 👋</Text>
      <Text style={styles.subtitle}>Welcome to College Companion</Text>
      <Text style={styles.body}>
        This is your simple space to keep track of college life:
        {'\n'}• Timetable shows today’s classes
        {'\n'}• Notices keeps you updated
        {'\n'}• Notes — coming soon
        {'\n'}
        We’ve kept it clean and basic so it just works.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  icon: {
    width: 96,
    height: 96,
    marginBottom: 16,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#cbd5e1',
    marginBottom: 16,
  },
  body: {
    textAlign: 'center',
    lineHeight: 20,
    color: '#e5e7eb',
  },
});


