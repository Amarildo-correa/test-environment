import { useRef } from 'react';
import { useTVEventHandler } from '@amazon-devices/react-native-kepler';
import type { HWEvent } from '@amazon-devices/react-native-kepler';
import { playUiSound } from './uiSounds';

const DIRECTIONS = new Set(['up', 'down', 'left', 'right']);

// Toca os sons de interface a partir das teclas do controle, em todas as
// telas: tique nos direcionais (inclusive nas repetições ao segurar), um som
// ao apertar OK e outro ao apertar Voltar. Usado uma vez, na raiz do app.
export function useUiSounds() {
  const selectHeld = useRef(false);

  useTVEventHandler((event: HWEvent) => {
    const { eventType, eventKeyAction } = event;
    if (DIRECTIONS.has(eventType)) {
      if (eventKeyAction !== 1) {
        playUiSound('move');
      }
      return;
    }
    if (eventType === 'select') {
      // Um som por aperto, não um por repetição enquanto o OK fica segurado.
      if (eventKeyAction === 0 && !selectHeld.current) {
        playUiSound('select');
      }
      selectHeld.current = eventKeyAction === 0;
      return;
    }
    if (eventType === 'back' && eventKeyAction !== 1) {
      playUiSound('back');
    }
  });
}
