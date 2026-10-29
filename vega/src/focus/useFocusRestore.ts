import { useCallback, useRef } from 'react';
import { findNodeHandle, View } from 'react-native';
import { FocusManager } from '@amazon-devices/react-native-kepler';
import { useFocusEffect } from '@amazon-devices/react-navigation__native';

// Lembra qual item de uma tela tinha o foco e o devolve quando a tela volta
// a ficar visível (ex.: ao voltar de uma tela de detalhe).
//
// No Vega, `hasTVPreferredFocus` só vale na montagem, então ele cuida apenas
// do foco inicial; nas voltas seguintes o foco é pedido com FocusManager.
export function useFocusRestore(initialKey: string) {
  const lastFocused = useRef(initialKey);
  const refs = useRef<Record<string, View | null>>({});
  const mounted = useRef(false);

  useFocusEffect(
    useCallback(() => {
      if (!mounted.current) {
        mounted.current = true;
        return;
      }
      const tag = findNodeHandle(refs.current[lastFocused.current]);
      if (tag != null) {
        FocusManager.focus(tag);
      }
    }, []),
  );

  const remember = useCallback((key: string) => {
    lastFocused.current = key;
  }, []);

  const isPreferred = useCallback(
    (key: string) => key === initialKey,
    [initialKey],
  );

  const register = useCallback(
    (key: string) => (node: View | null) => {
      refs.current[key] = node;
    },
    [],
  );

  return { remember, isPreferred, register };
}
