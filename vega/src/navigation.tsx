import React, { useCallback, useEffect, useState } from 'react';
import {
  enableFreeze,
  enableScreens,
} from '@amazon-devices/react-native-screens';
import {
  createNavigationContainerRef,
  DarkTheme,
  NavigationContainer,
} from '@amazon-devices/react-navigation__native';
import { createStackNavigator } from '@amazon-devices/react-navigation__stack';
import { HomeScreen } from './screens/HomeScreen';
import { DetailScreen } from './screens/DetailScreen';
import { SearchScreen } from './screens/SearchScreen';
import {
  resolveLaunch,
  subscribePendingLaunch,
  takePendingLaunch,
} from './contentLauncher/pendingLaunch';
import { colors } from './theme';

export type RootStackParamList = {
  Home: undefined;
  Detail: { id: string };
  Search: { query?: string };
};

// Otimizações recomendadas pela Amazon para a navegação no Vega.
enableScreens();
enableFreeze();

const Stack = createStackNavigator<RootStackParamList>();

const navigationRef = createNavigationContainerRef<RootStackParamList>();

// Abre o que o Content Launcher pediu. A pilha fica Home → destino, para o
// Voltar sempre levar à Home.
function openPendingLaunch() {
  const launch = takePendingLaunch();
  if (!launch) {
    return;
  }
  const route = resolveLaunch(launch);
  console.log('[ContentLauncher] abrindo:', JSON.stringify(route));
  navigationRef.reset({
    index: 1,
    routes: [
      { name: 'Home' },
      route.screen === 'Detail'
        ? { name: 'Detail', params: { id: route.id } }
        : { name: 'Search', params: { query: route.query } },
    ],
  });
}

const theme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: colors.background },
};

export function RootNavigator() {
  const [ready, setReady] = useState(false);
  const handleReady = useCallback(() => setReady(true), []);

  // Pedido que chegou antes da navegação ficar pronta (partida a frio) é
  // aberto agora; os seguintes, assim que chegarem.
  useEffect(() => {
    if (!ready) {
      return;
    }
    openPendingLaunch();
    return subscribePendingLaunch(openPendingLaunch);
  }, [ready]);

  return (
    <NavigationContainer ref={navigationRef} theme={theme} onReady={handleReady}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
