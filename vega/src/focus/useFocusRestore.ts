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

  // Devolve o foco ao último item focado (ex.: ao fechar um painel).
  const focusLast = useCallback(() => {
    const tag = findNodeHandle(refs.current[lastFocused.current]);
    if (tag != null) {
      FocusManager.focus(tag);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!mounted.current) {
        mounted.current = true;
        return;
      }
      focusLast();
    }, [focusLast]),
  );

  const remember = useCallback((key: string) => {
    lastFocused.current = key;
  }, []);

  const lastKey = useCallback(() => lastFocused.current, []);

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

  return { remember, isPreferred, register, focusLast, lastKey };
}
