import { Dimensions } from 'react-native';

// O layout é desenhado em pixels de uma tela 1920×1080 e escalado para a
// largura real da janela (no Android TV, 1920 px físicos = 960 dp).
const BASE_WIDTH = 1920;

export function px(value: number): number {
  return (value * Dimensions.get('window').width) / BASE_WIDTH;
}

export const colors = {
  background: '#000000',
  orange: '#FF6A00',
  white: '#FFFFFF',
  black: '#000000',
  divider: '#555555',
  card: '#404040',
};

// Área segura de ~5% em cada borda.
export const safeArea = {
  horizontal: px(96),
  vertical: px(54),
};
