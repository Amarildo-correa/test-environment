import React from 'react';
import {
  enableFreeze,
  enableScreens,
} from '@amazon-devices/react-native-screens';
import {
  DarkTheme,
  NavigationContainer,
} from '@amazon-devices/react-navigation__native';
import { createStackNavigator } from '@amazon-devices/react-navigation__stack';
import { HomeScreen } from './screens/HomeScreen';
import { DetailScreen } from './screens/DetailScreen';
import { SearchScreen } from './screens/SearchScreen';
import { MyListScreen } from './screens/MyListScreen';
import { RecordScreen } from './screens/RecordScreen';
import { colors } from './theme';

export type RootStackParamList = {
  Home: undefined;
  Detail: { id: string };
  Search: { query?: string };
  MyList: undefined;
  Record: undefined;
};

// Otimizações recomendadas pela Amazon para a navegação no Vega.
enableScreens();
enableFreeze();

const Stack = createStackNavigator<RootStackParamList>();

const theme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: colors.background },
};

export function RootNavigator() {
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="MyList" component={MyListScreen} />
        <Stack.Screen name="Record" component={RecordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
