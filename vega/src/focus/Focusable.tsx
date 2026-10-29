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

export type FocusableProps = Omit<PressableProps, 'style' | 'children'> & {
  style?: StyleProp<ViewStyle>;
  // Estilo aplicado por cima de `style` enquanto o elemento tem o foco.
  focusedStyle?: StyleProp<ViewStyle>;
  // Recebe o estado de foco para que o conteúdo também possa mudar.
  children?: React.ReactNode | ((focused: boolean) => React.ReactNode);
};

// Elemento selecionável pelo D-pad: OK dispara onPress e o estado de foco
// fica disponível para o estilo e para os filhos.
export const Focusable = forwardRef<View, FocusableProps>(function FocusableImpl(
  { style, focusedStyle, children, onFocus, onBlur, ...rest },
  ref,
) {
  const [focused, setFocused] = useState(false);
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
      onBlur?.(event);
    },
    [onBlur],
  );
  const pressableStyle = useMemo(
    () => (focused ? [style, focusedStyle] : style),
    [focused, style, focusedStyle],
  );

  return (
    <Pressable
      ref={ref}
      focusable
      onFocus={handleFocus}
      onBlur={handleBlur}
      style={pressableStyle}
      {...rest}
    >
      {typeof children === 'function' ? children(focused) : children}
    </Pressable>
  );
});
