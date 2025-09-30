import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveToStorage<T>(key: string, value: T): Promise<void> {
  try {
    const json = JSON.stringify(value);
    await AsyncStorage.setItem(key, json);
  } catch (error) {
    console.error('Failed to save', key, error);
  }
}

export async function loadFromStorage<T>(key: string): Promise<T | null> {
  try {
    const json = await AsyncStorage.getItem(key);
    if (!json) return null;
    return JSON.parse(json) as T;
  } catch (error) {
    console.error('Failed to load', key, error);
    return null;
  }
}


