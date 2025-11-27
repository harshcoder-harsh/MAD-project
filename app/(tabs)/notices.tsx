import { Text, View } from '@/components/Themed';
import { STORAGE_KEYS } from '@/constants/StorageKeys';
import { formatDate } from '@/utils/dateUtils';
import { loadFromStorage, saveToStorage } from '@/utils/storage';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, View as RNView, StyleSheet, TextInput } from 'react-native';

type Notice = {
  id: string;
  title: string;
  body: string;
  createdAt: number;
};


export default function NoticesScreen() {
  const [items, setItems] = useState<Notice[]>([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      const existing = await loadFromStorage<Notice[]>(STORAGE_KEYS.NOTICES);
      if (existing) setItems(existing);
    })();
  }, []);

  async function addNotice() {
    setError('');
    if (!title.trim() || !body.trim()) {
      setError('Please fill in both title and body');
      return;
    }
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
    setError('');
    await saveToStorage(STORAGE_KEY, newItems);
  }

  async function deleteNotice(id: string) {
    const newItems = items.filter((n) => n.id !== id);
    setItems(newItems);
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
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Pressable style={styles.button} onPress={addNotice}>
        <Text style={styles.buttonText}>Add Notice</Text>
      </Pressable>

      <FlatList
        data={items}
        keyExtractor={(n) => n.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <View style={styles.notice}>
            <RNView style={styles.noticeHeader}>
              <RNView style={styles.noticeContent}>
                <Text style={styles.noticeTitle}>{item.title}</Text>
                <Text style={styles.noticeBody}>{item.body}</Text>
                <Text style={styles.noticeTime}>{formatDate(item.createdAt)}</Text>
              </RNView>
              <Pressable onPress={() => deleteNotice(item.id)} style={styles.deleteButton}>
                <FontAwesome name="trash" size={16} color="#ef4444" />
              </Pressable>
            </RNView>
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
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginBottom: 8,
  },
  notice: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#111',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#222',
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  noticeContent: {
    flex: 1,
  },
  noticeTitle: {
    fontWeight: '600',
    marginBottom: 4,
    color: '#fff',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
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
    height: 12,
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


