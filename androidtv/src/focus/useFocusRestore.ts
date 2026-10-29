import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

// Lembra qual item de uma tela tinha o foco e o devolve quando a tela volta
// a ficar visível (ex.: ao voltar de uma tela de detalhe).
//
// `hasTVPreferredFocus` só pede o foco quando muda para true, então ao
// retornar à tela o valor é zerado e reaplicado no frame seguinte.
export function useFocusRestore(initialKey: string) {
  const lastFocused = useRef(initialKey);
  const [preferredKey, setPreferredKey] = useState<string | null>(initialKey);

  useFocusEffect(
    useCallback(() => {
      const key = lastFocused.current;
      setPreferredKey(null);
      const frame = requestAnimationFrame(() => setPreferredKey(key));
      return () => cancelAnimationFrame(frame);
    }, []),
  );

  const remember = useCallback((key: string) => {
    lastFocused.current = key;
  }, []);

  const isPreferred = useCallback(
    (key: string) => preferredKey === key,
    [preferredKey],
  );

  return { remember, isPreferred };
}
