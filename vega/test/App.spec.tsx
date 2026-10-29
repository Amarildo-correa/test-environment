import 'react-native';
import { act, fireEvent, render } from '@testing-library/react-native';
import * as React from 'react';

import { App } from '../src/App';
import { articles } from '../src/content/articles';

// Os hooks de splash e TTFD só funcionam no aparelho: no Jest, o
// react-native-kepler referencia `Platform` sem importá-lo e quebra.
jest.mock('../src/launch', () => ({ useLaunchMetrics: jest.fn() }));
// O áudio só existe no aparelho.
jest.mock('../src/sounds/useUiSounds', () => ({ useUiSounds: jest.fn() }));

// O stack navigator agenda animações com timers; com timers falsos e a
// desmontagem no fim, nada roda depois que o ambiente de teste fecha.
beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

describe('App', () => {
  it('mostra o cabeçalho, o título e os 6 cards da Home', () => {
    const screen = render(<App />);
    expect(screen.getByText('Amazon Fire Stick')).toBeTruthy();
    expect(screen.getByText('VEGA OS')).toBeTruthy();
    expect(screen.getByText('World')).toBeTruthy();
    expect(screen.getByLabelText('Buscar')).toBeTruthy();
    expect(screen.getByLabelText('Minha lista')).toBeTruthy();
    for (const article of articles) {
      expect(
        screen.getByLabelText(`${article.titleStart} ${article.titleEnd}`),
      ).toBeTruthy();
    }

    act(() => jest.runOnlyPendingTimers());
    screen.unmount();
  });

  it('busca pelo botão Buscar da Home', () => {
    const screen = render(<App />);
    fireEvent.press(screen.getByLabelText('Buscar'));
    act(() => jest.runOnlyPendingTimers());
    const input = screen.getByLabelText('Campo de busca');
    fireEvent.changeText(input, 'área segura');
    fireEvent(input, 'submitEditing');
    expect(screen.getByText('Resultados para “área segura”')).toBeTruthy();
    expect(screen.getByLabelText('Área segura nas bordas da tela')).toBeTruthy();
    fireEvent.changeText(input, 'futebol');
    fireEvent(input, 'submitEditing');
    expect(screen.getByText('Nenhum card encontrado para “futebol”.')).toBeTruthy();

    act(() => jest.runOnlyPendingTimers());
    screen.unmount();
  });

  it('segurar OK no card abre as opções e salva na Minha lista', async () => {
    const screen = render(<App />);
    await act(async () => {});

    fireEvent(
      screen.getByLabelText('Área segura nas bordas da tela'),
      'longPress',
    );
    expect(screen.getByText('Opções')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Salvar na lista'));
    expect(screen.queryByText('Opções')).toBeNull();

    fireEvent.press(screen.getByLabelText('Minha lista'));
    act(() => jest.runOnlyPendingTimers());
    expect(screen.queryByText(/Sua lista está vazia/)).toBeNull();
    expect(screen.getByLabelText('Área segura nas bordas da tela')).toBeTruthy();

    act(() => jest.runOnlyPendingTimers());
    screen.unmount();
  });

  it('a opção Abrir leva ao detalhe do card', async () => {
    const screen = render(<App />);
    await act(async () => {});
    fireEvent(screen.getByLabelText('Vega OS no Fire TV'), 'longPress');
    fireEvent.press(screen.getByLabelText('Abrir'));
    act(() => jest.runOnlyPendingTimers());
    expect(screen.getByText('‹ Voltar')).toBeTruthy();
    expect(screen.getByText('no Fire TV')).toBeTruthy();

    act(() => jest.runOnlyPendingTimers());
    screen.unmount();
  });
});
