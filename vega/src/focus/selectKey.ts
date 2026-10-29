import { useTVEventHandler } from '@amazon-devices/react-native-kepler';
import type { HWEvent } from '@amazon-devices/react-native-kepler';

// Estado global da tecla OK (select), vindo dos eventos de tecla do Vega:
// eventKeyAction 0 chega ao apertar e se repete enquanto a tecla fica
// segurada; 1 chega ao soltar.
//
// Serve para uma regra de interação: um OK segurado pertence ao elemento
// onde começou. Se, durante um long press, o foco vai para outro elemento
// (um painel ou uma tela nova com foco automático), esse elemento ignora o
// OK até a tecla ser solta e apertada de novo.

// Repetições chegam bem mais rápido que isto; um intervalo maior quer dizer
// que é um novo aperto, mesmo que o aviso de tecla solta tenha se perdido.
const NEW_PRESS_GAP_MS = 700;

let held = false;
let pressStartedAt = 0;
let lastEventAt = 0;

export function handleSelectKey(keyAction: number, now: number = Date.now()) {
  if (keyAction === 0) {
    if (!held || now - lastEventAt > NEW_PRESS_GAP_MS) {
      pressStartedAt = now;
    }
    held = true;
    lastEventAt = now;
  } else if (keyAction === 1) {
    held = false;
    lastEventAt = now;
  }
}

// O OK está segurado desde antes de o elemento receber o foco?
export function isSelectHeldSince(focusedAt: number): boolean {
  return held && focusedAt >= pressStartedAt;
}

// Liga o acompanhamento da tecla OK; usado uma vez, na raiz do app.
export function useSelectKeyTracking() {
  useTVEventHandler((event: HWEvent) => {
    if (event.eventType === 'select' && event.eventKeyAction !== undefined) {
      handleSelectKey(event.eventKeyAction);
    }
  });
}
