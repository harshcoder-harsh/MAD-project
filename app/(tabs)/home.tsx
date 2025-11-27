import { loadFromStorage } from '@/utils/storage';
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Image, Text, View, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

type TimetableEntry = {
  id: string;
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';
  time: string;
  subject: string;
  room: string;
};

type Notice = {
  id: string;
  title: string;
  body: string;
  createdAt: number;
};

type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
};

function getTodayDay(): 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date().getDay();
  const dayName = days[today] as 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';
  return dayName === 'Sun' ? 'Mon' : dayName;
}

export default function HomeScreen() {
  const router = useRouter();
  const [todayClasses, setTodayClasses] = useState<TimetableEntry[]>([]);
  const [noticesCount, setNoticesCount] = useState(0);
  const [notesCount, setNotesCount] = useState(0);
  const todayDay = getTodayDay();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const timetable = await loadFromStorage<TimetableEntry[]>('timetable:v1');
    const notices = await loadFromStorage<Notice[]>('notices:v1');
    const notes = await loadFromStorage<Note[]>('notes:v1');

    if (timetable) {
      const today = timetable.filter((e) => e.day === todayDay);
      setTodayClasses(today.sort((a, b) => a.time.localeCompare(b.time)));
    }
    if (notices) setNoticesCount(notices.length);
    if (notes) setNotesCount(notes.length);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Image source={require('@/assets/images/icon.png')} style={styles.icon} />
        <Text style={styles.title}>Hey there 👋</Text>
        <Text style={styles.subtitle}>Welcome to College Companion</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <FontAwesome name="calendar" size={24} color="#3b82f6" />
          <Text style={styles.statNumber}>{todayClasses.length}</Text>
          <Text style={styles.statLabel}>Today's Classes</Text>
        </View>
        <View style={styles.statCard}>
          <FontAwesome name="bullhorn" size={24} color="#10b981" />
          <Text style={styles.statNumber}>{noticesCount}</Text>
          <Text style={styles.statLabel}>Notices</Text>
        </View>
        <View style={styles.statCard}>
          <FontAwesome name="sticky-note" size={24} color="#f59e0b" />
          <Text style={styles.statNumber}>{notesCount}</Text>
          <Text style={styles.statLabel}>Notes</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Classes ({todayDay})</Text>
          <Pressable onPress={() => router.push('/(tabs)/timetable')}>
            <Text style={styles.seeAll}>See All</Text>
          </Pressable>
        </View>
        {todayClasses.length > 0 ? (
          <View style={styles.classesList}>
            {todayClasses.map((cls) => (
              <View key={cls.id} style={styles.classItem}>
                <View style={styles.classTime}>
                  <Text style={styles.classTimeText}>{cls.time}</Text>
                </View>
                <View style={styles.classInfo}>
                  <Text style={styles.classSubject}>{cls.subject}</Text>
                  <Text style={styles.classRoom}>{cls.room}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>No classes scheduled for today</Text>
        )}
      </View>

      <View style={styles.quickActions}>
        <Pressable
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/timetable')}>
          <FontAwesome name="calendar" size={20} color="#fff" />
          <Text style={styles.actionText}>Timetable</Text>
        </Pressable>
        <Pressable
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/notices')}>
          <FontAwesome name="bullhorn" size={20} color="#fff" />
          <Text style={styles.actionText}>Notices</Text>
        </Pressable>
        <Pressable
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/notes')}>
          <FontAwesome name="sticky-note" size={20} color="#fff" />
          <Text style={styles.actionText}>Notes</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  icon: {
    width: 80,
    height: 80,
    marginBottom: 12,
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
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  seeAll: {
    color: '#3b82f6',
    fontSize: 14,
  },
  classesList: {
    gap: 8,
  },
  classItem: {
    flexDirection: 'row',
    backgroundColor: '#111',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#222',
  },
  classTime: {
    width: 80,
    justifyContent: 'center',
  },
  classTimeText: {
    color: '#3b82f6',
    fontWeight: '600',
    fontSize: 12,
  },
  classInfo: {
    flex: 1,
  },
  classSubject: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  classRoom: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 4,
  },
  emptyText: {
    color: '#64748b',
    textAlign: 'center',
    padding: 20,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#111',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222',
    gap: 8,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
});


