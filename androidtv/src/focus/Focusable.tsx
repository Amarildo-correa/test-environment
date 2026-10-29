import React, { forwardRef, useState } from 'react';
import {
  Pressable,
  PressableProps,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';

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

  return (
    <Pressable
      ref={ref}
      focusable
      onFocus={event => {
        setFocused(true);
        onFocus?.(event);
      }}
      onBlur={event => {
        setFocused(false);
        onBlur?.(event);
      }}
      style={[style, focused && focusedStyle]}
      {...rest}
    >
      {typeof children === 'function' ? children(focused) : children}
    </Pressable>
  );
});
