import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import {
  Pressable,
  PressableProps,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';

type FocusEventArg = Parameters<NonNullable<PressableProps['onFocus']>>[0];
type BlurEventArg = Parameters<NonNullable<PressableProps['onBlur']>>[0];
type PressEventArg = Parameters<NonNullable<PressableProps['onPressIn']>>[0];

export type FocusableProps = Omit<PressableProps, 'style' | 'children'> & {
  style?: StyleProp<ViewStyle>;
  // Estilo aplicado por cima de `style` enquanto o elemento tem o foco.
  focusedStyle?: StyleProp<ViewStyle>;
  // Estilo enquanto o OK está apertado (inclusive segurando para o long press).
  pressedStyle?: StyleProp<ViewStyle>;
  // Recebe o estado de foco para que o conteúdo também possa mudar.
  children?: React.ReactNode | ((focused: boolean) => React.ReactNode);
};

// Elemento selecionável pelo D-pad: OK dispara onPress e o estado de foco
// fica disponível para o estilo e para os filhos.
export const Focusable = forwardRef<View, FocusableProps>(function FocusableImpl(
  {
    style,
    focusedStyle,
    pressedStyle,
    children,
    onFocus,
    onBlur,
    onPressIn,
    onPressOut,
    ...rest
  },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const [pressed, setPressed] = useState(false);
  const handleFocus = useCallback(
    (event: FocusEventArg) => {
      setFocused(true);
      onFocus?.(event);
    },
    [onFocus],
  );
  const handleBlur = useCallback(
    (event: BlurEventArg) => {
      setFocused(false);
      // Ao perder o foco (ex.: navegação no meio de um long press), o
      // onPressOut pode não chegar; desfaz o estado de pressionado.
      setPressed(false);
      onBlur?.(event);
    },
    [onBlur],
  );
  const handlePressIn = useCallback(
    (event: PressEventArg) => {
      setPressed(true);
      onPressIn?.(event);
    },
    [onPressIn],
  );
  const handlePressOut = useCallback(
    (event: PressEventArg) => {
      setPressed(false);
      onPressOut?.(event);
    },
    [onPressOut],
  );
  const pressableStyle = useMemo(
    () => [style, focused && focusedStyle, pressed && pressedStyle],
    [focused, pressed, style, focusedStyle, pressedStyle],
  );

  return (
    <Pressable
      ref={ref}
      focusable
      onFocus={handleFocus}
      onBlur={handleBlur}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={pressableStyle}
      {...rest}
    >
      {typeof children === 'function' ? children(focused) : children}
    </Pressable>
  );
});
