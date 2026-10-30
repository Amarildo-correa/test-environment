import React, { forwardRef, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Focusable } from '../focus';
import { colors, px, shapes } from '../theme';

type MicButtonProps = {
  onPress: () => void;
  // Microfone aberto: o botão fica vermelho e vira "parar".
  recording?: boolean;
  // Enquanto pede permissão ou transcreve, o botão não responde.
  disabled?: boolean;
  hasTVPreferredFocus?: boolean;
};

// Botão redondo com o ícone de microfone desenhado com Views (o app não
// carrega fonte de ícones). A cor do ícone segue o rótulo do botão primário.
export const MicButton = forwardRef<View, MicButtonProps>(function MicButtonImpl(
  { onPress, recording = false, disabled = false, hasTVPreferredFocus },
  ref,
) {
  const style = useMemo(
    () => [
      styles.button,
      recording ? styles.recording : styles.idle,
      disabled && styles.disabled,
    ],
    [recording, disabled],
  );

  return (
    <Focusable
      ref={ref}
      onPress={onPress}
      disabled={disabled}
      hasTVPreferredFocus={hasTVPreferredFocus}
      style={style}
      focusedStyle={styles.focused}
      pressedStyle={styles.pressed}
      accessibilityRole="button"
      accessibilityLabel={recording ? 'Parar gravação' : 'Gravar'}
    >
      <View style={styles.icon}>
        <View style={styles.capsule} />
        <View style={styles.cradle} />
        <View style={styles.stem} />
        <View style={styles.base} />
      </View>
    </Focusable>
  );
});

const SIZE = 132;
const ICON_COLOR = colors.onPrimary;

const styles = StyleSheet.create({
  button: {
    width: px(SIZE),
    height: px(SIZE),
    borderRadius: px(SIZE / 2),
    borderWidth: px(shapes.buttonFocusBorder + 2),
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  idle: { backgroundColor: colors.primary },
  recording: { backgroundColor: colors.recording },
  disabled: { opacity: 0.5 },
  focused: { borderColor: colors.focus },
  pressed: { transform: [{ scale: 0.95 }] },
  icon: { width: px(64), height: px(76) },
  capsule: {
    position: 'absolute',
    top: 0,
    left: px(18),
    width: px(28),
    height: px(46),
    borderRadius: px(14),
    backgroundColor: ICON_COLOR,
  },
  cradle: {
    position: 'absolute',
    top: px(22),
    left: px(8),
    width: px(48),
    height: px(30),
    borderWidth: px(5),
    borderTopWidth: 0,
    borderBottomLeftRadius: px(24),
    borderBottomRightRadius: px(24),
    borderColor: ICON_COLOR,
  },
  stem: {
    position: 'absolute',
    top: px(52),
    left: px(29),
    width: px(6),
    height: px(12),
    backgroundColor: ICON_COLOR,
  },
  base: {
    position: 'absolute',
    top: px(64),
    left: px(20),
    width: px(24),
    height: px(6),
    borderRadius: px(3),
    backgroundColor: ICON_COLOR,
  },
});
