import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar hidden />
      <RootNavigator />
    </SafeAreaProvider>
  );
}

export default App;
