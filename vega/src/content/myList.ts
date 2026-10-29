import { useCallback, useEffect, useState } from 'react';
import { AsyncStorage } from '@amazon-devices/react-native-kepler';

// "Minha lista": ids dos cards salvos, guardados no AsyncStorage do Vega
// para continuarem lá depois que o app fecha.
const STORAGE_KEY = 'myList';

let saved: string[] = [];
let loaded = false;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach(listener => listener());
}

async function load() {
  if (loaded) {
    return;
  }
  loaded = true;
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEY);
    saved = value ? JSON.parse(value) : [];
  } catch (error) {
    console.error('[MinhaLista] falha ao ler a lista:', error);
  }
  notify();
}

export function toggleSaved(id: string) {
  saved = saved.includes(id)
    ? saved.filter(item => item !== id)
    : [...saved, id];
  notify();
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(saved)).catch(error =>
    console.error('[MinhaLista] falha ao gravar a lista:', error),
  );
}

export function useMyList() {
  const [ids, setIds] = useState(saved);

  useEffect(() => {
    const update = () => setIds(saved);
    listeners.add(update);
    load();
    return () => {
      listeners.delete(update);
    };
  }, []);

  const isSaved = useCallback((id: string) => ids.includes(id), [ids]);
  return { ids, isSaved, toggleSaved };
}
