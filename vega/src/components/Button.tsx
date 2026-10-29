import React, { forwardRef, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Focusable } from '../focus';
import { colors, px, shapes, text, typography } from '../theme';

type ButtonProps = {
  label: string;
  onPress: () => void;
  // primary: ciano do logo Alexa+; secondary: cinza.
  variant?: 'primary' | 'secondary';
  hasTVPreferredFocus?: boolean;
  // Ocupa a largura toda do contêiner (ex.: botões empilhados num painel).
  fullWidth?: boolean;
};

// Botão no padrão do tema da Amazon (Button "contained" da
// kepler-ui-components), montado com Pressable como manda o guia de
// migração do RN 0.83: fundo da variante e borda branca no foco. No
// primário (ciano) o rótulo é preto, para manter o contraste.
export const Button = forwardRef<View, ButtonProps>(function ButtonImpl(
  { label, onPress, variant = 'primary', hasTVPreferredFocus, fullWidth },
  ref,
) {
  const style = useMemo(
    () => [
      variant === 'primary' ? styles.primary : styles.secondary,
      fullWidth && styles.fullWidth,
    ],
    [variant, fullWidth],
  );

  return (
    <Focusable
      ref={ref}
      onPress={onPress}
      hasTVPreferredFocus={hasTVPreferredFocus}
      style={style}
      focusedStyle={styles.focused}
      pressedStyle={styles.pressed}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={variant === 'primary' ? styles.labelPrimary : styles.label}>
        {label}
      </Text>
    </Focusable>
  );
});

const base = {
  height: px(shapes.buttonHeight),
  paddingHorizontal: px(shapes.buttonPadding * 2),
  borderRadius: px(shapes.buttonRadius),
  borderWidth: px(shapes.buttonFocusBorder),
  borderColor: 'transparent',
  justifyContent: 'center',
  alignItems: 'center',
  alignSelf: 'flex-start',
} as const;

const styles = StyleSheet.create({
  primary: { ...base, backgroundColor: colors.primary },
  secondary: { ...base, backgroundColor: colors.secondary },
  focused: { borderColor: colors.focus },
  pressed: { transform: [{ scale: 0.95 }] },
  fullWidth: { alignSelf: 'stretch' },
  label: text(typography.labelMd, colors.textHigh, '700'),
  labelPrimary: text(typography.labelMd, colors.onPrimary, '700'),
});
