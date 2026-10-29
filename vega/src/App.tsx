import React, { useEffect, useRef } from 'react';
import { AppState, StyleSheet } from 'react-native';
import {
  useHideSplashScreenCallback,
  usePreventHideSplashScreen,
} from '@amazon-devices/react-native-kepler';
import { useReportFullyDrawn } from '@amazon-devices/kepler-performance-api';
import { GestureHandlerRootView } from '@amazon-devices/react-native-gesture-handler';
import { SafeAreaProvider } from '@amazon-devices/react-native-safe-area-context';
import { RootNavigator } from './navigation';

export const App = () => {
  // Tela de abertura e medição de "fully drawn" (TTFD), exigidas pelo Vega.
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

  // O stack navigator do Vega depende do react-native-gesture-handler, que
  // precisa envolver a árvore de navegação.
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <RootNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
});
