import { Text as ThemedText, View as ThemedView } from '@/components/Themed';
import React, { useMemo, useState } from 'react';
import { FlatList, View as RNView, StyleSheet, Text, View } from 'react-native';

type TimetableEntry = {
  id: string;
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';
  time: string; // e.g. 09:00-10:00
  subject: string;
  room: string;
};

const MOCK_TIMETABLE: TimetableEntry[] = [
  { id: '1', day: 'Mon', time: '09:00-10:00', subject: 'Mathematics', room: 'A101' },
  { id: '2', day: 'Mon', time: '10:00-11:00', subject: 'ADA', room: 'B202' },
  { id: '3', day: 'Tue', time: '11:00-12:00', subject: 'AP', room: 'A103' },
  { id: '4', day: 'Wed', time: '13:00-14:00', subject: 'ADA lab', room: 'Lab-1' },
  { id: '5', day: 'Thu', time: '09:00-10:00', subject: 'DBMS', room: 'C301' },
  { id: '6', day: 'Fri', time: '12:00-13:00', subject: 'Contest', room: 'E104' },
];

const DAYS: TimetableEntry['day'][] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function TimetableScreen() {
  const [selectedDay, setSelectedDay] = useState<TimetableEntry['day']>('Mon');

  const filtered = useMemo(
    () => MOCK_TIMETABLE.filter((e) => e.day === selectedDay),
    [selectedDay]
  );

  return (
    <View style={styles.container}>
      <RNView style={styles.dayRow}>
        {DAYS.map((d) => (
          <Text
            key={d}
            onPress={() => setSelectedDay(d)}
            style={[styles.dayChip, selectedDay === d && styles.dayChipActive]}
          >
            {d}
          </Text>
        ))}
      </RNView>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <RNView style={styles.separator} />}
        renderItem={({ item }) => (
          <RNView style={styles.item}>
            <Text style={styles.itemSubject}>{item.subject}</Text>
            <Text style={styles.itemMeta}>{item.time} • {item.room}</Text>
          </RNView>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No classes for {selectedDay}</Text>}
        contentContainerStyle={filtered.length === 0 ? styles.emptyContainer : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#000',
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dayChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    opacity: 0.7,
    borderColor: '#222',
    color: '#e5e7eb',
  },
  dayChipActive: {
    opacity: 1,
    fontWeight: 'bold',
    color: '#fff',
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  itemSubject: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  itemMeta: {
    marginTop: 4,
    opacity: 0.7,
    color: '#cbd5e1',
  },
  separator: {
    height: 1,
    opacity: 0.2,
    backgroundColor: '#1f2937',
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    opacity: 0.6,
    color: '#cbd5e1',
  },
});


