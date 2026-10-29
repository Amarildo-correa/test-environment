import React, {
  forwardRef,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Pressable,
  PressableProps,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import { isSelectHeldSince } from './selectKey';

type FocusEventArg = Parameters<NonNullable<PressableProps['onFocus']>>[0];
type BlurEventArg = Parameters<NonNullable<PressableProps['onBlur']>>[0];
type PressEventArg = Parameters<NonNullable<PressableProps['onPressIn']>>[0];
type LongPressEventArg = Parameters<
  NonNullable<PressableProps['onLongPress']>
>[0];

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
//
// Um OK que já estava segurado quando o elemento recebeu o foco (ex.: o foco
// automático de um painel aberto por long press) é ignorado por inteiro: sem
// estilo de pressionado, onPress ou onLongPress. Só um aperto novo vale.
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
    onPress,
    onLongPress,
    ...rest
  },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const [pressed, setPressed] = useState(false);
  const focusedAt = useRef(0);
  const ignoringPress = useRef(false);
  const handleFocus = useCallback(
    (event: FocusEventArg) => {
      focusedAt.current = Date.now();
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
      ignoringPress.current = isSelectHeldSince(focusedAt.current);
      if (ignoringPress.current) {
        return;
      }
      setPressed(true);
      onPressIn?.(event);
    },
    [onPressIn],
  );
  const handlePressOut = useCallback(
    (event: PressEventArg) => {
      setPressed(false);
      if (!ignoringPress.current) {
        onPressOut?.(event);
      }
    },
    [onPressOut],
  );
  // O Pressable chama onPress logo depois de onPressOut.
  const handlePress = useCallback(
    (event: PressEventArg) => {
      if (ignoringPress.current) {
        ignoringPress.current = false;
        return;
      }
      onPress?.(event);
    },
    [onPress],
  );
  const handleLongPress = useCallback(
    (event: LongPressEventArg) => {
      if (!ignoringPress.current) {
        onLongPress?.(event);
      }
    },
    [onLongPress],
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
      // Só repassa os handlers que existem: o Pressable usa a presença de
      // onLongPress para decidir se o long press consome o clique.
      onPress={onPress ? handlePress : undefined}
      onLongPress={onLongPress ? handleLongPress : undefined}
      style={pressableStyle}
      {...rest}
    >
      {typeof children === 'function' ? children(focused) : children}
    </Pressable>
  );
});
