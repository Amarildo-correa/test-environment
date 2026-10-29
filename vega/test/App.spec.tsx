import 'react-native';
import { act, render } from '@testing-library/react-native';
import * as React from 'react';

import { App } from '../src/App';
import { articles } from '../src/content/articles';

// Os hooks de splash e TTFD só funcionam no aparelho: no Jest, o
// react-native-kepler referencia `Platform` sem importá-lo e quebra.
jest.mock('../src/launch', () => ({ useLaunchMetrics: jest.fn() }));

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
    for (const article of articles) {
      expect(
        screen.getByLabelText(`${article.titleStart} ${article.titleEnd}`),
      ).toBeTruthy();
    }

    act(() => jest.runOnlyPendingTimers());
    screen.unmount();
  });
});
