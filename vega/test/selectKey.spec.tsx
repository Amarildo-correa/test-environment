import 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import * as React from 'react';
import { Text } from 'react-native';

import { Focusable } from '../src/focus';
import { handleSelectKey } from '../src/focus/selectKey';

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(1_000_000);
});
afterEach(() => {
  handleSelectKey(1);
  jest.useRealTimers();
});

function renderButton(onPress: jest.Mock, onLongPress?: jest.Mock) {
  const screen = render(
    <Focusable
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityLabel="botão"
    >
      <Text>botão</Text>
    </Focusable>,
  );
  return screen.getByLabelText('botão');
}

// Simula um aperto completo de OK chegando ao Pressable: pressIn, pressOut e,
// em seguida, press (o Pressable chama onPress logo depois de onPressOut).
function pressOk(button: ReturnType<typeof renderButton>) {
  fireEvent(button, 'pressIn');
  fireEvent(button, 'pressOut');
  fireEvent.press(button);
}

describe('OK segurado de outro elemento', () => {
  it('é ignorado pelo elemento que recebeu o foco durante o aperto', () => {
    const onPress = jest.fn();
    const onLongPress = jest.fn();
    const button = renderButton(onPress, onLongPress);

    handleSelectKey(0); // OK apertado em outro lugar (ex.: long press num card)
    jest.advanceTimersByTime(600);
    fireEvent(button, 'focus'); // painel abre e o foco vem para cá
    handleSelectKey(0); // repetição: a tecla continua segurada
    fireEvent(button, 'pressIn');
    fireEvent(button, 'longPress'); // o long press dispara durante o aperto
    fireEvent(button, 'pressOut');

    expect(onPress).not.toHaveBeenCalled();
    expect(onLongPress).not.toHaveBeenCalled();
  });

  it('vale de novo depois que a tecla é solta e apertada outra vez', () => {
    const onPress = jest.fn();
    const button = renderButton(onPress);

    handleSelectKey(0);
    jest.advanceTimersByTime(600);
    fireEvent(button, 'focus');
    handleSelectKey(1); // soltou
    jest.advanceTimersByTime(300);
    handleSelectKey(0); // aperto novo, com o foco já aqui
    pressOk(button);

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('um aperto comum no elemento focado funciona', () => {
    const onPress = jest.fn();
    const button = renderButton(onPress);

    fireEvent(button, 'focus');
    jest.advanceTimersByTime(100);
    handleSelectKey(0);
    pressOk(button);

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
