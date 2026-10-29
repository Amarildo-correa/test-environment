import React, { forwardRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Focusable } from '../focus';
import { colors, px, shapes, text, typography } from '../theme';

type ButtonProps = {
  label: string;
  onPress: () => void;
  // primary: azul da Amazon; secondary: cinza.
  variant?: 'primary' | 'secondary';
  hasTVPreferredFocus?: boolean;
};

// Botão no padrão do tema da Amazon (Button "contained" da
// kepler-ui-components), montado com Pressable como manda o guia de
// migração do RN 0.83: fundo da variante e borda branca no foco.
export const Button = forwardRef<View, ButtonProps>(function ButtonImpl(
  { label, onPress, variant = 'primary', hasTVPreferredFocus },
  ref,
) {
  return (
    <Focusable
      ref={ref}
      onPress={onPress}
      hasTVPreferredFocus={hasTVPreferredFocus}
      style={variant === 'primary' ? styles.primary : styles.secondary}
      focusedStyle={styles.focused}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={styles.label}>{label}</Text>
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
  label: text(typography.labelMd, colors.textHigh, '700'),
});
