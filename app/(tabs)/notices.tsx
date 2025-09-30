import { Text, View } from '@/components/Themed';
import { loadFromStorage, saveToStorage } from '@/utils/storage';
import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput } from 'react-native';

type Notice = {
  id: string;
  title: string;
  body: string;
  createdAt: number;
};

const STORAGE_KEY = 'notices:v1';

export default function NoticesScreen() {
  const [items, setItems] = useState<Notice[]>([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    (async () => {
      const existing = await loadFromStorage<Notice[]>(STORAGE_KEY);
      if (existing) setItems(existing);
    })();
  }, []);

  async function addNotice() {
    if (!title.trim() || !body.trim()) return;
    const next: Notice = {
      id: String(Date.now()),
      title: title.trim(),
      body: body.trim(),
      createdAt: Date.now(),
    };
    const newItems = [next, ...items];
    setItems(newItems);
    setTitle('');
    setBody('');
    await saveToStorage(STORAGE_KEY, newItems);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Notices</Text>

      <TextInput
        placeholder="Title"
        placeholderTextColor="#64748b"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Body"
        placeholderTextColor="#64748b"
        value={body}
        onChangeText={setBody}
        multiline
        style={[styles.input, styles.inputMultiline]}
      />
      <Pressable style={styles.button} onPress={addNotice}>
        <Text style={styles.buttonText}>Add Notice</Text>
      </Pressable>

      <FlatList
        data={items}
        keyExtractor={(n) => n.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <View style={styles.notice}>
            <Text style={styles.noticeTitle}>{item.title}</Text>
            <Text style={styles.noticeBody}>{item.body}</Text>
            <Text style={styles.noticeTime}>{new Date(item.createdAt).toLocaleString()}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No notices yet</Text>}
        contentContainerStyle={items.length === 0 ? styles.emptyContainer : undefined}
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
    marginBottom: 8,
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    borderColor: '#222',
    color: '#e5e7eb',
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  notice: {
    paddingVertical: 10,
  },
  noticeTitle: {
    fontWeight: '600',
    marginBottom: 4,
    color: '#fff',
  },
  noticeBody: {
    opacity: 0.85,
    color: '#e5e7eb',
  },
  noticeTime: {
    opacity: 0.6,
    marginTop: 4,
    fontSize: 12,
    color: '#94a3b8',
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
  },
});


