import { Dimensions } from 'react-native';

// O layout é desenhado em pixels de uma tela 1920×1080 e escalado para a
// largura real da janela (no Android TV, 1920 px físicos = 960 dp).
const BASE_WIDTH = 1920;

export function px(value: number): number {
  return (value * Dimensions.get('window').width) / BASE_WIDTH;
}

// Identidade visual: tema escuro oficial da Amazon para TV, copiado dos
// tokens de @amazon-devices/kepler-ui-components 3.2.2 (aliasTokensDark,
// buttonTokens, cardTokens, textInputTokens, typographyTokens). Os
// componentes dessa biblioteca estão obsoletos no RN 0.83 e a Amazon manda
// usar React Native puro, então só os valores do tema são reaproveitados.
// Exceção: o destaque usa o ciano do logo Alexa+ no lugar do azul #2D61FF
// do tema, que tem contraste baixo no fundo preto (~4,3:1 contra ~12,4:1).
export const colors = {
  background: '#000000',
  surface: '#202225', // fundo de cards e campos
  primary: '#3FD8F8', // destaque e botão principal (ciano do logo Alexa+)
  onPrimary: '#000000', // texto sobre o ciano; branco teria só ~1,7:1
  secondary: '#727477', // botão secundário
  focus: '#FFFFFF', // borda de foco
  textHigh: '#FFFFFF',
  textMedium: '#BEBFC0',
  placeholder: '#9EA0A2',
  divider: '#2D3034',
};

export const fontFamily = 'Amazon Ember';

// Escala tipográfica da Amazon (tamanho e altura de linha, em px de 1080p).
export const typography = {
  displayMd: { fontSize: 108, lineHeight: 116 },
  displaySm: { fontSize: 80, lineHeight: 88 },
  headlineSm: { fontSize: 36, lineHeight: 44 },
  titleMd: { fontSize: 32, lineHeight: 40 },
  bodyLg: { fontSize: 32, lineHeight: 40 },
  bodyMd: { fontSize: 28, lineHeight: 36 },
  labelMd: { fontSize: 24, lineHeight: 26 },
};

export const shapes = {
  cardRadius: 16,
  cardFocusBorder: 5,
  buttonHeight: 84,
  buttonPadding: 18,
  buttonRadius: 8,
  buttonFocusBorder: 3,
  inputRadius: 5,
  inputFocusBorder: 2,
};

// Texto já convertido para a escala da tela, com a fonte da Amazon.
export function text(
  size: { fontSize: number; lineHeight: number },
  color: string = colors.textHigh,
  fontWeight: '400' | '700' = '400',
) {
  return {
    fontFamily,
    fontSize: px(size.fontSize),
    lineHeight: px(size.lineHeight),
    fontWeight,
    color,
  } as const;
}

// Área segura de ~5% em cada borda.
export const safeArea = {
  horizontal: px(96),
  vertical: px(54),
};
