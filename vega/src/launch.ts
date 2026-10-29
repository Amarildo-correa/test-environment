import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import {
  useHideSplashScreenCallback,
  usePreventHideSplashScreen,
} from '@amazon-devices/react-native-kepler';
import { useReportFullyDrawn } from '@amazon-devices/kepler-performance-api';

// Tela de abertura e medição de "fully drawn" (TTFD), exigidas pelo Vega.
// Fica num módulo próprio para os testes poderem substituí-lo: esses hooks
// só funcionam no aparelho.
export function useLaunchMetrics() {
  usePreventHideSplashScreen();
  const hideSplashScreen = useHideSplashScreenCallback();
  const reportFullyDrawnCallback = useReportFullyDrawn();
  const appStateRef = useRef(AppState.currentState ?? 'active');

  // Partida a frio: o conteúdo é local, então a Home já está pronta na
  // primeira renderização. A tela de abertura sai antes do relatório.
  useEffect(() => {
    hideSplashScreen();
    reportFullyDrawnCallback();
  }, [hideSplashScreen, reportFullyDrawnCallback]);

  // Partida a quente: o app volta do segundo plano já desenhado.
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextState => {
      if (
        (appStateRef.current === 'inactive' ||
          appStateRef.current === 'background') &&
        nextState === 'active'
      ) {
        reportFullyDrawnCallback();
      }
      appStateRef.current = nextState;
    });
    return () => subscription.remove();
  }, [reportFullyDrawnCallback]);
}
