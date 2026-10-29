import 'react-native';
import { act, fireEvent, render } from '@testing-library/react-native';
import * as React from 'react';

import { App } from '../src/App';
import { articles } from '../src/content/articles';
import { setPendingLaunch } from '../src/contentLauncher/pendingLaunch';

// Os hooks de splash e TTFD só funcionam no aparelho: no Jest, o
// react-native-kepler referencia `Platform` sem importá-lo e quebra.
jest.mock('../src/launch', () => ({ useLaunchMetrics: jest.fn() }));
// O servidor do Content Launcher também só existe no aparelho; os pedidos
// são simulados com setPendingLaunch.
jest.mock('../src/contentLauncher/useContentLauncher', () => ({
  useContentLauncher: jest.fn(),
}));

// O stack navigator agenda animações com timers; com timers falsos e a
// desmontagem no fim, nada roda depois que o ambiente de teste fecha.
beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

function finish(screen: ReturnType<typeof render>) {
  act(() => jest.runOnlyPendingTimers());
  screen.unmount();
}

describe('App', () => {
  it('mostra o cabeçalho, o título e os 6 cards da Home', () => {
    const screen = render(<App />);
    expect(screen.getByText('Amazon Fire Stick')).toBeTruthy();
    expect(screen.getByText('VEGA OS')).toBeTruthy();
    expect(screen.getByText('World')).toBeTruthy();
    expect(screen.getByLabelText('Buscar')).toBeTruthy();
    for (const article of articles) {
      expect(
        screen.getByLabelText(`${article.titleStart} ${article.titleEnd}`),
      ).toBeTruthy();
    }
    finish(screen);
  });

  it('abre o card pedido pela Alexa', () => {
    const screen = render(<App />);
    act(() =>
      setPendingLaunch({
        query: 'Abra o card Desenvolva para Experiência na TV no Hello World',
        autoPlay: false,
      }),
    );
    act(() => jest.runOnlyPendingTimers());
    expect(screen.getByText('‹ Voltar')).toBeTruthy();
    expect(screen.getByText('experiência na TV')).toBeTruthy();
    finish(screen);
  });

  it('abre a busca com o pedido quando ele não aponta para um só card', () => {
    const screen = render(<App />);
    act(() => setPendingLaunch({ query: 'TV', autoPlay: false }));
    act(() => jest.runOnlyPendingTimers());
    expect(screen.getByText('Resultados para “TV”')).toBeTruthy();
    expect(screen.getByLabelText('Desenvolva para a experiência na TV')).toBeTruthy();
    expect(screen.getByLabelText('Vega OS no Fire TV')).toBeTruthy();
    finish(screen);
  });

  it('busca pelo botão Buscar da Home', () => {
    const screen = render(<App />);
    fireEvent.press(screen.getByLabelText('Buscar'));
    act(() => jest.runOnlyPendingTimers());
    fireEvent.changeText(screen.getByLabelText('Campo de busca'), 'futebol');
    fireEvent(screen.getByLabelText('Campo de busca'), 'submitEditing');
    expect(screen.getByText('Nenhum card encontrado para “futebol”.')).toBeTruthy();
    finish(screen);
  });
});
