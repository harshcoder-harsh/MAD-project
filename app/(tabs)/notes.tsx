import { loadFromStorage, saveToStorage } from '@/utils/storage';
import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
};

const STORAGE_KEY = 'notes:v1';

export default function NotesScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    (async () => {
      const saved = await loadFromStorage<Note[]>(STORAGE_KEY);
      if (saved) setNotes(saved);
    })();
  }, []);

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function saveNote() {
    if (!title.trim() || !content.trim()) return;

    let updated: Note[];
    if (editingId) {
      updated = notes.map((n) =>
        n.id === editingId
          ? { ...n, title: title.trim(), content: content.trim(), updatedAt: Date.now() }
          : n
      );
    } else {
      const newNote: Note = {
        id: String(Date.now()),
        title: title.trim(),
        content: content.trim(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      updated = [newNote, ...notes];
    }

    setNotes(updated);
    await saveToStorage(STORAGE_KEY, updated);
    setTitle('');
    setContent('');
    setEditingId(null);
  }

  async function deleteNote(id: string) {
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    await saveToStorage(STORAGE_KEY, updated);
  }

  function startEdit(note: Note) {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
  }

  function cancelEdit() {
    setEditingId(null);
    setTitle('');
    setContent('');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Notes</Text>

      <TextInput
        placeholder="Search notes..."
        placeholderTextColor="#64748b"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchInput}
      />

      <TextInput
        placeholder="Note title"
        placeholderTextColor="#64748b"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Note content"
        placeholderTextColor="#64748b"
        value={content}
        onChangeText={setContent}
        multiline
        style={[styles.input, styles.inputMultiline]}
      />
      <View style={styles.buttonRow}>
        {editingId && (
          <Pressable style={[styles.button, styles.cancelButton]} onPress={cancelEdit}>
            <Text style={styles.buttonText}>Cancel</Text>
          </Pressable>
        )}
        <Pressable style={[styles.button, styles.saveButton]} onPress={saveNote}>
          <Text style={styles.buttonText}>{editingId ? 'Update' : 'Add'} Note</Text>
        </Pressable>
      </View>

      <FlatList
        data={filteredNotes}
        keyExtractor={(n) => n.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <View style={styles.note}>
            <View style={styles.noteHeader}>
              <View style={styles.noteContent}>
                <Text style={styles.noteTitle}>{item.title}</Text>
                <Text style={styles.noteText} numberOfLines={3}>
                  {item.content}
                </Text>
                <Text style={styles.noteTime}>
                  {new Date(item.updatedAt).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.noteActions}>
                <Pressable onPress={() => startEdit(item)} style={styles.actionButton}>
                  <FontAwesome name="edit" size={16} color="#3b82f6" />
                </Pressable>
                <Pressable onPress={() => deleteNote(item.id)} style={styles.actionButton}>
                  <FontAwesome name="trash" size={16} color="#ef4444" />
                </Pressable>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {searchQuery ? 'No notes found' : 'No notes yet. Create your first note!'}
          </Text>
        }
        contentContainerStyle={filteredNotes.length === 0 ? styles.emptyContainer : undefined}
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
  heading: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#fff',
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    borderColor: '#222',
    color: '#e5e7eb',
    backgroundColor: '#111',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    borderColor: '#222',
    color: '#e5e7eb',
    backgroundColor: '#111',
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#2563eb',
  },
  cancelButton: {
    backgroundColor: '#374151',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  note: {
    paddingVertical: 12,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  noteContent: {
    flex: 1,
  },
  noteTitle: {
    fontWeight: '600',
    marginBottom: 6,
    color: '#fff',
    fontSize: 16,
  },
  noteText: {
    opacity: 0.85,
    color: '#e5e7eb',
    marginBottom: 6,
    lineHeight: 20,
  },
  noteTime: {
    opacity: 0.6,
    fontSize: 12,
    color: '#94a3b8',
  },
  noteActions: {
    flexDirection: 'row',
    gap: 12,
    marginLeft: 8,
  },
  actionButton: {
    padding: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#1f2937',
    opacity: 0.5,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    opacity: 0.6,
    color: '#cbd5e1',
    textAlign: 'center',
  },
});

