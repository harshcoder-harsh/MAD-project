import { loadFromStorage, saveToStorage } from '@/utils/storage';
import { getTodayDay } from '@/utils/dateUtils';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, View as RNView, StyleSheet, Text, View, TextInput, Pressable, Modal } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

type TimetableEntry = {
  id: string;
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';
  time: string; // e.g. 09:00-10:00
  subject: string;
  room: string;
};

const DEFAULT_TIMETABLE: TimetableEntry[] = [
  { id: '1', day: 'Mon', time: '09:00-10:00', subject: 'Mathematics', room: 'A101' },
  { id: '2', day: 'Mon', time: '10:00-11:00', subject: 'ADA', room: 'B202' },
  { id: '3', day: 'Tue', time: '11:00-12:00', subject: 'AP', room: 'A103' },
  { id: '4', day: 'Wed', time: '13:00-14:00', subject: 'ADA lab', room: 'Lab-1' },
  { id: '5', day: 'Thu', time: '09:00-10:00', subject: 'DBMS', room: 'C301' },
  { id: '6', day: 'Fri', time: '12:00-13:00', subject: 'Contest', room: 'E104' },
];

const STORAGE_KEY = 'timetable:v1';
const DAYS: TimetableEntry['day'][] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function TimetableScreen() {
  const [selectedDay, setSelectedDay] = useState<TimetableEntry['day']>(getTodayDay());
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);
  const [formSubject, setFormSubject] = useState('');
  const [formTime, setFormTime] = useState('');
  const [formRoom, setFormRoom] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    (async () => {
      const saved = await loadFromStorage<TimetableEntry[]>(STORAGE_KEY);
      if (saved && saved.length > 0) {
        setEntries(saved);
      } else {
        setEntries(DEFAULT_TIMETABLE);
        await saveToStorage(STORAGE_KEY, DEFAULT_TIMETABLE);
      }
    })();
  }, []);

  const filtered = useMemo(
    () => entries.filter((e) => e.day === selectedDay).sort((a, b) => a.time.localeCompare(b.time)),
    [entries, selectedDay]
  );

  const saveEntry = async () => {
    setFormError('');
    if (!formSubject.trim() || !formTime.trim() || !formRoom.trim()) {
      setFormError('Please fill in all fields');
      return;
    }

    let updated: TimetableEntry[];
    if (editingEntry) {
      updated = entries.map((e) =>
        e.id === editingEntry.id
          ? { ...e, subject: formSubject.trim(), time: formTime.trim(), room: formRoom.trim() }
          : e
      );
    } else {
      updated = [
        ...entries,
        {
          id: String(Date.now()),
          day: selectedDay,
          subject: formSubject.trim(),
          time: formTime.trim(),
          room: formRoom.trim(),
        },
      ];
    }

    setEntries(updated);
    await saveToStorage(STORAGE_KEY, updated);
    setShowModal(false);
    setEditingEntry(null);
    setFormSubject('');
    setFormTime('');
    setFormRoom('');
    setFormError('');
  };

  const deleteEntry = async (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    await saveToStorage(STORAGE_KEY, updated);
  };

  const openEditModal = (entry: TimetableEntry) => {
    setEditingEntry(entry);
    setFormSubject(entry.subject);
    setFormTime(entry.time);
    setFormRoom(entry.room);
    setFormError('');
    setShowModal(true);
  };

  const openAddModal = () => {
    setEditingEntry(null);
    setFormSubject('');
    setFormTime('');
    setFormRoom('');
    setFormError('');
    setShowModal(true);
  };

  const todayDay = getTodayDay();

  return (
    <View style={styles.container}>
      <RNView style={styles.dayRow}>
        <Pressable
          onPress={() => setSelectedDay(todayDay)}
          style={[styles.todayChip, selectedDay === todayDay && styles.todayChipActive]}>
          <Text style={[styles.todayChipText, selectedDay === todayDay && styles.todayChipTextActive]}>
            Today
          </Text>
        </Pressable>
        {DAYS.map((d) => (
          <Pressable
            key={d}
            onPress={() => setSelectedDay(d)}
            style={[styles.dayChip, selectedDay === d && styles.dayChipActive, d === todayDay && styles.dayChipToday]}>
            <Text style={[styles.dayChipText, selectedDay === d && styles.dayChipTextActive]}>
              {d}
            </Text>
          </Pressable>
        ))}
      </RNView>

      <Pressable style={styles.addButton} onPress={openAddModal}>
        <FontAwesome name="plus" size={16} color="#fff" />
        <Text style={styles.addButtonText}>Add Class</Text>
      </Pressable>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <RNView style={styles.separator} />}
        renderItem={({ item }) => (
          <RNView style={styles.item}>
            <RNView style={styles.itemContent}>
              <Text style={styles.itemSubject}>{item.subject}</Text>
              <Text style={styles.itemMeta}>{item.time} • {item.room}</Text>
            </RNView>
            <RNView style={styles.itemActions}>
              <Pressable onPress={() => openEditModal(item)} style={styles.actionButton}>
                <FontAwesome name="edit" size={14} color="#3b82f6" />
              </Pressable>
              <Pressable onPress={() => deleteEntry(item.id)} style={styles.actionButton}>
                <FontAwesome name="trash" size={14} color="#ef4444" />
              </Pressable>
            </RNView>
          </RNView>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No classes for {selectedDay}</Text>}
        contentContainerStyle={filtered.length === 0 ? styles.emptyContainer : undefined}
      />

      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingEntry ? 'Edit Class' : 'Add Class'}</Text>
            <TextInput
              placeholder="Subject"
              placeholderTextColor="#64748b"
              value={formSubject}
              onChangeText={setFormSubject}
              style={styles.input}
            />
            <TextInput
              placeholder="Time (e.g., 09:00-10:00)"
              placeholderTextColor="#64748b"
              value={formTime}
              onChangeText={setFormTime}
              style={styles.input}
            />
            <TextInput
              placeholder="Room"
              placeholderTextColor="#64748b"
              value={formRoom}
              onChangeText={setFormRoom}
              style={styles.input}
            />
            {formError ? <Text style={styles.errorText}>{formError}</Text> : null}
            <RNView style={styles.modalActions}>
              <Pressable style={[styles.modalButton, styles.cancelButton]} onPress={() => setShowModal(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.modalButton, styles.saveButton]} onPress={saveEntry}>
                <Text style={styles.modalButtonText}>Save</Text>
              </Pressable>
            </RNView>
          </View>
        </View>
      </Modal>
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
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  todayChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3b82f6',
    backgroundColor: '#1e3a8a',
  },
  todayChipActive: {
    backgroundColor: '#3b82f6',
  },
  todayChipText: {
    color: '#93c5fd',
    fontSize: 12,
    fontWeight: '600',
  },
  todayChipTextActive: {
    color: '#fff',
  },
  dayChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#222',
    backgroundColor: '#111',
  },
  dayChipToday: {
    borderColor: '#3b82f6',
  },
  dayChipActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  dayChipText: {
    color: '#94a3b8',
    fontSize: 12,
  },
  dayChipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  itemContent: {
    flex: 1,
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
  itemActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 20,
    width: '85%',
    borderWidth: 1,
    borderColor: '#222',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderColor: '#222',
    color: '#e5e7eb',
    backgroundColor: '#000',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginBottom: 8,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#374151',
  },
  saveButton: {
    backgroundColor: '#2563eb',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '600',
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


